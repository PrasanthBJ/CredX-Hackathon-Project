import { useEffect, useState, useRef } from "react";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import studentService from "../../services/studentService";
import dashboardService from "../../services/dashboardService";
import { Search, MapPin, DollarSign, Building2, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BrowseJobs() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const abortControllerRef = useRef(null);

  const loadData = async (signal) => {
    try {
      setLoading(true);
      const data = await dashboardService.getStudentDashboardData({ signal });
      setProfile(data.profile);
      setJobs(data.jobs);
      setApplications(data.applications);
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    loadData(controller.signal);
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, []);

  const handleApply = async (postingId) => {
    setActionLoading(postingId);
    try {
      const newApp = await studentService.applyToJobPosting(postingId);
      setApplications((prev) => [...prev, newApp]);
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Application submitted successfully!" }
      }));
    } catch (err) { /* handled */ }
    finally { setActionLoading(null); }
  };

  const hasApplied = (postingId) => applications.some((app) => app.postingId === postingId);
  const getApplicationStatus = (postingId) => {
    const app = applications.find((a) => a.postingId === postingId);
    return app ? app.status : null;
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading openings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Browse Opportunities</h1>
        <p className="text-sm text-[#64748B] mt-1">Explore and apply to positions matching your profile credentials.</p>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search jobs by title or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
        />
      </div>

      {filteredJobs.length === 0 ? (
        <EmptyState title="No opportunities found" description="Adjust your filters or search keywords." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job, index) => {
            const applied = hasApplied(job.id);
            const status = getApplicationStatus(job.id);
            const isGpaEligible = profile ? profile.gpa >= job.minGpa : false;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0F172A]">{job.title}</h3>
                        <p className="text-xs text-[#64748B] mt-0.5">{job.companyName}</p>
                      </div>
                    </div>
                    {applied && <StatusBadge status={status} />}
                  </div>

                  <p className="text-xs text-[#64748B] line-clamp-3 mb-4 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.eligibility && (
                      <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
                        {job.eligibility}
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Bangalore
                    </span>
                    <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> 8-15 LPA
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] mt-auto">
                  <div className="flex gap-4 text-[11px] text-[#64748B]">
                    <span>Min GPA: <strong className={isGpaEligible ? "text-emerald-600" : "text-[#EF4444]"}>{job.minGpa.toFixed(1)}</strong></span>
                    <span>Deadline: <strong>{new Date(job.deadline).toLocaleDateString()}</strong></span>
                  </div>

                  {!profile ? (
                    <span className="text-[11px] font-semibold text-[#EF4444]">Fill profile to apply</span>
                  ) : applied ? (
                    <button disabled className="bg-[#F1F5F9] text-[#94A3B8] text-xs font-semibold rounded-xl px-4 py-2 cursor-not-allowed">Applied</button>
                  ) : !isGpaEligible ? (
                    <span className="text-[11px] font-semibold text-[#EF4444]">GPA requires {job.minGpa.toFixed(1)}</span>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={actionLoading === job.id}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl px-5 py-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      {actionLoading === job.id ? "Applying..." : "Apply Now"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
