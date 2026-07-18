import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Bell, ChevronDown, LogOut, Settings, Menu, GraduationCap, Building2, Shield } from "lucide-react";
import SwitchWorkspaceModal from "./SwitchWorkspaceModal";
import "./Topbar.css";

function Topbar({ onOpenMobileSidebar }) {
    const { role, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");

    // Active Drive (workspace) details
    const [activeDrive, setActiveDrive] = useState({
        id: "drive-1",
        name: "CredX Campus Placement 2026",
        roleName: role === "STUDENT" ? "Student Candidate" : role === "COMPANY" ? "Hiring Manager" : "Placement Coordinator"
    });

    useEffect(() => {
        const handleImageUpdate = (e) => {
            setProfileImage(e.detail || "");
        };
        window.addEventListener("profile-image-updated", handleImageUpdate);

        function handleOutsideClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            window.removeEventListener("profile-image-updated", handleImageUpdate);
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleWorkspaceSelect = (driveId, roleId, driveLabel, roleLabel) => {
        setActiveDrive({
            id: driveId,
            name: driveLabel,
            roleName: roleLabel
        });
    };

    const getRoleBadgeColor = () => {
        if (role === "STUDENT") return "bg-violet-50 text-violet-700 border-violet-200";
        if (role === "COMPANY") return "bg-blue-50 text-blue-700 border-blue-200";
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    };

    const getDisplayName = () => {
        if (role === "STUDENT") return "Student Candidate";
        if (role === "COMPANY") return "Company Recruiter";
        return "Placement Cell Admin";
    };

    const getAvatar = () => {
        if (profileImage) return profileImage;
        if (role === "STUDENT") return "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"; // Student
        if (role === "COMPANY") return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"; // Company Recruiter
        return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"; // Admin
    };

    return (
        <header className="topbar">
            <div className="topbar-left-wrapper">
                <button className="topbar-hamburger-btn" onClick={onOpenMobileSidebar}>
                    <Menu size={20} />
                </button>
                <h1 className="topbar-page-title">
                    {role === "STUDENT" ? "Candidate Portal" : role === "COMPANY" ? "Recruiter Portal" : "Placement cell Panel"}
                </h1>
            </div>

            <div className="topbar-actions">
                {/* Switcher button */}
                <div className="workspace-switcher-btn" onClick={() => setIsSwitchModalOpen(true)}>
                    <div className="ws-switcher-info">
                        <span className="ws-name">{activeDrive.name}</span>
                        <span className="ws-role">{activeDrive.roleName}</span>
                    </div>
                    <ChevronDown size={14} className="ws-dropdown-icon" />
                </div>

                {/* Profile Circle */}
                <div className="topbar-profile-wrapper" ref={dropdownRef}>
                    <div className="profile-container" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <img 
                            src={getAvatar()} 
                            alt="Avatar" 
                            className="profile-avatar"
                        />
                        <span className="profile-name-simple">{getDisplayName()}</span>
                        <ChevronDown size={14} className={`profile-chevron ${isDropdownOpen ? "open" : ""}`} />
                    </div>

                    {isDropdownOpen && (
                        <div className="profile-dropdown-menu fade-in">
                            <div className="dropdown-header">
                                <p className="user-name">{getDisplayName()}</p>
                                <span className={`role-badge ${getRoleBadgeColor()}`}>{role}</span>
                            </div>
                            <div className="dropdown-divider" />
                            {role !== "ADMIN" && (
                                <button className="dropdown-item" onClick={() => {
                                    setIsDropdownOpen(false);
                                    navigate(role === "STUDENT" ? "/student?tab=profile" : "/company?tab=profile");
                                }}>
                                    {role === "STUDENT" ? <GraduationCap size={14} /> : <Building2 size={14} />}
                                    My Profile
                                </button>
                            )}
                            <button className="dropdown-item" onClick={() => {
                                setIsDropdownOpen(false);
                                navigate(role === "STUDENT" ? "/student?tab=settings" : role === "COMPANY" ? "/company?tab=settings" : "/admin?tab=settings");
                            }}>
                                <Settings size={14} />
                                Settings
                            </button>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                <LogOut size={14} />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isSwitchModalOpen && (
                <SwitchWorkspaceModal 
                    onClose={() => setIsSwitchModalOpen(false)} 
                    onSelect={handleWorkspaceSelect}
                    currentDriveId={activeDrive.id}
                    currentRoleId={role === "STUDENT" ? "student-cand" : role === "COMPANY" ? "recruiter-mgr" : "admin-lead"}
                />
            )}
        </header>
    );
}

export default Topbar;
