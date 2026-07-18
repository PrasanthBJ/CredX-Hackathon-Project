import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import companyService from "../services/companyService";
import dashboardService from "../services/dashboardService";

export default function CompanyDashboard() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    
    // Profile form state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    
    // Job posting form state
    const [isPostingJob, setIsPostingJob] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobEligibility, setJobEligibility] = useState("");
    const [jobMinGpa, setJobMinGpa] = useState("");
    const [jobDeadline, setJobDeadline] = useState("");
    
    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingJob, setSubmittingJob] = useState(false);

    const abortControllerRef = useRef(null);

    const loadData = async (signal) => {
        try {
            setLoading(true);
            const data = await dashboardService.getCompanyDashboardData({ signal });
            setProfile(data.profile);
            setJobs(data.jobs);
            
            if (data.profile) {
                setCompanyName(data.profile.companyName || "");
                setDescription(data.profile.description || "");
                setWebsite(data.profile.website || "");
            } else {
                setIsEditingProfile(true); // default to profile form if profile doesn't exist
            }
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

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSubmittingProfile(true);
        try {
            const updated = await companyService.createOrUpdateProfile({
                companyName,
                description,
                website,
            });
            setProfile(updated);
            setIsEditingProfile(false);
            
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Company profile updated!" }
            }));
        } catch (err) {
            // Handled globally
        } finally {
            setSubmittingProfile(false);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setSubmittingJob(true);
        try {
            // Format ISO date format for Spring Boot LocalDateTime mapping
            const localIsoDeadline = new Date(jobDeadline).toISOString().slice(0, 19); // yyyy-MM-ddTHH:mm:ss
            
            const newJob = await companyService.createJobPosting({
                title: jobTitle,
                description: jobDesc,
                eligibility: jobEligibility,
                minGpa: parseFloat(jobMinGpa),
                deadline: localIsoDeadline,
            });
            
            setJobs((prev) => [newJob, ...prev]);
            setIsPostingJob(false);
            
            // Reset form fields
            setJobTitle("");
            setJobDesc("");
            setJobEligibility("");
            setJobMinGpa("");
            setJobDeadline("");

            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Job posting created! Awaiting placement admin approval." }
            }));
        } catch (err) {
            // Handled globally
        } finally {
            setSubmittingJob(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Spinner label="Loading company dashboard..." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PageHeader 
                    title="Company Dashboard" 
                    subtitle={profile ? `Manage job listings and applications for ${profile.companyName}.` : "Set up your recruiter profile."}
                    action={
                        profile && !isPostingJob && (
                            <button
                                onClick={() => setIsPostingJob(true)}
                                className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-4 py-2.5 transition-colors shadow-sm"
                            >
                                Post a Job
                            </button>
                        )
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Recruiter Profile */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-base font-semibold text-surface">Company Profile</h2>
                                {profile && !isEditingProfile && (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                                    >
                                        Edit profile
                                    </button>
                                )}
                            </div>

                            {isEditingProfile ? (
                                <form onSubmit={handleSaveProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                            Company Name
                                        </label>
                                        <input
                                            required
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="Stark Industries"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                            Website URL
                                        </label>
                                        <input
                                            required
                                            type="url"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            placeholder="https://stark.com"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                            Brief Description
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Briefly describe your company, culture, and core technology."
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-2.5 pt-2">
                                        <button
                                            type="submit"
                                            disabled={submittingProfile}
                                            className="flex-1 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg py-2 transition-colors disabled:opacity-60"
                                        >
                                            {submittingProfile ? "Saving..." : "Save Profile"}
                                        </button>
                                        {profile && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditingProfile(false);
                                                    setCompanyName(profile.companyName);
                                                    setDescription(profile.description);
                                                    setWebsite(profile.website);
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
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Company Name</p>
                                        <p className="text-sm font-semibold text-slate-800">{profile.companyName}</p>
                                    </div>
                                    <div className="border-b border-slate-100 pb-3">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Website</p>
                                        <a
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-accent hover:text-accent-hover underline font-mono"
                                        >
                                            {profile.website}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Description</p>
                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{profile.description}</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right Columns: Job Postings & Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {isPostingJob && (
                            <Card className="border-accent/40 bg-accent/[0.01]">
                                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                                    <h2 className="text-base font-semibold text-slate-800">Create New Job Posting</h2>
                                    <button
                                        onClick={() => setIsPostingJob(false)}
                                        className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <form onSubmit={handleCreateJob} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                                Job Title
                                            </label>
                                            <input
                                                required
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                placeholder="Software Engineer Intern"
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                                Minimum CGPA Required
                                            </label>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="10"
                                                value={jobMinGpa}
                                                onChange={(e) => setJobMinGpa(e.target.value)}
                                                placeholder="8.0"
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                                Application Deadline
                                            </label>
                                            <input
                                                required
                                                type="datetime-local"
                                                value={jobDeadline}
                                                onChange={(e) => setJobDeadline(e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                                Eligibility Criteria
                                            </label>
                                            <input
                                                required
                                                value={jobEligibility}
                                                onChange={(e) => setJobEligibility(e.target.value)}
                                                placeholder="B.Tech (CSE, IT, ECE) only"
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                                            Job Description
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={jobDesc}
                                            onChange={(e) => setJobDesc(e.target.value)}
                                            placeholder="Detail the roles, responsibilities, technology stack, and expectations..."
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={submittingJob}
                                            className="w-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-60 shadow-sm"
                                        >
                                            {submittingJob ? "Posting Job..." : "Post Job Opening"}
                                        </button>
                                    </div>
                                </form>
                            </Card>
                        )}

                        <div>
                            <h2 className="text-base font-semibold text-surface mb-4">Our Job Postings</h2>
                            {jobs.length === 0 ? (
                                <EmptyState
                                    title="No jobs posted yet"
                                    description="Get started by listing your first internship or full-time opening."
                                />
                            ) : (
                                <div className="space-y-4">
                                    {jobs.map((job) => (
                                        <Card key={job.id} className="hover:border-slate-300 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-800">{job.title}</h3>
                                                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                                                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <StatusBadge status={job.status} />
                                            </div>

                                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap mb-4">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-slate-100 text-[10px] font-mono">
                                                <div>
                                                    <span className="text-slate-400">MIN GPA:</span>{" "}
                                                    <span className="font-semibold text-slate-700">{job.minGpa.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">ELIGIBILITY:</span>{" "}
                                                    <span className="font-semibold text-slate-700">{job.eligibility}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">DEADLINE:</span>{" "}
                                                    <span className="font-semibold text-slate-700">
                                                        {new Date(job.deadline).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {job.reviewedByName && (
                                                    <div className="ml-auto text-[9px] text-slate-400 uppercase">
                                                        Reviewed By: {job.reviewedByName}
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}