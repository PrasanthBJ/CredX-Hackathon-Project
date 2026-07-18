import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export default function Toast() {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        let timer;
        const handleToast = (e) => {
            const { type, message } = e.detail;
            setToast({ type, message });

            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                setToast(null);
            }, 4000);
        };

        window.addEventListener("api-toast-message", handleToast);
        return () => {
            window.removeEventListener("api-toast-message", handleToast);
            if (timer) clearTimeout(timer);
        };
    }, []);

    if (!toast) return null;

    const isError = toast.type === "error";

    return (
        <div
            className={`fixed bottom-5 right-5 z-50 w-80 rounded-xl border p-4 shadow-xl ${
                isError
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
            style={{ animation: "toastSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
            <div className="flex items-start gap-3">
                {isError ? (
                    <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                ) : (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                )}
                <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>
                <button
                    onClick={() => setToast(null)}
                    className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
            <style>{`
                @keyframes toastSlide {
                    from { transform: translateY(16px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
            `}</style>
        </div>
    );
}
