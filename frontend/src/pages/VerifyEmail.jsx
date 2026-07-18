import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import Card from "../components/Card";
import Spinner from "../components/Spinner";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("Verifying your email address...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        let active = true;
        const verify = async () => {
            try {
                const response = await authService.verifyEmail(token);
                if (active) {
                    setStatus("success");
                    setMessage(response.message || "Email verified successfully!");
                }
            } catch (err) {
                if (active) {
                    setStatus("error");
                    setMessage(err.response?.data?.message || "Verification failed. The token may be expired or invalid.");
                }
            }
        };

        verify();

        return () => {
            active = false;
        };
    }, [token]);

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center py-10 px-8 shadow-xl border border-slate-100 bg-white rounded-2xl">
                <div className="flex flex-col items-center">
                    {/* Header Icon / Branding */}
                    <div className="w-12 h-12 bg-accent/10 text-accent font-bold rounded-full flex items-center justify-center text-lg mb-6">
                        CX
                    </div>

                    <h1 className="text-xl font-bold text-slate-800 mb-2">Account Verification</h1>

                    {status === "loading" && (
                        <div className="flex flex-col items-center my-6">
                            <Spinner className="w-8 h-8 text-accent" />
                            <p className="text-xs text-slate-500 mt-4">{message}</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="w-full flex flex-col items-center my-6">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-emerald-600 mb-6">{message}</p>
                            <Link
                                to="/login"
                                className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium text-xs transition duration-200 shadow-sm"
                            >
                                Sign In to Your Account
                            </Link>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="w-full flex flex-col items-center my-6">
                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-rose-600 mb-6">{message}</p>
                            <div className="w-full space-y-3">
                                <Link
                                    to="/login"
                                    className="block w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs transition duration-200 text-center"
                                >
                                    Go to Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="block w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium text-xs transition duration-200 text-center"
                                >
                                    Create New Account
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
