import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import adminService from "../services/adminService";
import dashboardService from "../services/dashboardService";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        totalApplications: 0,
        placementRatePercentage: 0.0,
    });
    const [companyStats, setCompanyStats] = useState({});
    
    const [actionLoading, setActionLoading] = useState(null); // stores postingId of job currently approving/rejecting

    const abortControllerRef = useRef(null);

    const loadData = async (signal) => {
        try {
            setLoading(true);
            const data = await dashboardService.getAdminDashboardData({ signal });
            setPendingJobs(data.pendingJobs);
            setAllJobs(data.allJobs);
            setStats(data.placementRate);
            setCompanyStats(data.companyStats);
        } catch (err) {
            // Handled globally
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        loadData(controller.signal);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleApprove = async (id) => {
        setActionLoading({ id, type: "approve" });
        try {
            const updated = await adminService.approveJobPosting(id);
            
            // Move from pending to all jobs list update
            setPendingJobs((prev) => prev.filter((job) => job.id !== id));
            setAllJobs((prev) => prev.map((job) => (job.id === id ? updated : job)));
            
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Job posting approved!" }
            }));
        } catch (err) {
            // Handled globally
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        setActionLoading({ id, type: "reject" });
        try {
            const updated = await adminService.rejectJobPosting(id);
            
            setPendingJobs((prev) => prev.filter((job) => job.id !== id));
            setAllJobs((prev) => prev.map((job) => (job.id === id ? updated : job)));
            
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Job posting rejected!" }
            }));
        } catch (err) {
            // Handled globally
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Spinner label="Loading administration portal..." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PageHeader 
                    title="Placement Administration" 
                    subtitle="Monitor placement ratios, company engagement, and approve job postings."
                />

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <Card className="flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Students</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-semibold text-slate-800">{stats?.totalStudents ?? 0}</span>
                            <span className="text-xs text-slate-500">registered</span>
                        </div>
                    </Card>

                    <Card className="flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Recruiter Partners</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-semibold text-slate-800">{stats?.totalCompanies ?? 0}</span>
                            <span className="text-xs text-slate-500">companies</span>
                        </div>
                    </Card>

                    <Card className="flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Applications</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-semibold text-slate-800">{stats?.totalApplications ?? 0}</span>
                            <span className="text-xs text-slate-500">submitted</span>
                        </div>
                    </Card>

                    <Card className="flex flex-col justify-between bg-accent/[0.02] border-accent/20">
                        <span className="text-[10px] font-mono text-accent uppercase tracking-wider">Placement Rate</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-semibold text-accent">{(stats?.placementRatePercentage ?? 0).toFixed(1)}%</span>
                            <span className="text-xs text-slate-500">placed students</span>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Columns: Job Approvals & All Listings */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Pending Approvals */}
                        <div>
                            <h2 className="text-base font-semibold text-surface mb-4">Pending Approvals ({pendingJobs.length})</h2>
                            {pendingJobs.length === 0 ? (
                                <EmptyState 
                                    title="No pending approvals" 
                                    description="Companies haven't submitted any new job posts for review." 
                                />
                            ) : (
                                <div className="space-y-4">
                                    {pendingJobs.map((job) => (
                                        <Card key={job.id}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-800">{job.title}</h3>
                                                    <p className="text-xs text-slate-500">{job.companyName}</p>
                                                </div>
                                                <StatusBadge status={job.status} />
                                            </div>

                                            <p className="text-xs text-slate-600 leading-relaxed mb-4">{job.description}</p>
                                            
                                            <div className="bg-slate-50 rounded-lg p-3 mb-4 text-xs space-y-1.5 font-mono">
                                                <div>
                                                    <span className="text-slate-400">Min GPA Required:</span>{" "}
                                                    <span className="font-semibold text-slate-700">{job.minGpa.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Eligibility:</span>{" "}
                                                    <span className="font-semibold text-slate-700">{job.eligibility}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Deadline:</span>{" "}
                                                    <span className="font-semibold text-slate-700">
                                                        {new Date(job.deadline).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleReject(job.id)}
                                                    disabled={actionLoading !== null}
                                                    className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
                                                >
                                                    {actionLoading?.id === job.id && actionLoading?.type === "reject" ? "Rejecting..." : "Reject"}
                                                </button>
                                                <button
                                                    onClick={() => handleApprove(job.id)}
                                                    disabled={actionLoading !== null}
                                                    className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-60 shadow-sm"
                                                >
                                                    {actionLoading?.id === job.id && actionLoading?.type === "approve" ? "Approving..." : "Approve"}
                                                </button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All Job Postings List */}
                        <div>
                            <h2 className="text-base font-semibold text-surface mb-4">All Job Listings ({allJobs.length})</h2>
                            {allJobs.length === 0 ? (
                                <EmptyState title="No job listings found" />
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse text-xs">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                                                    <th className="p-4">Title</th>
                                                    <th className="p-4">Company</th>
                                                    <th className="p-4">Deadline</th>
                                                    <th className="p-4">Status</th>
                                                    <th className="p-4">Reviewed By</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {allJobs.map((job) => (
                                                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                                                        <td className="p-4 font-medium text-slate-900">{job.title}</td>
                                                        <td className="p-4">{job.companyName}</td>
                                                        <td className="p-4">{new Date(job.deadline).toLocaleDateString()}</td>
                                                        <td className="p-4"><StatusBadge status={job.status} /></td>
                                                        <td className="p-4 text-slate-500 font-mono text-[10px]">
                                                            {job.reviewedByName || <span className="text-slate-300">&mdash;</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Company Engagement Metrics */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <h2 className="text-base font-semibold text-surface mb-5">Applications Per Company</h2>
                            {Object.keys(companyStats || {}).length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-6">No data available</p>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(companyStats || {}).map(([name, count]) => (
                                        <div key={name} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                            <span className="font-medium text-slate-700">{name}</span>
                                            <span className="font-mono bg-slate-100 text-slate-600 rounded px-2 py-0.5 font-semibold">
                                                {count} applications
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}