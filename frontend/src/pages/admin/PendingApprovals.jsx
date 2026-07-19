import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import adminService from "../../services/adminService";
import { CheckSquare, Check, X, Calendar, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function PendingApprovals() {
  const [loading, setLoading] = useState(true);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPendingJobPostings();
      setPendingJobs(data);
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading({ id, type: "approve" });
    try {
      await adminService.approveJobPosting(id);
      setPendingJobs((prev) => prev.filter((job) => job.id !== id));
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Job posting approved successfully!" }
      }));
    } catch (err) { /* handled */ }
    finally { setActionLoading(null); }
  };

  const handleReject = async (id) => {
    setActionLoading({ id, type: "reject" });
    try {
      await adminService.rejectJobPosting(id);
      setPendingJobs((prev) => prev.filter((job) => job.id !== id));
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Job posting rejected successfully." }
      }));
    } catch (err) { /* handled */ }
    finally { setActionLoading(null); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner label="Loading pending postings..." /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Verify Posted Vacancies</h1>
        <p className="text-sm text-[#64748B] mt-1">Review newly submitted opportunities from hiring recruiter partners.</p>
      </div>

      {pendingJobs.length === 0 ? (
        <EmptyState title="All caught up!" description="No postings currently awaiting cell review." />
      ) : (
        <div className="space-y-4">
          {pendingJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{job.title}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">{job.companyName}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed mb-4 whitespace-pre-wrap">{job.description}</p>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 mb-4 text-xs space-y-1.5 font-medium text-[#64748B]">
                <div><span className="text-[#94A3B8]">GPA Threshold:</span> <span className="text-[#0F172A] font-semibold">{job.minGpa.toFixed(2)}</span></div>
                <div><span className="text-[#94A3B8]">Target Eligibility:</span> <span className="text-[#0F172A] font-semibold">{job.eligibility}</span></div>
                <div><span className="text-[#94A3B8]">Application Deadline:</span> <span className="text-[#0F172A] font-semibold">{new Date(job.deadline).toLocaleString()}</span></div>
              </div>

              <div className="flex justify-end gap-3 pt-3.5 border-t border-[#E2E8F0]">
                <button
                  onClick={() => handleReject(job.id)}
                  disabled={actionLoading !== null}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-red-50 hover:text-[#EF4444] hover:border-red-200 text-[#64748B] text-xs font-semibold rounded-xl px-4 py-2.5 border border-[#E2E8F0] transition-all cursor-pointer disabled:opacity-60"
                >
                  <X className="w-3.5 h-3.5" />
                  {actionLoading?.id === job.id && actionLoading?.type === "reject" ? "Rejecting..." : "Reject"}
                </button>
                <button
                  onClick={() => handleApprove(job.id)}
                  disabled={actionLoading !== null}
                  className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl px-4 py-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                >
                  <Check className="w-3.5 h-3.5" />
                  {actionLoading?.id === job.id && actionLoading?.type === "approve" ? "Approving..." : "Approve"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
