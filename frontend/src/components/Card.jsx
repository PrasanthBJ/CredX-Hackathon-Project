export default function Card({ children, className = "" }) {
    return (
        <div
            className={`bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
        >
            {children}
        </div>
    );
}