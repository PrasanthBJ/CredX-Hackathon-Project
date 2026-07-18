import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import studentService from "../services/studentService";
import dashboardService from "../services/dashboardService";

export default function StudentDashboard() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    
    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [branch, setBranch] = useState("");
    const [gpa, setGpa] = useState("");
    const [gradYear, setGradYear] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    
    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // stores postingId of the job currently applying to

    const abortControllerRef = useRef(null);

    const loadData = async (signal) => {
        try {
            setLoading(true);
            const data = await dashboardService.getStudentDashboardData({ signal });
            setProfile(data.profile);
            setJobs(data.jobs);
            setApplications(data.applications);
            
            if (data.profile) {
                setBranch(data.profile.branch || "");
                setGpa(data.profile.gpa || "");
                setGradYear(data.profile.gradYear || "");
                setResumeUrl(data.profile.resumeUrl || "");
            } else {
                setIsEditing(true); // default to form if profile doesn't exist
            }
        } catch (err) {
            // Error is handled globally by Axios interceptor
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

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const updated = await studentService.createOrUpdateProfile({
                branch,
                gpa: parseFloat(gpa),
                gradYear: parseInt(gradYear),
                resumeUrl,
            });
            setProfile(updated);
            setIsEditing(false);
            
            // Trigger success message
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Profile saved successfully!" }
            }));
            
            // Reload applications and jobs as GPA might have changed eligibility
            loadData();
        } catch (err) {
            // Error handled globally
        } finally {
            setSubmitting(false);
        }
    };

    const handleApply = async (postingId) => {
        setActionLoading(postingId);
        try {
            const newApp = await studentService.applyToJobPosting(postingId);
            setApplications((prev) => [...prev, newApp]);
            
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Application submitted successfully!" }
            }));
        } catch (err) {
            // Error handled globally
        } finally {
            setActionLoading(null);
        }
    };

    const hasApplied = (postingId) => {
        return applications.some((app) => app.postingId === postingId);
    };

    const getApplicationStatus = (postingId) => {
        const app = applications.find((a) => a.postingId === postingId);
        return app ? app.status : null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Spinner label="Loading student dashboard..." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PageHeader 
                    title="Student Dashboard" 
                    subtitle={`Welcome back! Keep your profile updated to match with placements.`} 
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-base font-semibold text-surface">Academic Profile</h2>
                                {profile && !isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                                    >
                                        Edit profile
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSaveProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                            Branch / Major
                                        </label>
                                        <input
                                            required
                                            value={branch}
                                            onChange={(e) => setBranch(e.target.value)}
                                            placeholder="Computer Science"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                            GPA (out of 10.0 or 4.0)
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="10"
                                            value={gpa}
                                            onChange={(e) => setGpa(e.target.value)}
                                            placeholder="9.15"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                            Graduation Year
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            value={gradYear}
                                            onChange={(e) => setGradYear(e.target.value)}
                                            placeholder="2026"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                            Resume URL
                                        </label>
                                        <input
                                            required
                                            type="url"
                                            value={resumeUrl}
                                            onChange={(e) => setResumeUrl(e.target.value)}
                                            placeholder="https://drive.google.com/..."
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-2.5 pt-2">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg py-2 transition-colors disabled:opacity-60"
                                        >
                                            {submitting ? "Saving..." : "Save Profile"}
                                        </button>
                                        {profile && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setBranch(profile.branch);
                                                    setGpa(profile.gpa);
                                                    setGradYear(profile.gradYear);
                                                    setResumeUrl(profile.resumeUrl);
                                                }}
                                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg py-2 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="border-b border-slate-100 pb-3">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Branch</p>
                                        <p className="text-sm font-medium text-slate-800">{profile.branch}</p>
                                    </div>
                                    <div className="border-b border-slate-100 pb-3">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">GPA</p>
                                        <p className="text-sm font-medium text-slate-800">{profile.gpa.toFixed(2)}</p>
                                    </div>
                                    <div className="border-b border-slate-100 pb-3">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Graduation Year</p>
                                        <p className="text-sm font-medium text-slate-800">{profile.gradYear}</p>
                                    </div>
                                    <div className="pb-1">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Resume Link</p>
                                        <a
                                            href={profile.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-accent hover:text-accent-hover underline break-all font-mono"
                                        >
                                            View Resume &rarr;
                                        </a>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right Columns: Open Postings and Applications */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* My Applications Section */}
                        <div>
                            <h2 className="text-base font-semibold text-surface mb-4">My Applications</h2>
                            {applications.length === 0 ? (
                                <EmptyState 
                                    title="No applications submitted" 
                                    description="Apply to approved job postings below to get started." 
                                />
                            ) : (
                                <div className="space-y-3">
                                    {applications.map((app) => (
                                        <Card key={app.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800">{app.postingTitle}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">{app.companyName}</p>
                                                <p className="text-[10px] font-mono text-slate-400 mt-2">
                                                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <StatusBadge status={app.status} />
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Approved Jobs Section */}
                        <div>
                            <h2 className="text-base font-semibold text-surface mb-4">Open Job Opportunities</h2>
                            {jobs.length === 0 ? (
                                <EmptyState 
                                    title="No job postings available" 
                                    description="Check back later for approved opportunities from recruiting companies." 
                                />
                            ) : (
                                <div className="space-y-4">
                                    {jobs.map((job) => {
                                        const applied = hasApplied(job.id);
                                        const status = getApplicationStatus(job.id);
                                        const isGpaEligible = profile ? profile.gpa >= job.minGpa : false;
                                        
                                        return (
                                            <Card key={job.id} className="relative hover:border-slate-300 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-slate-800">{job.title}</h3>
                                                        <p className="text-xs text-slate-500">{job.companyName}</p>
                                                    </div>
                                                    {applied && <StatusBadge status={status} />}
                                                </div>

                                                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                                                    {job.description}
                                                </p>

                                                {job.eligibility && (
                                                    <div className="bg-slate-50 rounded-lg p-2.5 mb-4 text-xs">
                                                        <span className="font-medium text-slate-700">Eligibility Criteria:</span>{" "}
                                                        <span className="text-slate-600">{job.eligibility}</span>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                                                    <div className="flex gap-4">
                                                        <div className="text-[10px] font-mono">
                                                            <span className="text-slate-400">MIN GPA:</span>{" "}
                                                            <span className={`font-semibold ${isGpaEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                {job.minGpa.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="text-[10px] font-mono">
                                                            <span className="text-slate-400">DEADLINE:</span>{" "}
                                                            <span className="font-semibold text-slate-700">
                                                                {new Date(job.deadline).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {!profile ? (
                                                        <span className="text-[10px] font-medium text-rose-500 uppercase">
                                                            Create profile to apply
                                                        </span>
                                                    ) : applied ? (
                                                        <button
                                                            disabled
                                                            className="bg-slate-100 text-slate-400 text-xs font-medium rounded-lg px-4 py-2 cursor-not-allowed"
                                                        >
                                                            Applied
                                                        </button>
                                                    ) : !isGpaEligible ? (
                                                        <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wide">
                                                            GPA too low (requires {job.minGpa.toFixed(2)})
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleApply(job.id)}
                                                            disabled={actionLoading === job.id}
                                                            className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-60 shadow-sm"
                                                        >
                                                            {actionLoading === job.id ? "Applying..." : "Apply Now"}
                                                        </button>
                                                    )}
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}