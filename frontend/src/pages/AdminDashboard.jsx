import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ClipboardCheck, ListChecks, BarChart3, Check, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import {
    getPendingPostings,
    getAllPostings,
    approvePosting,
    rejectPosting,
    getApplicationsPerCompany,
    getPlacementRate,
} from "../api/adminApi";

const LINKS = [
    { to: "/admin", label: "Pending Review", icon: ClipboardCheck, end: true },
    { to: "/admin/all-postings", label: "All Postings", icon: ListChecks },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

function PendingReview() {
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState(null);
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        getPendingPostings()
            .then((res) => setPostings(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleDecision = async (id, action) => {
        setActingId(id);
        setError("");
        try {
            if (action === "approve") await approvePosting(id);
            else await rejectPosting(id);
            setPostings((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Could not update posting status.");
        } finally {
            setActingId(null);
        }
    };

    if (loading) return <Spinner label="Loading pending postings..." />;

    return (
        <>
            <div className="grid grid-cols-1 gap-4 mb-8 max-w-xs">
                <StatCard label="Awaiting Review" value={postings.length} icon={ClipboardCheck} accent />
            </div>

            {error && (
                <div className="mb-4 text-sm text-status-rejected bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                    {error}
                </div>
            )}

            {postings.length === 0 ? (
                <EmptyState
                    title="Nothing pending"
                    description="New postings from companies will appear here for your review."
                />
            ) : (
                <div className="grid gap-4">
                    {postings.map((posting) => (
                        <Card key={posting.id}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-surface">{posting.title}</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">{posting.companyName}</p>
                                    <p className="text-sm text-slate-600 mt-3">{posting.description}</p>
                                    {posting.eligibility && (
                                        <p className="text-xs text-slate-500 mt-2 font-mono bg-slate-50 inline-block px-2 py-1 rounded-md">
                                            {posting.eligibility}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                  Deadline: {posting.deadline}
                </span>
                            </div>

                            <div className="mt-4 flex gap-2 justify-end">
                                <button
                                    disabled={actingId === posting.id}
                                    onClick={() => handleDecision(posting.id, "reject")}
                                    className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-60"
                                >
                                    <X size={15} /> Reject
                                </button>
                                <button
                                    disabled={actingId === posting.id}
                                    onClick={() => handleDecision(posting.id, "approve")}
                                    className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3.5 py-2 bg-accent hover:bg-accent-hover text-white transition-colors disabled:opacity-60"
                                >
                                    <Check size={15} /> Approve
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}

function AllPostings() {
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllPostings()
            .then((res) => setPostings(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner label="Loading postings..." />;

    if (postings.length === 0) {
        return <EmptyState title="No postings yet" description="Postings will appear here once companies start submitting." />;
    }

    return (
        <div className="grid gap-4">
            {postings.map((posting) => (
                <Card key={posting.id}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-surface">{posting.title}</h3>
                            <p className="text-sm text-slate-500">{posting.companyName}</p>
                        </div>
                        <StatusBadge status={posting.status} />
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-3">Deadline: {posting.deadline}</p>
                </Card>
            ))}
        </div>
    );
}

function Analytics() {
    const [companyStats, setCompanyStats] = useState([]);
    const [placementRate, setPlacementRate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getApplicationsPerCompany(), getPlacementRate()])
            .then(([companyRes, rateRes]) => {
                setCompanyStats(companyRes.data);
                setPlacementRate(rateRes.data);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner label="Loading analytics..." />;

    const maxApplications = Math.max(...companyStats.map((c) => c.applicationCount), 1);

    return (
        <>
            <div className="grid grid-cols-2 gap-4 mb-8">
                <StatCard
                    label="Placement Rate"
                    value={placementRate ? `${placementRate.rate}%` : "—"}
                    icon={BarChart3}
                    accent
                />
                <StatCard
                    label="Students Placed"
                    value={placementRate ? placementRate.selectedCount : "—"}
                    icon={ClipboardCheck}
                />
            </div>

            <Card>
                <h3 className="font-semibold text-surface mb-5">Applications per Company</h3>
                {companyStats.length === 0 ? (
                    <p className="text-sm text-slate-500">No application data yet.</p>
                ) : (
                    <div className="space-y-4">
                        {companyStats.map((c) => (
                            <div key={c.companyName}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-medium text-slate-700">{c.companyName}</span>
                                    <span className="font-mono text-slate-500">{c.applicationCount}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className="h-full bg-accent rounded-full transition-all"
                                        style={{ width: `${(c.applicationCount / maxApplications) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </>
    );
}

const PAGE_META = {
    "/admin": { title: "Pending Review", subtitle: "Approve or reject postings before they reach students." },
    "/admin/all-postings": { title: "All Postings", subtitle: "Every posting submitted, across all statuses." },
    "/admin/analytics": { title: "Analytics", subtitle: "Recruiting activity across the placement cycle." },
};

export default function AdminDashboard() {
    const location = useLocation();
    const meta = PAGE_META[location.pathname] || PAGE_META["/admin"];

    return (
        <div className="min-h-screen bg-bg flex">
            <Sidebar links={LINKS} />
            <div className="flex-1 flex flex-col">
                <Topbar title={meta.title} subtitle={meta.subtitle} />
                <div className="flex-1 px-10 py-8 max-w-5xl">
                    <Routes>
                        <Route index element={<PendingReview />} />
                        <Route path="all-postings" element={<AllPostings />} />
                        <Route path="analytics" element={<Analytics />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}