import { useEffect, useState } from "react";

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
    const bgClass = isError 
        ? "bg-rose-50 border-rose-200 text-rose-800" 
        : "bg-emerald-50 border-emerald-200 text-emerald-800";

    return (
        <div 
            className={`fixed bottom-5 right-5 z-50 max-w-sm rounded-lg border p-4 shadow-lg ${bgClass} transition-all duration-300`}
            style={{
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                animation: "slideUp 0.3s ease-out"
            }}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 text-sm font-medium">{toast.message}</div>
                <button
                    onClick={() => setToast(null)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                    <span className="text-lg leading-none">&times;</span>
                </button>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
