import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  Users,
  TrendingUp,
} from "lucide-react";



const STATS = [
  { value: "500+", label: "Companies", icon: Building2 },
  { value: "10K+", label: "Students", icon: Users },
  { value: "85%", label: "Placement Rate", icon: TrendingUp },
];

export default function LandingPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* ═══════════ LEFT HERO PANEL ═══════════ */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative flex flex-col justify-between lg:w-[52%] px-8 py-10 sm:px-12 sm:py-12 lg:px-16 lg:py-14 overflow-hidden"
        style={{
          background:
            "linear-gradient(155deg, #0F172A 0%, #1E3A8A 40%, #2563EB 100%)",
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center font-bold text-white text-sm border border-white/20 shadow-lg">
            CX
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">
              CredX
            </span>
            <span className="block text-blue-200/70 text-[11px] font-medium -mt-0.5">
              Campus Recruiting Portal
            </span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative my-auto py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-[1.1]">
              Get Hired.
              <br />
              Grow Your Career.
            </h1>
            <p className="text-blue-200/80 text-base sm:text-lg mt-5 max-w-md leading-relaxed font-medium">
              Connecting talented students with top companies — all in one place.
            </p>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-8 sm:gap-12 mt-12"
          >
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <Icon className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xl sm:text-2xl tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-blue-300/70 text-xs font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative text-blue-300/50 text-xs font-medium">
          © 2026 CredX Campus Portal · Built for the future of recruiting.
        </div>
      </motion.div>

      {/* ═══════════ RIGHT LOGIN PANEL ═══════════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              }}
            >
              CX
            </div>
            <span className="font-bold text-slate-900 text-base">CredX</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Sign in to your CredX account
            </p>
          </div>



          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="mb-5 flex items-center gap-2.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-[18px] h-[18px]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-[18px] h-[18px]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white text-sm font-semibold rounded-xl py-3 mt-3 transition-all duration-200 disabled:opacity-60 cursor-pointer shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="text-sm text-slate-500 mt-7 text-center">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
            >
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
