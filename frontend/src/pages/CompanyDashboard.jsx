import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import companyService from "../services/companyService";
import dashboardService from "../services/dashboardService";
import authService from "../services/authService";
import studentService from "../services/studentService";
import { Users } from "lucide-react";
import { Briefcase, Plus, Globe, Building, Calendar, UserCheck, BarChart2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";

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
    const location = useLocation();
    const profileRef = useRef(null);
    const jobsRef = useRef(null);
    const newJobRef = useRef(null);

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
        if (tab === "profile") {
            setIsEditingProfile(true);
            setIsPostingJob(false);
            setActiveTab("dashboard");
            setTimeout(() => {
                profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else if (tab === "new-job") {
            setIsPostingJob(true);
            setIsEditingProfile(false);
            setActiveTab("dashboard");
            setTimeout(() => {
                newJobRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else if (tab === "jobs") {
            setIsPostingJob(false);
            setIsEditingProfile(false);
            setActiveTab("dashboard");
            setTimeout(() => {
                jobsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else if (tab === "settings") {
            setActiveTab("settings");
        } else if (tab === "students") {
            setActiveTab("students");
            loadStudentList();
        } else {
            setActiveTab("dashboard");
            setIsEditingProfile(false);
            setIsPostingJob(false);
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

    // Calculate job posting pipeline metrics for Recharts
    const approvedJobsCount = jobs.filter(j => j.status === "APPROVED").length;
    const pendingJobsCount = jobs.filter(j => j.status === "PENDING").length;
    const rejectedJobsCount = jobs.filter(j => j.status === "REJECTED").length;

    const pipelineData = [
        { name: "Approved", count: approvedJobsCount, fill: "#22C55E" },
        { name: "Pending", count: pendingJobsCount, fill: "#F59E0B" },
        { name: "Rejected", count: rejectedJobsCount, fill: "#EF4444" }
    ];

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <Spinner label="Loading recruiter profile..." />
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
                                                src={settingsProfileImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"}
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
                                                        <span className="text-slate-650">{student.updatedByList}</span>
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
                                                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-650 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
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
                        {/* Company Profile Header */}
                        <div ref={profileRef} className="mb-8">
                            <PageHeader 
                                title={profile ? profile.companyName : "Recruiter Dashboard"} 
                                subtitle={profile ? profile.description : "Manage job openings, pipeline stats, and candidate portfolios."}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Left Column: Recruiter Details Card & Listing Analytics */}
                            <div className="lg:col-span-1 space-y-8">
                                <Card className="border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                                            <Building className="w-4 h-4 text-slate-700" />
                                            Corporate Information
                                        </h2>
                                        {!isEditingProfile && (
                                            <button
                                                onClick={() => setIsEditingProfile(true)}
                                                className="text-xs font-bold text-accent hover:text-accent-hover cursor-pointer"
                                            >
                                                Edit Info
                                            </button>
                                        )}
                                    </div>

                                    {isEditingProfile ? (
                                        <form onSubmit={handleSaveProfile} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                                                <input
                                                    required
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Brief Description</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Corporate Website URL</label>
                                                <input
                                                    required
                                                    type="url"
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                    placeholder="https://example.com"
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                                />
                                            </div>

                                            <div className="flex justify-end gap-2.5 pt-2">
                                                {profile && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsEditingProfile(false);
                                                            setCompanyName(profile.companyName || "");
                                                            setDescription(profile.description || "");
                                                            setWebsite(profile.website || "");
                                                        }}
                                                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-650 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={submittingProfile}
                                                    className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-5 py-2 transition-all cursor-pointer disabled:opacity-60"
                                                >
                                                    {submittingProfile ? "Saving..." : "Save Corporate Info"}
                                                </button>
                                            </div>
                                        </form>
                                    ) : !profile ? (
                                        <div className="py-6 text-center">
                                            <p className="text-xs text-slate-500 mb-4">Complete your Recruiter profile to begin posting jobs.</p>
                                            <button
                                                onClick={() => setIsEditingProfile(true)}
                                                className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-5 py-2 transition-all cursor-pointer"
                                            >
                                                Build Recruiter Profile
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{profile.description}</p>
                                            </div>
                                            <div className="pt-4 border-t border-slate-100 flex justify-center">
                                                <a
                                                    href={profile.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                                                >
                                                    Visit Website
                                                    <Globe className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </div>

                            {/* Right Columns: Job Postings Section */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Post a New Job opening Card */}
                                <div ref={newJobRef}>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4.5 h-4.5 text-slate-700" />
                                            <h2 className="text-base font-bold text-slate-900">Post new Opportunity</h2>
                                        </div>
                                        {!isPostingJob && profile && (
                                            <button
                                                onClick={() => setIsPostingJob(true)}
                                                className="inline-flex items-center gap-1 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg px-4 py-2 transition-all shadow-sm cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                New Listing
                                            </button>
                                        )}
                                    </div>

                                    {isPostingJob && (
                                        <Card className="border border-slate-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Create Recruiting Opportunity</h3>
                                                <button
                                                    onClick={() => setIsPostingJob(false)}
                                                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                                >
                                                    Close Form
                                                </button>
                                            </div>

                                            <form onSubmit={handleCreateJob} className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                            Job Title
                                                        </label>
                                                        <input
                                                            required
                                                            value={jobTitle}
                                                            onChange={(e) => setJobTitle(e.target.value)}
                                                            placeholder="Software Development Engineer - I"
                                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                            Min GPA Threshold
                                                        </label>
                                                        <input
                                                            required
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="10"
                                                            value={jobMinGpa}
                                                            onChange={(e) => setJobMinGpa(e.target.value)}
                                                            placeholder="7.50"
                                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                        Eligibility criteria
                                                    </label>
                                                    <input
                                                        required
                                                        value={jobEligibility}
                                                        onChange={(e) => setJobEligibility(e.target.value)}
                                                        placeholder="B.Tech (CS/IT/ECE) graduating in 2026 without active backlogs"
                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                            Application Deadline
                                                        </label>
                                                        <input
                                                            required
                                                            type="date"
                                                            value={jobDeadline}
                                                            onChange={(e) => setJobDeadline(e.target.value)}
                                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                        Job Description
                                                    </label>
                                                    <textarea
                                                        required
                                                        rows={4}
                                                        value={jobDesc}
                                                        onChange={(e) => setJobDesc(e.target.value)}
                                                        placeholder="Describe the responsibilities, tech stack, and compensation details..."
                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                                                    />
                                                </div>

                                                <div className="flex gap-2.5 pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={submittingJob}
                                                        className="flex-1 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg py-2.5 transition-all disabled:opacity-60 cursor-pointer shadow-sm"
                                                    >
                                                        {submittingJob ? "Submitting..." : "Submit Opportunity"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsPostingJob(false)}
                                                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg py-2.5 border border-slate-200/60 transition-all cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </Card>
                                    )}
                                </div>

                                {/* Active Job Postings List */}
                                <div ref={jobsRef}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Briefcase className="w-4.5 h-4.5 text-slate-700" />
                                        <h2 className="text-base font-bold text-slate-900">Your Recruiting Listings</h2>
                                    </div>
                                    {jobs.length === 0 ? (
                                        <EmptyState 
                                            title="No postings submitted" 
                                            description="Click the 'New Listing' button above to submit your first placement." 
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {jobs.map((job) => (
                                                <motion.div
                                                    key={job.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Card className="border border-slate-100 shadow-sm">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                                                                <p className="text-xs text-slate-500">{job.companyName}</p>
                                                            </div>
                                                            <StatusBadge status={job.status} />
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
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}