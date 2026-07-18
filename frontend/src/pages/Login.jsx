import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Check, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const role = await login(email, password);

            if (role === "COMPANY") navigate("/company");
            else if (role === "STUDENT") navigate("/student");
            else if (role === "ADMIN") navigate("/admin");
            else navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const inputCls =
        "w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150";

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white overflow-hidden">

            {/* ── Left Branding Panel ── */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: "linear-gradient(145deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)" }}
            >
                {/* Dot pattern overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />
                {/* Decorative blur orbs */}
                <div className="absolute -bottom-28 -right-20 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
                <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-indigo-300/20 blur-3xl pointer-events-none" />

                {/* Logo */}
                <div className="relative flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white text-sm shadow-sm">
                        CX
                    </div>
                    <span className="text-white font-bold tracking-tight text-base">CredX</span>
                </div>

                {/* Hero copy */}
                <div className="relative space-y-8 my-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                            Recruiting, integrated.
                        </h2>
                        <p className="text-sm text-blue-100 mt-2 leading-relaxed">
                            The campus recruiting portal built for modern companies, admins, and students.
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { title: "Unified Recruiting Platform", desc: "Post jobs, track approvals, and manage applicants in one place." },
                            { title: "Secure Email Verification", desc: "Every student and recruiter email is validated for authentication safety." },
                            { title: "Hiring Analytics & Metrics", desc: "Access statistics, placement rates, and real-time application pipelines." },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                                    <p className="text-[11px] text-blue-100 mt-0.5 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative text-blue-200 text-[11px] font-medium">
                    &copy; 2026 CredX Campus Portal &bull; Enterprise recruiting system.
                </div>
            </motion.div>

            {/* ── Right Form Panel ── */}
            <div className="lg:col-span-7 flex items-center justify-center px-6 py-12 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-sm"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-[11px]"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                        >
                            CX
                        </div>
                        <span className="font-bold text-slate-900 text-sm">CredX</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to CredX</h1>
                        <p className="text-sm text-slate-500 mt-1.5">
                            Enter your account email and password to continue.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mb-5 flex items-center gap-2.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full text-white text-sm font-semibold rounded-xl py-2.5 transition-all duration-150 disabled:opacity-60 cursor-pointer mt-2"
                            style={{
                                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                            }}
                        >
                            {loading ? "Signing in…" : "Sign in →"}
                        </motion.button>
                    </form>

                    <p className="text-sm text-slate-500 mt-6 text-center">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}