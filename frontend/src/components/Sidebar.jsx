import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const ROLE_LABELS = {
    COMPANY: "Company",
    STUDENT: "Student",
    ADMIN: "Placement Admin",
};

export default function Sidebar({ links }) {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside
            style={{ backgroundColor: "#0f172a" }}
            className="w-64 shrink-0 min-h-screen flex flex-col"
        >
            <div className="flex items-center gap-2.5 px-6 py-6">
                <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center font-mono text-white text-sm font-semibold">
                    CX
                </div>
                <span className="text-white font-semibold text-sm tracking-tight">
          CredX Recruiting
        </span>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-accent text-white"
                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <link.icon size={17} strokeWidth={2} />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-3 pb-5 pt-3 border-t border-white/10 mx-3">
                <div className="px-3 py-2 mb-1">
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                        Signed in as
                    </p>
                    <p className="text-sm text-slate-200 font-medium">
                        {ROLE_LABELS[role] || role}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <LogOut size={17} strokeWidth={2} />
                    Log out
                </button>
            </div>
        </aside>
    );
}