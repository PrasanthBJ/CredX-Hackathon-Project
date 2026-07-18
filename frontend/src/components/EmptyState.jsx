import { Inbox } from "lucide-react";

export default function EmptyState({ title, description }) {
    return (
        <div className="text-center py-14 px-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1.5">{title}</p>
            {description && (
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">{description}</p>
            )}
        </div>
    );
}