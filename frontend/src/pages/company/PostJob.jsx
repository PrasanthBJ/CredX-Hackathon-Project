import { useState } from "react";
import { useNavigate } from "react-router-dom";
import companyService from "../../services/companyService";
import { Save, AlertCircle, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PostJob() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobEligibility, setJobEligibility] = useState("");
  const [jobMinGpa, setJobMinGpa] = useState("");
  const [jobDeadline, setJobDeadline] = useState("");
  const [submittingJob, setSubmittingJob] = useState(false);
  const navigate = useNavigate();

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmittingJob(true);
    try {
      const localIsoDeadline = new Date(jobDeadline).toISOString().slice(0, 19);
      await companyService.createJobPosting({
        title: jobTitle,
        description: jobDesc,
        eligibility: jobEligibility,
        minGpa: parseFloat(jobMinGpa),
        deadline: localIsoDeadline,
      });

      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Job posting created! Awaiting admin review." }
      }));
      navigate("/company/jobs");
    } catch (err) { /* handled */ }
    finally { setSubmittingJob(false); }
  };

  const inputCls = "w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Post Recruitment Opening</h1>
        <p className="text-sm text-[#64748B] mt-1">Submit a new job posting for placement cell coordinator verification.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-[#0F172A] mb-5 pb-4 border-b border-[#E2E8F0] flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-[#2563EB]" /> Opportunity Information
        </h3>

        <form onSubmit={handleCreateJob} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Job Title</label>
              <input
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Software Development Engineer - I"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Min GPA</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={jobMinGpa}
                onChange={(e) => setJobMinGpa(e.target.value)}
                placeholder="7.50"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Eligibility Criteria</label>
            <input
              required
              value={jobEligibility}
              onChange={(e) => setJobEligibility(e.target.value)}
              placeholder="B.Tech (CS/IT/ECE) graduating in 2026 without active backlogs"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Application Deadline</label>
              <input
                required
                type="date"
                value={jobDeadline}
                onChange={(e) => setJobDeadline(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Job Description</label>
            <textarea
              required
              rows={5}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Describe roles, key responsibilities, tech stack, and compensation details..."
              className={inputCls}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="submit"
              disabled={submittingJob}
              className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl py-2.5 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              {submittingJob ? "Submitting..." : "Submit Opening"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/company")}
              className="flex-1 bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-sm font-semibold rounded-xl py-2.5 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
