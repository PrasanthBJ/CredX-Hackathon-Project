import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ROLE_LABELS = {
    COMPANY: "Company",
    STUDENT: "Student",
    ADMIN: "Placement Admin",
};

export default function Navbar() {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-surface px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center font-mono text-white text-xs font-semibold">
                    CX
                </div>
                <span className="text-white font-semibold text-sm tracking-tight">
          CredX Recruiting
        </span>
            </div>

            <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">
          {ROLE_LABELS[role] || role}
        </span>
                <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 rounded-md px-3 py-1.5 transition-colors"
                >
                    Log out
                </button>
            </div>
        </nav>
    );
}