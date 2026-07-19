import { useEffect, useState, useRef } from "react";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import companyService from "../../services/companyService";
import { Briefcase, UserCheck, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function ManageJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await companyService.getOwnJobPostings();
      setJobs(list);
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner label="Loading listings..." /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Manage Recruiting Opportunities</h1>
        <p className="text-sm text-[#64748B] mt-1">Review approved vacancy postings and check recruiter reviews.</p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="No opportunities submitted yet" description="Submit your first opening via the Post Job menu." />
      ) : (
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{job.title}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">{job.companyName}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <p className="text-xs text-[#64748B] line-clamp-3 mb-4 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>

              {job.eligibility && (
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 mb-4 text-xs">
                  <span className="font-semibold text-[#0F172A]">Eligibility:</span>{" "}
                  <span className="text-[#64748B]">{job.eligibility}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-[#E2E8F0] text-[11px] text-[#64748B]">
                <span>Min GPA threshold: <strong className="text-[#0f172a]">{job.minGpa.toFixed(2)}</strong></span>
                <span>Deadline: <strong className="text-[#0f172a]">{new Date(job.deadline).toLocaleDateString()}</strong></span>
                {job.reviewedByName && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-[#94A3B8] uppercase tracking-wide">
                    <UserCheck className="w-3.5 h-3.5" /> Reviewed by: {job.reviewedByName}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
