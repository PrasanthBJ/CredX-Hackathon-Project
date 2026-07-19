import { useEffect, useState, useRef } from "react";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import adminService from "../../services/adminService";
import { ClipboardList, UserCheck, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function JobsList() {
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState([]);
  const abortControllerRef = useRef(null);

  const loadData = async (signal) => {
    try {
      setLoading(true);
      const data = await adminService.getAllJobPostings({ signal });
      setAllJobs(data);
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    loadData(controller.signal);
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner label="Loading all listings..." /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">All Job Postings</h1>
        <p className="text-sm text-[#64748B] mt-1">Review all active, pending, and archived vacancies across the system.</p>
      </div>

      {allJobs.length === 0 ? (
        <EmptyState title="No job listings found" />
      ) : (
        <div className="space-y-4">
          {allJobs.map((job) => (
            <motion.div key={job.id} layout>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{job.title}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">{job.companyName}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed mb-4 whitespace-pre-wrap">{job.description}</p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3.5 border-t border-[#E2E8F0] text-[10px] text-[#64748B] font-medium">
                  <div>
                    <span className="text-[#94A3B8]">MIN GPA:</span>{" "}
                    <span className="font-bold text-[#0F172A]">{job.minGpa.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">ELIGIBILITY:</span>{" "}
                    <span className="font-bold text-[#0F172A]">{job.eligibility}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">DEADLINE:</span>{" "}
                    <span className="font-bold text-[#0F172A]">
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  {job.reviewedByName && (
                    <div className="ml-auto inline-flex items-center gap-1 text-[9px] text-[#94A3B8] uppercase tracking-wide">
                      <UserCheck className="w-3.5 h-3.5" />
                      Reviewed by: {job.reviewedByName}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
