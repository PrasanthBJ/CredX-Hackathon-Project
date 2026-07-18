import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LogOut } from "lucide-react";

const ROLE_LABELS = {
    COMPANY: "Company Recruiter",
    STUDENT: "Student Candidate",
    ADMIN: "Placement cell",
};

const ROLE_BADGE = {
    COMPANY: "bg-blue-50 text-blue-700 border-blue-200",
    STUDENT: "bg-violet-50 text-violet-700 border-violet-200",
    ADMIN: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function Navbar() {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const badgeStyle = ROLE_BADGE[role] || "bg-slate-100 text-slate-600 border-slate-200";

    return (
        <nav
            className="sticky top-0 z-50 border-b border-slate-200/70 px-6 py-3.5 flex items-center justify-between"
            style={{
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
        >
            {/* Brand */}
            <div className="flex items-center gap-2.5">
                <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-[11px] shadow-sm"
                    style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}
                >
                    CX
                </div>
                <span className="text-slate-900 font-bold text-sm tracking-tight select-none">
                    CredX
                </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                <span
                    className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${badgeStyle}`}
                >
                    {ROLE_LABELS[role] || role}
                </span>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all duration-200 cursor-pointer"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Log out
                </button>
            </div>
        </nav>
    );
}