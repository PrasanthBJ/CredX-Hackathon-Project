export default function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                {subtitle && (
                    <p className="text-sm text-slate-500 mt-1.5 max-w-xl leading-relaxed">{subtitle}</p>
                )}
            </div>
            {action && <div className="shrink-0 ml-6">{action}</div>}
        </div>
    );
}