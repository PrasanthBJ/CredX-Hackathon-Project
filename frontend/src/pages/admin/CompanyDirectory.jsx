import { useEffect, useState, useRef } from "react";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import analyticsService from "../../services/analyticsService";
import { Building2, ListFilter, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function CompanyDirectory() {
  const [loading, setLoading] = useState(true);
  const [companyStats, setCompanyStats] = useState({});
  const abortControllerRef = useRef(null);

  const loadData = async (signal) => {
    try {
      setLoading(true);
      const data = await analyticsService.getApplicationsPerCompany({ signal });
      setCompanyStats(data);
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
    return <div className="flex items-center justify-center py-20"><Spinner label="Loading companies..." /></div>;
  }

  const entries = Object.entries(companyStats || {});

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Recruiter Partner Directory</h1>
        <p className="text-sm text-[#64748B] mt-1">Review active hiring organizations and applicant distributions.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-[#0F172A] mb-5 pb-4 border-b border-[#E2E8F0] flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#2563EB]" /> Registered Partners
        </h3>

        {entries.length === 0 ? (
          <EmptyState title="No active recruiters found" description="Recruiter accounts will show up here after login activity." />
        ) : (
          <div className="space-y-4">
            {entries.map(([name, count], index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex justify-between items-center text-xs p-4 border border-[#E2E8F0] bg-[#F8FAFC] rounded-2xl hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-[#0F172A] block">{name}</span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Corporate partner</span>
                  </div>
                </div>
                <span className="font-mono bg-[#EFF6FF] text-[#2563EB] rounded-lg px-2.5 py-1 font-bold text-[10px] border border-[#DBEAFE]">
                  {count} {count === 1 ? "applicant" : "applicants"}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
