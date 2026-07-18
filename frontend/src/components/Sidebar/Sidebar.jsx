import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    User,
    Building2,
    Settings,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    ClipboardList,
    Users,
    Activity
} from "lucide-react";
import FlyoutMenu from "./FlyoutMenu";
import "./Sidebar.css";

function Sidebar({ isCollapsed, toggleSidebar, mobileOpen, setMobileOpen }) {
    const { role } = useAuth();
    const location = useLocation();
    
    // Hover & Flyout states
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [flyoutPosition, setFlyoutPosition] = useState(null);
    const leaveTimeoutRef = useRef(null);

    // Responsive states
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleParentMouseEnter = (item, e) => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }

        if (item.submenu) {
            setHoveredMenu(item);
            const liElement = e.currentTarget;
            const sidebarElement = liElement.closest('.sidebar');
            if (sidebarElement) {
                const sidebarRect = sidebarElement.getBoundingClientRect();
                const itemRect = liElement.getBoundingClientRect();
                const relativeTop = itemRect.top - sidebarRect.top;
                
                let estimatedHeight = 50; 
                item.submenu.forEach(() => {
                    estimatedHeight += 34;
                });
                
                const top = Math.max(16, Math.min(relativeTop, sidebarRect.height - estimatedHeight - 16));
                setFlyoutPosition({ top, isBottom: false });
            }
        } else {
            setHoveredMenu(null);
        }
    };

    const handleParentMouseLeave = () => {
        leaveTimeoutRef.current = setTimeout(() => {
            setHoveredMenu(null);
        }, 180);
    };

    const handleFlyoutMouseEnter = () => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
    };

    const handleFlyoutMouseLeave = () => {
        setHoveredMenu(null);
    };

    // Get sidebar items dynamically by role
    const getSidebarItems = () => {
        if (role === "STUDENT") {
            return [
                {
                    id: "student-dashboard",
                    label: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/student"
                },
                {
                    id: "student-placements",
                    label: "Placements & Jobs",
                    icon: Briefcase,
                    submenu: [
                        { label: "Explore Placements", path: "/student?tab=jobs" },
                        { label: "My Applications", path: "/student?tab=applications" }
                    ]
                },
                {
                    id: "student-profile",
                    label: "Academic Profile",
                    icon: User,
                    path: "/student?tab=profile"
                }
            ];
        } else if (role === "COMPANY") {
            return [
                {
                    id: "company-dashboard",
                    label: "Overview",
                    icon: LayoutDashboard,
                    path: "/company"
                },
                {
                    id: "company-jobs",
                    label: "Job Management",
                    icon: Briefcase,
                    submenu: [
                        { label: "Active Listings", path: "/company?tab=jobs" },
                        { label: "Post a New Job", path: "/company?tab=new-job" }
                    ]
                },
                {
                    id: "company-students",
                    label: "Student Directory",
                    icon: Users,
                    path: "/company?tab=students"
                },
                {
                    id: "company-profile",
                    label: "Recruiter Profile",
                    icon: Building2,
                    path: "/company?tab=profile"
                }
            ];
        } else if (role === "ADMIN") {
            return [
                {
                    id: "admin-dashboard",
                    label: "Analytics Hub",
                    icon: LayoutDashboard,
                    path: "/admin"
                },
                {
                    id: "admin-approvals",
                    label: "Job Management",
                    icon: ClipboardList,
                    submenu: [
                        { label: "Pending Approvals", path: "/admin?tab=pending" },
                        { label: "All Placements", path: "/admin?tab=all-jobs" }
                    ]
                },
                {
                    id: "admin-students",
                    label: "Student Directory",
                    icon: Users,
                    path: "/admin?tab=students"
                }
            ];
        }
        return [];
    };

    const sidebarItems = getSidebarItems();
    const bottomItems = [
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: role === "STUDENT" ? "/student?tab=settings" : role === "COMPANY" ? "/company?tab=settings" : "/admin?tab=settings"
        }
    ];

    const isLinkActive = (item) => {
        if (item.path) {
            const currentPath = location.pathname + location.search;
            return currentPath === item.path || (location.pathname === item.path.split('?')[0] && !location.search && !item.path.includes('?'));
        }
        if (item.submenu) {
            return item.submenu.some(sub => location.pathname + location.search === sub.path);
        }
        return false;
    };

    const renderMenuItem = (item) => {
        const Icon = item.icon;
        const isActive = isLinkActive(item);

        const content = (
            <>
                <Icon size={18} className="nav-icon" />
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
                {!isCollapsed && item.submenu && (
                    <ChevronRight size={14} className="submenu-indicator-arrow" />
                )}
            </>
        );

        return (
            <li 
                key={item.id}
                className={`sidebar-item-container sidebar-item-${item.id}`}
                onMouseEnter={!isMobile ? (e) => handleParentMouseEnter(item, e) : undefined}
                onMouseLeave={!isMobile ? handleParentMouseLeave : undefined}
            >
                {item.path ? (
                    <Link to={item.path} className={`nav-link ${isActive ? "active" : ""}`}>
                        {content}
                    </Link>
                ) : (
                    <div className={`nav-link clickable-parent ${isActive ? "active-parent" : ""}`}>
                        {content}
                    </div>
                )}
            </li>
        );
    };

    return (
        <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
            <div className={`sidebar-brand-container ${isCollapsed ? "collapsed-brand" : ""}`}>
                <div className="sidebar-brand">
                    {!isCollapsed ? (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white text-[13px] border border-white/15">
                                    CX
                                </div>
                                <span className="logo-text-main">CredX</span>
                            </div>
                            <button className="sidebar-header-toggle" onClick={toggleSidebar} title="Collapse Sidebar">
                                <PanelLeftClose size={18} />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 w-full">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white text-[13px] border border-white/15 mx-auto">
                                CX
                            </div>
                            <button className="sidebar-header-toggle" onClick={toggleSidebar} title="Expand Sidebar">
                                <PanelLeftOpen size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {sidebarItems.map(renderMenuItem)}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <ul className="nav-list">
                    {bottomItems.map(renderMenuItem)}
                </ul>
            </div>

            {!isMobile && hoveredMenu && (
                <FlyoutMenu 
                    menu={hoveredMenu}
                    position={flyoutPosition}
                    onMouseEnter={handleFlyoutMouseEnter}
                    onMouseLeave={handleFlyoutMouseLeave}
                />
            )}
        </aside>
    );
}

export default Sidebar;
