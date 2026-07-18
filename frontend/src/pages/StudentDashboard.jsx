import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LayoutGrid, FileCheck2, Building2, Clock } from "lucide-react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import {
    getApprovedPostings,
    applyToPosting,
    getMyApplications,
} from "../api/studentApi";

const LINKS = [
    { to: "/student", label: "Browse Postings", icon: LayoutGrid, end: true },
    { to: "/student/applications", label: "My Applications", icon: FileCheck2 },
];

function CompanyAvatar({ name }) {
    const initial = name?.charAt(0)?.toUpperCase() || "?";
    return (
        <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-sm shrink-0">
            {initial}
        </div>
    );
}

function BrowsePostings() {
    const [postings, setPostings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);
    const [error, setError] = useState("");
    const [appliedIds, setAppliedIds] = useState(new Set());

    const loadPostings = async () => {
        setLoading(true);
        setError("");
        try {
            const [postingsRes, applicationsRes] = await Promise.all([
                getApprovedPostings(),
                getMyApplications(),
            ]);
            setPostings(postingsRes.data);
            setApplications(applicationsRes.data);
            setAppliedIds(new Set(applicationsRes.data.map((a) => a.postingId)));
        } catch (err) {
            setError("Could not load postings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPostings();
    }, []);

    const handleApply = async (postingId) => {
        setApplyingId(postingId);
        try {
            await applyToPosting(postingId);
            setAppliedIds((prev) => new Set(prev).add(postingId));
        } catch (err) {
            setError(err.response?.data?.message || "Could not submit application.");
        } finally {
            setApplyingId(null);
        }
    };

    if (loading) return <Spinner label="Loading postings..." />;

    const selectedCount = applications.filter((a) => a.status === "SELECTED").length;

    return (
        <>
            <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard label="Open Postings" value={postings.length} icon={LayoutGrid} accent />
                <StatCard label="Applications Sent" value={applications.length} icon={FileCheck2} />
                <StatCard label="Selected" value={selectedCount} icon={Building2} />
            </div>

            {error && (
                <div className="mb-4 text-sm text-status-rejected bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                    {error}
                </div>
            )}

            {postings.length === 0 ? (
                <EmptyState
                    title="No open postings right now"
                    description="Approved postings from companies will appear here as soon as they're live."
                />
            ) : (
                <div className="grid gap-4">
                    {postings.map((posting) => {
                        const alreadyApplied = appliedIds.has(posting.id);
                        return (
                            <Card key={posting.id}>
                                <div className="flex items-start gap-4">
                                    <CompanyAvatar name={posting.companyName} />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-surface">{posting.title}</h3>
                                                <p className="text-sm text-slate-500">{posting.companyName}</p>
                                            </div>
                                            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                        <Clock size={13} />
                                                {posting.deadline}
                      </span>
                                        </div>

                                        <p className="text-sm text-slate-600 mt-3">{posting.description}</p>

                                        {posting.eligibility && (
                                            <p className="text-xs text-slate-500 mt-2 font-mono bg-slate-50 inline-block px-2 py-1 rounded-md">
                                                {posting.eligibility}
                                            </p>
                                        )}

                                        <div className="mt-4 flex justify-end">
                                            <button
                                                disabled={alreadyApplied || applyingId === posting.id}
                                                onClick={() => handleApply(posting.id)}
                                                className={`text-sm font-medium rounded-lg px-4 py-2 transition-colors ${
                                                    alreadyApplied
                                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                        : "bg-accent hover:bg-accent-hover text-white disabled:opacity-60"
                                                }`}
                                            >
                                                {alreadyApplied
                                                    ? "Applied"
                                                    : applyingId === posting.id
                                                        ? "Applying..."
                                                        : "Apply"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
}

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyApplications()
            .then((res) => setApplications(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner label="Loading applications..." />;

    if (applications.length === 0) {
        return (
            <EmptyState
                title="No applications yet"
                description="Apply to a posting from the Browse Postings tab to see it tracked here."
            />
        );
    }

    return (
        <div className="grid gap-4">
            {applications.map((app) => (
                <Card key={app.id}>
                    <div className="flex items-center gap-4">
                        <CompanyAvatar name={app.companyName} />
                        <div className="flex-1 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-surface">{app.postingTitle}</h3>
                                <p className="text-sm text-slate-500">{app.companyName}</p>
                            </div>
                            <div className="text-right">
                                <StatusBadge status={app.status} />
                                <p className="text-xs text-slate-400 font-mono mt-2">
                                    Applied {app.appliedAt}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}

const PAGE_META = {
    "/student": {
        title: "Browse Postings",
        subtitle: "Approved opportunities open for applications.",
    },
    "/student/applications": {
        title: "My Applications",
        subtitle: "Track the status of every application you've submitted.",
    },
};

export default function StudentDashboard() {
    const location = useLocation();
    const meta = PAGE_META[location.pathname] || PAGE_META["/student"];

    return (
        <div className="min-h-screen bg-bg flex">
            <Sidebar links={LINKS} />
            <div className="flex-1 px-10 py-8 max-w-5xl">
                <div className="mb-7">
                    <h1 className="text-xl font-semibold text-surface">{meta.title}</h1>
                    <p className="text-sm text-slate-500 mt-1">{meta.subtitle}</p>
                </div>

                <Routes>
                    <Route index element={<BrowsePostings />} />
                    <Route path="applications" element={<MyApplications />} />
                </Routes>
            </div>
        </div>
    );
}