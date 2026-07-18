import { Search, Bell } from "lucide-react";

export default function Topbar({ title, subtitle }) {
    return (
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
            <div>
                <h1 className="text-base font-semibold text-surface">{title}</h1>
                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        placeholder="Search..."
                        className="text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 w-56 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                    />
                </div>
                <button className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-accent hover:border-accent transition-colors">
                    <Bell size={16} />
                </button>
            </div>
        </header>
    );
}