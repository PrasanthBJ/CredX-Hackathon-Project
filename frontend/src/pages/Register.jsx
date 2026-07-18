import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ROLES = [
    { value: "STUDENT", label: "Student" },
    { value: "COMPANY", label: "Company" },
    { value: "ADMIN", label: "Placement Admin" },
];

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await register(name, email, password, role);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5">
            <div className="hidden lg:flex lg:col-span-2 bg-surface relative overflow-hidden flex-col justify-between p-10">
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                    }}
                />
                <div className="relative flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center font-mono text-white text-sm font-semibold">
                        CX
                    </div>
                    <span className="text-white font-semibold tracking-tight">CredX Recruiting</span>
                </div>

                <div className="relative">
                    <p className="text-slate-300 text-sm font-mono mb-2 tracking-wide">
                        01 &mdash; POST &nbsp; 02 &mdash; APPROVE &nbsp; 03 &mdash; HIRE
                    </p>
                    <h2 className="text-white text-2xl font-semibold leading-snug max-w-sm">
                        Join as a student, company, or placement admin.
                    </h2>
                </div>

                <div className="relative text-slate-400 text-xs font-mono">
                    &copy; 2026 CredX Hackathon &mdash; Campus Recruiting Portal
                </div>
            </div>

            <div className="lg:col-span-3 flex items-center justify-center bg-bg px-6 py-12">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-semibold text-surface mb-1">Create account</h1>
                    <p className="text-sm text-slate-500 mb-8">
                        Set up access to the recruiting portal.
                    </p>

                    {error && (
                        <div className="mb-5 text-sm text-status-rejected bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 text-sm text-status-approved bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                            Account created. Redirecting to sign in...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                                Full name
                            </label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jane Doe"
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                                Account type
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                            >
                                {ROLES.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60 shadow-sm"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="text-sm text-slate-500 mt-6 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-accent font-medium hover:text-accent-hover">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}