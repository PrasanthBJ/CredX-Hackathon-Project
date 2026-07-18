export default function Spinner({ label = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide">{label}</p>
        </div>
    );
}