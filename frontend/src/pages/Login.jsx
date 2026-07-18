import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
            setError(
                err.response?.data?.message || "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-semibold text-surface mb-1">Sign in</h1>
                <p className="text-sm text-slate-500 mb-6">
                    Campus Recruiting Portal
                </p>

                {error && (
                    <div className="mb-4 text-sm text-status-rejected bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md py-2 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-sm text-slate-500 mt-5 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-accent font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}