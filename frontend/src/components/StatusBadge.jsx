const STATUS_STYLES = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
    APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
    SHORTLISTED: "bg-violet-50 text-violet-700 border-violet-200",
    SELECTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-600 border-slate-200";

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${style}`}
        >
      {status}
    </span>
    );
}