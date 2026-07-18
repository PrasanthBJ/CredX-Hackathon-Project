import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import adminService from "../services/adminService";
import dashboardService from "../services/dashboardService";
import authService from "../services/authService";
import studentService from "../services/studentService";
import { GraduationCap, Building2, FileText, TrendingUp, CheckSquare, ListFilter, ClipboardList, Check, X, Users, UserCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

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
    const location = useLocation();
    const pendingRef = useRef(null);
    const allJobsRef = useRef(null);

    const [activeTab, setActiveTab] = useState("dashboard");
    const [settingsName, setSettingsName] = useState("");
    const [settingsEmail, setSettingsEmail] = useState("");
    const [settingsProfileImage, setSettingsProfileImage] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingSettings, setSavingSettings] = useState(false);

    // Student directory states
    const [studentList, setStudentList] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isEditingStudentModalOpen, setIsEditingStudentModalOpen] = useState(false);
    const [editBranch, setEditBranch] = useState("");
    const [editGpa, setEditGpa] = useState("");
    const [editGradYear, setEditGradYear] = useState("");
    const [editResumeUrl, setEditResumeUrl] = useState("");
    const [updatingStudent, setUpdatingStudent] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        if (tab === "pending") {
            setActiveTab("dashboard");
            setTimeout(() => {
                pendingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else if (tab === "all-jobs") {
            setActiveTab("dashboard");
            setTimeout(() => {
                allJobsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else if (tab === "settings") {
            setActiveTab("settings");
        } else if (tab === "students") {
            setActiveTab("students");
            loadStudentList();
        } else {
            setActiveTab("dashboard");
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

    const loadStudentList = async () => {
        setLoadingStudents(true);
        try {
            const list = await studentService.getAllProfiles();
            setStudentList(list);
        } catch (err) {
            // Handled
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        setUpdatingStudent(true);
        try {
            await studentService.updateProfileByOther(selectedStudent.userId, {
                branch: editBranch,
                gpa: parseFloat(editGpa),
                gradYear: parseInt(editGradYear),
                resumeUrl: editResumeUrl
            });
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: "Student profile updated successfully!" }
            }));
            setIsEditingStudentModalOpen(false);
            loadStudentList();
        } catch (err) {
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "error", message: "Failed to update student profile" }
            }));
        } finally {
            setUpdatingStudent(false);
        }
    };

    const loadData = async (signal) => {
        try {
            setLoading(true);
            const data = await dashboardService.getAdminDashboardData({ signal });
            setPendingJobs(data.pendingJobs);
            setAllJobs(data.allJobs);
            setStats(data.placementRate);
            setCompanyStats(data.companyStats);
            await loadSettings();
            if (new URLSearchParams(location.search).get("tab") === "students") {
                await loadStudentList();
            }
        } catch (err) {
            // Handled globally
        } finally {
            setLoading(false);
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

    // Format company applications data for Recharts horizontal BarChart
    const companyChartData = Object.entries(companyStats || {}).map(([name, count]) => ({
        name: name.length > 10 ? `${name.substring(0, 10)}.` : name,
        count
    }));

    // Mock trend history mapping from placement rate for AreaChart
    const trendRate = stats?.placementRatePercentage || 0;
    const historicalTrendData = [
        { name: "Q1", rate: Math.max(0, trendRate - 20) },
        { name: "Q2", rate: Math.max(0, trendRate - 12) },
        { name: "Q3", rate: Math.max(0, trendRate - 5) },
        { name: "Q4", rate: trendRate }
    ];

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <Spinner label="Loading administration cell..." />
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
                                                src={settingsProfileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"}
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
                ) : activeTab === "students" ? (
                    <div className="max-w-6xl mx-auto">
                        <PageHeader 
                            title="Candidate Directory" 
                            subtitle="View academic profiles, resumes, GPA eligibility, and verify or edit candidate data."
                        />

                        {loadingStudents ? (
                            <div className="py-16">
                                <Spinner label="Loading student directory..." />
                            </div>
                        ) : studentList.length === 0 ? (
                            <div className="mt-8">
                                <EmptyState title="No student profiles registered yet" description="Candidate profiles will appear here once they complete registration." />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                {studentList.map((student) => (
                                    <motion.div
                                        key={student.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Card className="border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-slate-900">{student.studentName || "Unnamed Candidate"}</h3>
                                                        <p className="text-xs text-slate-500 font-medium">{student.studentEmail}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setEditBranch(student.branch || "");
                                                            setEditGpa(student.gpa !== undefined && student.gpa !== null ? String(student.gpa) : "");
                                                            setEditGradYear(student.gradYear !== undefined && student.gradYear !== null ? String(student.gradYear) : "");
                                                            setEditResumeUrl(student.resumeUrl || "");
                                                            setIsEditingStudentModalOpen(true);
                                                        }}
                                                        className="text-xs font-bold text-accent hover:text-accent-hover cursor-pointer border border-blue-150 hover:bg-blue-50/30 px-3 py-1.5 rounded-lg transition-all"
                                                    >
                                                        Edit Profile
                                                    </button>
                                                </div>

                                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs space-y-2 mt-2 font-medium text-slate-600">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Branch:</span>
                                                        <span className="text-slate-700 font-semibold">{student.branch || "Not Specified"}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">CGPA / GPA:</span>
                                                        <span className="text-slate-700 font-semibold">{student.gpa !== null ? student.gpa.toFixed(2) : "N/A"}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Graduation Year:</span>
                                                        <span className="text-slate-700 font-semibold">{student.gradYear || "N/A"}</span>
                                                    </div>
                                                    {student.resumeUrl && (
                                                        <div className="flex justify-between pt-1 border-t border-slate-200/50">
                                                            <span className="text-slate-400">Resume Link:</span>
                                                            <a href={student.resumeUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline font-semibold">
                                                                View Resume
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* List of Updaters */}
                                            <div className="mt-4 pt-3.5 border-t border-slate-100">
                                                {student.updatedByList ? (
                                                    <div className="text-[10px] text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                                                        <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Updates History:</span>
                                                        <span className="text-slate-655">{student.updatedByList}</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] text-slate-400 italic">No updates by admins or recruiters yet</div>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Edit Student Modal */}
                        {isEditingStudentModalOpen && (
                            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100"
                                >
                                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                                            Edit {selectedStudent?.studentName}'s Profile
                                        </h3>
                                        <button
                                            onClick={() => setIsEditingStudentModalOpen(false)}
                                            className="text-slate-400 hover:text-slate-650 text-base font-bold cursor-pointer"
                                        >
                                            &times;
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Branch</label>
                                            <input
                                                required
                                                value={editBranch}
                                                onChange={(e) => setEditBranch(e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">GPA / CGPA</label>
                                                <input
                                                    required
                                                    type="number"
                                                    step="0.01"
                                                    value={editGpa}
                                                    onChange={(e) => setEditGpa(e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Graduation Year</label>
                                                <input
                                                    required
                                                    type="number"
                                                    value={editGradYear}
                                                    onChange={(e) => setEditGradYear(e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Resume Link (URL)</label>
                                            <input
                                                value={editResumeUrl}
                                                onChange={(e) => setEditResumeUrl(e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingStudentModalOpen(false)}
                                                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-655 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={updatingStudent}
                                                className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-5 py-2 transition-all cursor-pointer disabled:opacity-60"
                                            >
                                                {updatingStudent ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <PageHeader 
                            title="Placement Cell Administration" 
                            subtitle="Monitor campus placement analytics, partner recruiters, and review pending postings."
                        />

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                            {[
                                { label: "Total Candidates", value: stats?.totalStudents ?? 0, icon: <GraduationCap className="w-5 h-5" /> },
                                { label: "Recruiters", value: stats?.totalCompanies ?? 0, icon: <Building2 className="w-5 h-5" /> },
                                { label: "Applications", value: stats?.totalApplications ?? 0, icon: <FileText className="w-5 h-5" /> }
                            ].map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                >
                                    <Card className="flex items-center gap-4 py-5 border border-slate-100 shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-accent flex items-center justify-center shrink-0">
                                            {m.icon}
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{m.label}</span>
                                            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">{m.value}</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.15 }}
                            >
                                <Card className="flex items-center gap-4 py-5 bg-blue-50/20 border border-accent/15 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-accent flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">Placement Rate</span>
                                        <span className="text-2xl font-bold text-accent mt-0.5 block">
                                            {(stats?.placementRatePercentage ?? 0.0).toFixed(1)}%
                                        </span>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Left 2 Columns: Pending Approvals & All Listings */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Pending Approvals */}
                                <div ref={pendingRef}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckSquare className="w-4.5 h-4.5 text-slate-700" />
                                        <h2 className="text-base font-bold text-slate-900">Pending Approvals ({pendingJobs.length})</h2>
                                    </div>
                                    {pendingJobs.length === 0 ? (
                                        <EmptyState 
                                            title="All caught up" 
                                            description="Recruiters have no postings currently awaiting approval." 
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {pendingJobs.map((job, index) => (
                                                <motion.div
                                                    key={job.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <Card className="border border-slate-100 shadow-sm">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                                                                <p className="text-xs text-slate-500">{job.companyName}</p>
                                                            </div>
                                                            <StatusBadge status={job.status} />
                                                        </div>

                                                        <p className="text-xs text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap">{job.description}</p>
                                                        
                                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-4 text-xs space-y-1.5 font-medium text-slate-600">
                                                            <div>
                                                                <span className="text-slate-400">Min GPA Required:</span>{" "}
                                                                <span className="text-slate-700 font-semibold">{job.minGpa.toFixed(2)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-400">Eligibility:</span>{" "}
                                                                <span className="text-slate-700 font-semibold">{job.eligibility}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-400">Deadline:</span>{" "}
                                                                <span className="text-slate-700 font-semibold">
                                                                    {new Date(job.deadline).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end gap-2.5 pt-3.5 border-t border-slate-100">
                                                            <button
                                                                onClick={() => handleReject(job.id)}
                                                                disabled={actionLoading !== null}
                                                                className="inline-flex items-center gap-1 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 text-slate-600 text-xs font-semibold rounded-lg px-4 py-2 border border-slate-200 transition-all cursor-pointer disabled:opacity-60"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                                {actionLoading?.id === job.id && actionLoading?.type === "reject" ? "Rejecting..." : "Reject"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleApprove(job.id)}
                                                                disabled={actionLoading !== null}
                                                                className="inline-flex items-center gap-1 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-4 py-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                                {actionLoading?.id === job.id && actionLoading?.type === "approve" ? "Approving..." : "Approve"}
                                                            </button>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Placement Trends Chart */}
                                <Card className="border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                                        <TrendingUp className="w-4 h-4 text-accent" />
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Historical Placement rates</h3>
                                    </div>
                                    <div className="w-full h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={historicalTrendData} margin={{ left: -25, right: 10, top: 10, bottom: 5 }}>
                                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                                                <YAxis stroke="#94a3b8" fontSize={9} domain={[0, 100]} />
                                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                                                <Area type="monotone" dataKey="rate" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column: All Opportunities & recruiter distributions */}
                            <div className="lg:col-span-1 space-y-8">
                                {/* All Opportunities list */}
                                <div ref={allJobsRef}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <ClipboardList className="w-4.5 h-4.5 text-slate-700" />
                                        <h2 className="text-base font-bold text-slate-900">All Job Listings ({allJobs.length})</h2>
                                    </div>

                                    {allJobs.length === 0 ? (
                                        <EmptyState title="No job listings found" />
                                    ) : (
                                        <div className="space-y-4">
                                            {allJobs.map((job) => (
                                                <motion.div key={job.id} layout>
                                                    <Card className="border border-slate-100 shadow-sm">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="text-xs font-bold text-slate-850">{job.title}</h3>
                                                                <p className="text-[11px] text-slate-500">{job.companyName}</p>
                                                            </div>
                                                            <StatusBadge status={job.status} />
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3.5 border-t border-slate-100 text-[10px] font-medium">
                                                            <div>
                                                                <span className="text-slate-400">MIN GPA:</span>{" "}
                                                                <span className="font-bold text-slate-700">{job.minGpa.toFixed(2)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-400">ELIGIBILITY:</span>{" "}
                                                                <span className="font-bold text-slate-700">{job.eligibility}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-400">DEADLINE:</span>{" "}
                                                                <span className="font-bold text-slate-700">
                                                                    {new Date(job.deadline).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            {job.reviewedByName && (
                                                                <div className="ml-auto inline-flex items-center gap-1 text-[9px] text-slate-400 uppercase tracking-wide">
                                                                    <UserCheck className="w-3 h-3" />
                                                                    Reviewed by: {job.reviewedByName}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Active Recruiters Card */}
                                <Card className="sticky top-20 border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                                        <ListFilter className="w-4.5 h-4.5 text-slate-700" />
                                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Applications/Company</h2>
                                    </div>

                                    {Object.keys(companyStats || {}).length === 0 ? (
                                        <p className="text-xs text-slate-500 text-center py-6">No recruiters active yet</p>
                                    ) : (
                                        <div className="space-y-3.5">
                                            {Object.entries(companyStats || {}).map(([name, count]) => (
                                                <div key={name} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                                    <span className="font-semibold text-slate-700">{name}</span>
                                                    <span className="font-mono bg-blue-50 text-accent rounded-lg px-2.5 py-0.5 font-bold text-[10px] block border border-blue-100/50">
                                                        {count} {count === 1 ? 'applicant' : 'applicants'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}