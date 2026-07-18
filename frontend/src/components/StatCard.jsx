export default function StatCard({ label, value, icon: Icon, accent = false }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
            <div>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-1">
                    {label}
                </p>
                <p className="text-2xl font-semibold text-surface">{value}</p>
            </div>
            <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    accent ? "bg-accent/10 text-accent" : "bg-slate-100 text-slate-500"
                }`}
            >
                <Icon size={19} strokeWidth={2} />
            </div>
        </div>
    );
}