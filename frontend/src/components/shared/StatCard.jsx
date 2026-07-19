import { motion } from "framer-motion";

export default function StatCard({ icon, label, value, subtext, subtextColor, highlight, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`bg-white border rounded-2xl p-5 transition-all duration-200 hover:shadow-md ${
        highlight
          ? "border-[#2563EB]/20 bg-[#EFF6FF]/30"
          : "border-[#E2E8F0] shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#64748B] mb-1">{label}</p>
          <p className={`text-2xl font-bold ${highlight ? "text-[#2563EB]" : "text-[#0F172A]"}`}>
            {value}
          </p>
          {subtext && (
            <p className={`text-[11px] font-medium mt-1 ${subtextColor || "text-[#64748B]"}`}>
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            highlight ? "bg-[#DBEAFE] text-[#2563EB]" : "bg-[#F1F5F9] text-[#64748B]"
          }`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
