import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useParams, useNavigate } from "react-router-dom";
import { Briefcase, PlusCircle, Users, Clock3, ArrowLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import {
    getMyPostings,
    createPosting,
    getApplicants,
    updateApplicationStatus,
} from "../api/companyApi";

const LINKS = [
    { to: "/company", label: "My Postings", icon: Briefcase, end: true },
    { to: "/company/create", label: "Create Posting", icon: PlusCircle },
];

function MyPostings() {
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getMyPostings()
            .then((res) => setPostings(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner label="Loading postings..." />;

    const approvedCount = postings.filter((p) => p.status === "APPROVED").length;
    const pendingCount = postings.filter((p) => p.status === "PENDING").length;

    return (
        <>
            <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard label="Total Postings" value={postings.length} icon={Briefcase} accent />
                <StatCard label="Approved" value={approvedCount} icon={Users} />
                <StatCard label="Pending Review" value={pendingCount} icon={Clock3} />
            </div>

            {postings.length === 0 ? (
                <EmptyState
                    title="No postings yet"
                    description="Create your first posting to start recruiting students."
                />
            ) : (
                <div className="grid gap-4">
                    {postings.map((posting) => (
                        <Card key={posting.id}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-surface">{posting.title}</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">{posting.description}</p>
                                    {posting.eligibility && (
                                        <p className="text-xs text-slate-500 mt-2 font-mono bg-slate-50 inline-block px-2 py-1 rounded-md">
                                            {posting.eligibility}
                                        </p>
                                    )}
                                </div>
                                <StatusBadge status={posting.status} />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Deadline: {posting.deadline}
                </span>
                                {posting.status === "APPROVED" && (
                                    <button
                                        onClick={() => navigate(`/company/postings/${posting.id}/applicants`)}
                                        className="text-sm font-medium text-accent hover:text-accent-hover"
                                    >
                                        View Applicants &rarr;
                                    </button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}

function CreatePosting() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        eligibility: "",
        minGpa: "",
        deadline: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await createPosting(form);
            setSuccess(true);
            setForm({ title: "", description: "", eligibility: "", minGpa: "", deadline: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Could not create posting.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="max-w-xl">
            {error && (
                <div className="mb-4 text-sm text-status-rejected bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 text-sm text-status-pending bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                    Posting submitted — it will be visible to students once approved by the placement admin.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                        Title
                    </label>
                    <input
                        required
                        value={form.title}
                        onChange={handleChange("title")}
                        placeholder="Frontend Developer Intern"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                        Description
                    </label>
                    <textarea
                        required
                        rows={3}
                        value={form.description}
                        onChange={handleChange("description")}
                        placeholder="What the role involves..."
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                        Eligibility
                    </label>
                    <input
                        value={form.eligibility}
                        onChange={handleChange("eligibility")}
                        placeholder="CGPA > 7, CSE/IT only"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                            Min GPA
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={form.minGpa}
                            onChange={handleChange("minGpa")}
                            placeholder="7.0"
                            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                            Deadline
                        </label>
                        <input
                            type="date"
                            required
                            value={form.deadline}
                            onChange={handleChange("deadline")}
                            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60"
                >
                    {submitting ? "Submitting..." : "Submit for Review"}
                </button>
            </form>
        </Card>
    );
}

function Applicants() {
    const { postingId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const load = () => {
        setLoading(true);
        getApplicants(postingId)
            .then((res) => setApplicants(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(load, [postingId]);

    const handleStatusChange = async (applicationId, status) => {
        setUpdatingId(applicationId);
        try {
            await updateApplicationStatus(applicationId, status);
            load();
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <Spinner label="Loading applicants..." />;

    return (
        <>
            <button
                onClick={() => navigate("/company")}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent mb-5"
            >
                <ArrowLeft size={15} /> Back to postings
            </button>

            {applicants.length === 0 ? (
                <EmptyState title="No applicants yet" description="Check back once students start applying." />
            ) : (
                <div className="grid gap-4">
                    {applicants.map((app) => (
                        <Card key={app.id}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-surface">{app.studentName}</h3>
                                    <p className="text-sm text-slate-500">
                                        {app.branch} &middot; GPA {app.gpa}
                                    </p>
                                </div>
                                <StatusBadge status={app.status} />
                            </div>

                            <div className="mt-4 flex gap-2 justify-end">
                                {app.status !== "SHORTLISTED" && app.status !== "SELECTED" && (
                                    <button
                                        disabled={updatingId === app.id}
                                        onClick={() => handleStatusChange(app.id, "SHORTLISTED")}
                                        className="text-xs font-medium rounded-lg px-3 py-1.5 border border-violet-300 text-violet-700 hover:bg-violet-50 transition-colors"
                                    >
                                        Shortlist
                                    </button>
                                )}
                                {app.status !== "SELECTED" && (
                                    <button
                                        disabled={updatingId === app.id}
                                        onClick={() => handleStatusChange(app.id, "SELECTED")}
                                        className="text-xs font-medium rounded-lg px-3 py-1.5 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors"
                                    >
                                        Select
                                    </button>
                                )}
                                {app.status !== "REJECTED" && (
                                    <button
                                        disabled={updatingId === app.id}
                                        onClick={() => handleStatusChange(app.id, "REJECTED")}
                                        className="text-xs font-medium rounded-lg px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors"
                                    >
                                        Reject
                                    </button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}

const PAGE_META = {
    "/company": { title: "My Postings", subtitle: "Track the status of every posting you've submitted." },
    "/company/create": { title: "Create Posting", subtitle: "Submit a new role for admin review." },
};

export default function CompanyDashboard() {
    const location = useLocation();
    const isApplicantsPage = location.pathname.includes("/applicants");
    const meta = isApplicantsPage
        ? { title: "Applicants", subtitle: "Review and update applicant status." }
        : PAGE_META[location.pathname] || PAGE_META["/company"];

    return (
        <div className="min-h-screen bg-bg flex">
            <Sidebar links={LINKS} />
            <div className="flex-1 flex flex-col">
                <Topbar title={meta.title} subtitle={meta.subtitle} />
                <div className="flex-1 px-10 py-8 max-w-5xl">
                    <Routes>
                        <Route index element={<MyPostings />} />
                        <Route path="create" element={<CreatePosting />} />
                        <Route path="postings/:postingId/applicants" element={<Applicants />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}