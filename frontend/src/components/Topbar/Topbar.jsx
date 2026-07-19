import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Search,
  Bell,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  Menu,
  GraduationCap,
  Building2,
  User,
} from "lucide-react";

function Topbar({ onOpenMobileSidebar }) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  useEffect(() => {
    const handleImageUpdate = (e) => setProfileImage(e.detail || "");
    window.addEventListener("profile-image-updated", handleImageUpdate);

    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
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

  const getDisplayName = () => {
    if (role === "STUDENT") return "Dinesh";
    if (role === "COMPANY") return "Kumar Technologies";
    return "Placement Admin";
  };

  const getRoleLabel = () => {
    if (role === "STUDENT") return "IT · 3rd Year";
    if (role === "COMPANY") return "Recruiter";
    return "Admin";
  };

  const getAvatar = () => {
    if (profileImage) return profileImage;
    return null;
  };

  const getSearchPlaceholder = () => {
    if (role === "STUDENT") return "Search jobs, companies...";
    if (role === "COMPANY") return "Search candidates, jobs...";
    return "Search companies, students...";
  };

  const avatarSrc = getAvatar();

  return (
    <header className="sticky top-0 z-[50] bg-white border-b border-[#E2E8F0] h-16 flex items-center justify-between px-6 shrink-0">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          className="md:hidden text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          onClick={onOpenMobileSidebar}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder={getSearchPlaceholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
          />
        </div>
      </div>

      {/* Right: actions + profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all cursor-pointer">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full" />
        </button>

        {/* Theme Toggle placeholder */}
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all cursor-pointer">
          <Moon className="w-[18px] h-[18px]" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-[#E2E8F0] mx-1" />

        {/* Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 cursor-pointer hover:bg-[#F8FAFC] rounded-xl px-2 py-1.5 transition-all"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold">
                {getDisplayName().charAt(0)}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-[#0F172A] leading-tight">
                {getDisplayName()}
              </p>
              <p className="text-[11px] text-[#64748B] leading-tight">
                {getRoleLabel()}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#94A3B8] hidden md:block transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg shadow-slate-200/50 py-1.5 fade-in">
              <div className="px-4 py-3 border-b border-[#E2E8F0]">
                <p className="text-sm font-semibold text-[#0F172A]">
                  {getDisplayName()}
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                  {role}
                </span>
              </div>



              <button
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all cursor-pointer"
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate(
                    role === "STUDENT"
                      ? "/student/settings"
                      : role === "COMPANY"
                      ? "/company/settings"
                      : "/admin/settings"
                  );
                }}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <div className="border-t border-[#E2E8F0] my-1" />

              <button
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#EF4444] hover:bg-red-50 transition-all cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
