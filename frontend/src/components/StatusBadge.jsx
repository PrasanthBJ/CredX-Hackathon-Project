const STATUS_CONFIG = {
    PENDING:     { dot: "bg-amber-400",   cls: "bg-amber-50 text-amber-700 border-amber-200" },
    APPROVED:    { dot: "bg-emerald-400", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    REJECTED:    { dot: "bg-rose-400",    cls: "bg-rose-50 text-rose-700 border-rose-200" },
    CLOSED:      { dot: "bg-slate-400",   cls: "bg-slate-100 text-slate-500 border-slate-200" },
    APPLIED:     { dot: "bg-blue-400",    cls: "bg-blue-50 text-blue-700 border-blue-200" },
    SHORTLISTED: { dot: "bg-violet-400",  cls: "bg-violet-50 text-violet-700 border-violet-200" },
    SELECTED:    { dot: "bg-emerald-400", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || {
        dot: "bg-slate-400",
        cls: "bg-slate-100 text-slate-500 border-slate-200",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${config.cls}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
            {status}
        </span>
    );
}