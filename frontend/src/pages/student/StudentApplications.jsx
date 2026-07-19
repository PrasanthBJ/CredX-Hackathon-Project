import { useEffect, useState, useRef } from "react";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import studentService from "../../services/studentService";
import { Clock, Building2, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentApplications() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const abortControllerRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await studentService.getOwnApplications();
      setApplications(list);
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading application history..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">My Applications</h1>
        <p className="text-sm text-[#64748B] mt-1">Review the status and history of your placement requests.</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState title="No active applications" description="Navigate to the Browse Jobs page to apply to open roles." />
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{app.postingTitle}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">{app.companyName}</p>
                  <p className="text-[11px] text-[#94A3B8] flex items-center gap-1 mt-2">
                    <Calendar className="w-3.5 h-3.5" /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
