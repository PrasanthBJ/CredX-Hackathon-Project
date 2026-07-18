import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Check, Mail, Lock, User, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const ROLES = [
    { value: "STUDENT", label: "Student Candidate" },
    { value: "COMPANY", label: "Company Recruiter" },
    { value: "ADMIN", label: "Placement cell" },
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
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white overflow-hidden">
            {/* Left Column (Animated Brand & Features) */}
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
                
                <div className="relative flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white text-sm shadow-sm">
                        CX
                    </div>
                    <span className="text-white font-bold tracking-tight text-base">CredX</span>
                </div>

                <div className="relative space-y-8 my-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                            Create your account.
                        </h2>
                        <p className="text-sm text-blue-100 mt-2">
                            Select your profile type to register and verify your credentials.
                        </p>
                    </motion.div>

                    <div className="space-y-4 pt-4">
                        {[
                            { title: "Quick Registration", desc: "Sign up instantly and verify your account in one step." },
                            { title: "Role-Specific Dashboards", desc: "Personalized controls tailored for students, companies, and cell officers." }
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
                                    <p className="text-[11px] text-blue-100">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative text-blue-200 text-[11px] font-medium">
                    &copy; 2026 CredX Campus Portal &bull; Enterprise recruiting system.
                </div>
            </motion.div>

            {/* Right Column (Register Form) */}
            <div className="lg:col-span-7 flex items-center justify-center px-6 py-12 bg-white">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-sm"
                >
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Get started with CredX</h1>
                        <p className="text-xs text-slate-500 mt-1.5">
                            Create an account to gain access to the campus recruiting cell.
                        </p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mb-5 text-xs text-rose-600 bg-rose-50/60 border border-rose-100 rounded-lg px-3.5 py-2.5"
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mb-5 text-xs text-emerald-600 bg-emerald-50/60 border border-emerald-100 rounded-lg px-3.5 py-2.5"
                        >
                            Account created successfully! Check your email for verification.
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Dinesh"
                                    className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-150"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
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
                                    className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-150"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
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
                                    className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-xs bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-150"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Account Type
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-150 appearance-none cursor-pointer"
                                >
                                    {ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg py-2.5 transition-all duration-150 disabled:opacity-60 shadow-sm cursor-pointer mt-2"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </motion.button>
                    </form>

                    <p className="text-xs text-slate-500 mt-6 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-accent font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}