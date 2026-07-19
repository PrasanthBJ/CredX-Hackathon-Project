import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  Building2,
  Settings,
  Search,
  ClipboardCheck,
  Users,
  BarChart3,
  FileBarChart,
  PlusCircle,
  HelpCircle,
  MessageSquare,
  Bell,
  FileEdit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STUDENT_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/student" },
  { id: "browse-jobs", label: "Browse Jobs", icon: Search, path: "/student/jobs" },
  { id: "applications", label: "My Applications", icon: FileText, path: "/student/applications" },
  { id: "profile", label: "Profile", icon: User, path: "/student/profile" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/student/notifications" },
];

const COMPANY_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/company" },
  { id: "post-job", label: "Post Job", icon: PlusCircle, path: "/company/post-job" },
  { id: "my-jobs", label: "Manage Jobs", icon: Briefcase, path: "/company/jobs" },
  { id: "applicants", label: "Applicants", icon: Users, path: "/company/applicants" },
  { id: "company-profile", label: "Company Profile", icon: Building2, path: "/company/profile" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/company/analytics" },
];

const ADMIN_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { id: "approvals", label: "Pending Approvals", icon: ClipboardCheck, path: "/admin/pending" },
  { id: "students", label: "Students", icon: Users, path: "/admin/students" },
  { id: "companies", label: "Companies", icon: Building2, path: "/admin/companies" },
  { id: "jobs", label: "Jobs", icon: Briefcase, path: "/admin/jobs" },
  { id: "reports", label: "Reports", icon: FileBarChart, path: "/admin/reports" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
];

function Sidebar({ isCollapsed, toggleSidebar, mobileOpen, setMobileOpen }) {
  const { role } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getItems = () => {
    if (role === "STUDENT") return STUDENT_ITEMS;
    if (role === "COMPANY") return COMPANY_ITEMS;
    if (role === "ADMIN") return ADMIN_ITEMS;
    return [];
  };

  const items = getItems();
  const settingsPath = role === "STUDENT" ? "/student/settings" : role === "COMPANY" ? "/company/settings" : "/admin/settings";

  const isActive = (item) => {
    return location.pathname === item.path;
  };

  const sidebarWidth = isCollapsed ? "w-[72px]" : "w-[240px]";

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[98]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-[#E2E8F0] z-[100]
          flex flex-col transition-all duration-300 ease-in-out
          ${isMobile ? (mobileOpen ? "translate-x-0 w-[240px]" : "-translate-x-full w-[240px]") : sidebarWidth}
        `}
      >
        {/* Logo Section */}
        <div className={`flex items-center h-16 border-b border-[#E2E8F0] px-4 shrink-0 ${isCollapsed && !isMobile ? "justify-center" : "gap-3"}`}>
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm">
            CX
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="text-[#0F172A] font-bold text-lg tracking-tight">
              CredX
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => isMobile && setMobileOpen(false)}
                    title={isCollapsed ? item.label : undefined}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                      transition-all duration-150 group relative
                      ${active
                        ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                      }
                      ${isCollapsed && !isMobile ? "justify-center px-0" : ""}
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#2563EB] rounded-r-full" />
                    )}
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[#2563EB]" : "text-[#94A3B8] group-hover:text-[#64748B]"}`} />
                    {(!isCollapsed || isMobile) && (
                      <span>{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-[#E2E8F0] px-3 py-3 space-y-1 shrink-0">
          {/* Settings */}
          <Link
            to={settingsPath}
            onClick={() => isMobile && setMobileOpen(false)}
            title={isCollapsed ? "Settings" : undefined}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
              transition-all duration-150
              ${location.pathname === settingsPath
                ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }
              ${isCollapsed && !isMobile ? "justify-center px-0" : ""}
            `}
          >
            <Settings className="w-[18px] h-[18px] shrink-0" />
            {(!isCollapsed || isMobile) && <span>Settings</span>}
          </Link>

          {/* Support Section */}
          {(!isCollapsed || isMobile) && (
            <div className="mt-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="w-4 h-4 text-[#64748B]" />
                <span className="text-xs font-semibold text-[#0F172A]">Support</span>
              </div>
              <p className="text-[11px] text-[#64748B] mb-2">Need assistance?</p>
              <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" />
                Contact Team
              </button>
            </div>
          )}
        </div>

        {/* Collapse Toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:shadow-sm transition-all cursor-pointer z-10"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
