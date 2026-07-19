import { Bell, Info, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentNotifications() {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Application Shortlisted",
      desc: "Google shortlisted your profile for the Software Engineer Intern role. Check your registered email for interview coordinates.",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      id: 2,
      type: "info",
      title: "New Job Posting Approved",
      desc: "Kumar Technologies posted a new opportunity: Frontend Architect. GPA requirement: 7.50.",
      time: "1 day ago",
      icon: Info,
      color: "text-[#2563EB] bg-[#EFF6FF] border-[#DBEAFE]",
    },
    {
      id: 3,
      type: "warning",
      title: "Resume Link Verification",
      desc: "Please ensure your resume link is publicly viewable. Recruiters report access permission denials on Google Drive.",
      time: "3 days ago",
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Notifications & Alerts</h1>
        <p className="text-sm text-[#64748B] mt-1">Stay updated on your screening statuses and campus announcements.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-[#0F172A] flex items-center gap-2 pb-4 border-b border-[#E2E8F0]">
          <Bell className="w-5 h-5 text-[#2563EB]" /> Unread System Notifications
        </h3>

        <div className="space-y-4">
          {notifications.map((notif, idx) => {
            const Icon = notif.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`flex items-start gap-4 p-4 border rounded-2xl ${notif.color}`}
              >
                <div className="p-2 rounded-xl bg-white shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-[#0f172a]">{notif.title}</h4>
                    <span className="text-[10px] text-[#64748B]">{notif.time}</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">{notif.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
