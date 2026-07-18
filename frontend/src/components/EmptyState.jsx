export default function EmptyState({ title, description }) {
    return (
        <div className="text-center py-16 px-6 border border-dashed border-slate-300 rounded-xl bg-white">
            <p className="text-sm font-medium text-slate-700 mb-1">{title}</p>
            {description && (
                <p className="text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
            )}
        </div>
    );
}