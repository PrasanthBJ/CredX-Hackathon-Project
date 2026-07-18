import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import studentService from "../services/studentService";
import dashboardService from "../services/dashboardService";
import authService from "../services/authService";
import { User, FileText, Briefcase, Calendar, GraduationCap, Award, ExternalLink, BarChart2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";

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
    const location = useLocation();
    const profileRef = useRef(null);
    const applicationsRef = useRef(null);
    const jobsRef = useRef(null);

    const [activeTab, setActiveTab] = useState("dashboard");
    const [settingsName, setSettingsName] = useState("");
    const [settingsEmail, setSettingsEmail] = useState("");
    const [settingsProfileImage, setSettingsProfileImage] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        if (tab === "profile") {
            setIsEditing(true);
            setActiveTab("dashboard");
            setTimeout(() => {
                profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else if (tab === "applications") {
            setIsEditing(false);
            setActiveTab("dashboard");
            setTimeout(() => {
                applicationsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else if (tab === "jobs") {
            setIsEditing(false);
            setActiveTab("dashboard");
            setTimeout(() => {
                jobsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else if (tab === "settings") {
            setActiveTab("settings");
        } else {
            setActiveTab("dashboard");
            setIsEditing(false);
        }
    }, [location.search]);

    const loadSettings = async () => {
        try {
            const data = await authService.getSettings();
            setSettingsName(data.name || "");
            setSettingsEmail(data.email || "");
            setSettingsProfileImage(data.profileImage || "");
            if (data.profileImage) {
                localStorage.setItem("profileImage", data.profileImage);
                window.dispatchEvent(new CustomEvent("profile-image-updated", { detail: data.profileImage }));
            }
        } catch (err) {
            // Handled
        }
    };

    const loadData = async (signal) => {
        try {
            setLoading(true);
            const data = await dashboardService.getStudentDashboardData({ signal });
            setProfile(data.profile);
            setJobs(data.jobs);
            setApplications(data.applications);
            
            if (data.profile) {
                setBranch(data.profile.branch || "");
                setGpa(data.profile.gpa !== undefined && data.profile.gpa !== null ? String(data.profile.gpa) : "");
                setGradYear(data.profile.gradYear !== undefined && data.profile.gradYear !== null ? String(data.profile.gradYear) : "");
                setResumeUrl(data.profile.resumeUrl || "");
            } else {
                setIsEditing(true); // default to form if profile doesn't exist
            }

            await loadSettings();
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
        setSubmitting(true);
        try {
            const profileData = {
                branch: branch || null,
                gpa: gpa && !isNaN(parseFloat(gpa)) ? parseFloat(gpa) : null,
                gradYear: gradYear && !isNaN(parseInt(gradYear)) ? parseInt(gradYear) : null,
                resumeUrl: resumeUrl || null
            };
            const updated = await studentService.createOrUpdateProfile(profileData);
            setProfile(updated);
            setIsEditing(false);
            
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Profile saved successfully!" }
            }));
            
            loadData();
        } catch (err) {
            // Handled globally
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            await authService.updateSettings({
                name: settingsName,
                email: settingsEmail,
                profileImage: settingsProfileImage
            });
            localStorage.setItem("profileImage", settingsProfileImage || "");
            window.dispatchEvent(new CustomEvent("profile-image-updated", { detail: settingsProfileImage || "" }));
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Account details updated successfully!" }
            }));
        } catch (err) {
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "error", message: err.response?.data?.message || "Failed to update settings" }
            }));
        } finally {
            setSavingSettings(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "error", message: "Please fill in all password fields." }
            }));
            return;
        }
        if (newPassword !== confirmPassword) {
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "error", message: "New passwords do not match." }
            }));
            return;
        }
        setSavingSettings(true);
        try {
            await authService.updateSettings({
                currentPassword,
                newPassword
            });
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Password updated successfully!" }
            }));
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "error", message: err.response?.data?.message || "Failed to change password." }
            }));
        } finally {
            setSavingSettings(false);
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
            // Handled globally
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

    // Calculate placement readiness values for Recharts
    const totalJobsCount = jobs.length;
    const eligibleJobsCount = jobs.filter(j => profile ? profile.gpa >= j.minGpa : false).length;
    
    const readinessData = [
        { name: "Total Placements", count: totalJobsCount },
        { name: "Compatible (CGPA)", count: eligibleJobsCount }
    ];

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <Spinner label="Loading your candidate profile..." />
            </div>
        );
    }

    return (
        <div className="pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "settings" ? (
                    <div className="max-w-4xl mx-auto">
                        <PageHeader 
                            title="Account & Security Settings" 
                            subtitle="Manage your personal details and change your password." 
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            <div className="md:col-span-1">
                                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                                    <div className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-3 px-2">Settings Menu</div>
                                    <button className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold bg-accent-light text-primary transition-all">
                                        Account & Security
                                    </button>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-8">
                                {/* Account Profile Details */}
                                <Card className="border border-slate-100 shadow-sm">
                                    <div className="mb-5 pb-4 border-b border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Personal Details</h3>
                                    </div>
                                    <form onSubmit={handleSaveSettings} className="space-y-4">
                                        {/* Profile Photo Upload */}
                                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                            <img
                                                src={settingsProfileImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"}
                                                alt="Profile Preview"
                                                className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm"
                                            />
                                            <div className="flex flex-col gap-1.5 items-center sm:items-start">
                                                <label className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg px-4 py-2 border border-slate-200 transition-all cursor-pointer inline-block">
                                                    Upload Profile Photo
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setSettingsProfileImage(reader.result);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                {settingsProfileImage && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSettingsProfileImage("")}
                                                        className="text-[10px] text-rose-500 font-bold uppercase tracking-wider hover:underline cursor-pointer"
                                                    >
                                                        Remove Photo
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                                                <input
                                                    required
                                                    value={settingsName}
                                                    onChange={(e) => setSettingsName(e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={settingsEmail}
                                                    onChange={(e) => setSettingsEmail(e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={savingSettings}
                                                className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-6 py-2 transition-all disabled:opacity-60 cursor-pointer"
                                            >
                                                {savingSettings ? "Saving..." : "Save Account Info"}
                                            </button>
                                        </div>
                                    </form>
                                </Card>

                                {/* Security Change Password */}
                                <Card className="border border-slate-100 shadow-sm">
                                    <div className="mb-5 pb-4 border-b border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Change Password</h3>
                                    </div>
                                    <form onSubmit={handleChangePassword} className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={savingSettings}
                                                className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-6 py-2 transition-all disabled:opacity-60 cursor-pointer"
                                            >
                                                {savingSettings ? "Changing..." : "Change Password"}
                                            </button>
                                        </div>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <PageHeader 
                            title="Student Dashboard" 
                            subtitle="Manage your academic profile, view active recruiting applications, and explore open placements." 
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Left Column: Profile Card & Placement Readiness Chart */}
                            <div className="lg:col-span-1 space-y-8" ref={profileRef}>
                                <Card className="border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-accent" />
                                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Academic Profile</h2>
                                        </div>
                                        {profile && !isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors cursor-pointer"
                                            >
                                                Edit profile
                                            </button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleSaveProfile} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                    Branch / Major
                                                </label>
                                                <input
                                                    required
                                                    value={branch}
                                                    onChange={(e) => setBranch(e.target.value)}
                                                    placeholder="Computer Science"
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                    GPA (out of 10.0)
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
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                    Graduation Year
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    value={gradYear}
                                                    onChange={(e) => setGradYear(e.target.value)}
                                                    placeholder="2026"
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                    Resume URL
                                                </label>
                                                <input
                                                    required
                                                    type="url"
                                                    value={resumeUrl}
                                                    onChange={(e) => setResumeUrl(e.target.value)}
                                                    placeholder="https://drive.google.com/..."
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                                                />
                                            </div>

                                            <div className="flex gap-2.5 pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="flex-1 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg py-2 transition-all disabled:opacity-60 cursor-pointer"
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
                                                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg py-2 border border-slate-200/60 transition-all cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4 pt-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-accent flex items-center justify-center">
                                                    <GraduationCap className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Branch</p>
                                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{profile.branch}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-accent flex items-center justify-center">
                                                    <Award className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academic GPA</p>
                                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{profile.gpa.toFixed(2)} / 10.00</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-accent flex items-center justify-center">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Graduation Year</p>
                                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{profile.gradYear}</p>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100 flex justify-center">
                                                <a
                                                    href={profile.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                                                >
                                                    View Uploaded Resume
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </Card>

                                {/* Placement Readiness Chart */}
                                <Card className="border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                                        <BarChart2 className="w-4 h-4 text-accent" />
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Placement Readiness</h3>
                                    </div>
                                    <div className="w-full h-36">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={readinessData} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                                                <XAxis type="number" stroke="#94a3b8" fontSize={9} />
                                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={90} />
                                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                                                <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={10} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Columns: Open Postings and Applications */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* My Applications Section */}
                                <div ref={applicationsRef}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="w-4.5 h-4.5 text-slate-700" />
                                        <h2 className="text-base font-bold text-slate-900">My Placements Application History</h2>
                                    </div>
                                    {applications.length === 0 ? (
                                        <EmptyState 
                                            title="No active applications" 
                                            description="Explore the open placements below to submit your profile." 
                                        />
                                    ) : (
                                        <div className="space-y-3">
                                            {applications.map((app, index) => (
                                                <motion.div
                                                    key={app.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border border-slate-100 shadow-sm">
                                                        <div>
                                                            <h3 className="text-xs font-bold text-slate-800">{app.postingTitle}</h3>
                                                            <p className="text-[11px] text-slate-500 mt-0.5">{app.companyName}</p>
                                                            <p className="text-[10px] text-slate-400 mt-2">
                                                                Submitted: {new Date(app.appliedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <StatusBadge status={app.status} />
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Open Jobs Section */}
                                <div ref={jobsRef}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Briefcase className="w-4.5 h-4.5 text-slate-700" />
                                        <h2 className="text-base font-bold text-slate-900">Open Recruiting Openings</h2>
                                    </div>
                                    {jobs.length === 0 ? (
                                        <EmptyState 
                                            title="No listings available" 
                                            description="Check back later for approved opportunities from placement partners." 
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {jobs.map((job, index) => {
                                                const applied = hasApplied(job.id);
                                                const status = getApplicationStatus(job.id);
                                                const isGpaEligible = profile ? profile.gpa >= job.minGpa : false;
                                                
                                                return (
                                                    <motion.div
                                                        key={job.id}
                                                        initial={{ opacity: 0, y: 12 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: index * 0.06 }}
                                                    >
                                                        <Card className="relative hover:border-slate-200 transition-all border border-slate-100 shadow-sm">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                                                                    <p className="text-xs text-slate-500">{job.companyName}</p>
                                                                </div>
                                                                {applied && <StatusBadge status={status} />}
                                                            </div>

                                                            <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed whitespace-pre-wrap">
                                                                {job.description}
                                                            </p>

                                                            {job.eligibility && (
                                                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 text-xs">
                                                                    <span className="font-semibold text-slate-700">Eligibility:</span>{" "}
                                                                    <span className="text-slate-600">{job.eligibility}</span>
                                                                </div>
                                                            )}

                                                            <div className="flex flex-wrap items-center justify-between gap-4 pt-3.5 border-t border-slate-100">
                                                                <div className="flex gap-4">
                                                                    <div className="text-[10px] font-medium">
                                                                        <span className="text-slate-400">MIN GPA:</span>{" "}
                                                                        <span className={`font-bold ${isGpaEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                            {job.minGpa.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-[10px] font-medium">
                                                                        <span className="text-slate-400">DEADLINE:</span>{" "}
                                                                        <span className="font-bold text-slate-600">
                                                                            {new Date(job.deadline).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {!profile ? (
                                                                    <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider">
                                                                        Fill profile to apply
                                                                    </span>
                                                                ) : applied ? (
                                                                    <button
                                                                        disabled
                                                                        className="bg-slate-50 text-slate-400 text-xs font-semibold rounded-lg px-4 py-2 border border-slate-200/60 cursor-not-allowed"
                                                                    >
                                                                        Applied
                                                                    </button>
                                                                ) : !isGpaEligible ? (
                                                                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                                                                        GPA requires {job.minGpa.toFixed(2)}
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleApply(job.id)}
                                                                        disabled={actionLoading === job.id}
                                                                        className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-4 py-2 transition-all shadow-sm cursor-pointer"
                                                                    >
                                                                        {actionLoading === job.id ? "Applying..." : "Apply Now"}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </Card>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}