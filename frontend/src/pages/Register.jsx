import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ROLES = ["STUDENT", "COMPANY", "ADMIN"];

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
            setError(
                err.response?.data?.message || "Registration failed. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-semibold text-surface mb-1">
                    Create account
                </h1>
                <p className="text-sm text-slate-500 mb-6">
                    Campus Recruiting Portal
                </p>

                {error && (
                    <div className="mb-4 text-sm text-status-rejected bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 text-sm text-status-approved bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                        Account created. Redirecting to sign in...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Full name
                        </label>
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            I am a
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                        >
                            {ROLES.map((r) => (
                                <option key={r} value={r}>
                                    {r.charAt(0) + r.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md py-2 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="text-sm text-slate-500 mt-5 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-accent font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}