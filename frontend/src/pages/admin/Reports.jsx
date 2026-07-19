import { useState } from "react";
import studentService from "../../services/studentService";
import adminService from "../../services/adminService";
import Spinner from "../../components/Spinner";
import { ClipboardList, FileSpreadsheet, Download, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Reports() {
  const [loading, setLoading] = useState(false);

  const handleDownloadCSV = async () => {
    setLoading(true);
    try {
      // Simulate generating a CSV report download
      const students = await studentService.getAllProfiles();
      const csvRows = [
        ["Name", "Email", "Branch", "GPA", "Graduation Year", "Resume"].join(","),
        ...students.map(s => [
          s.studentName || "Unnamed",
          s.studentEmail,
          s.branch || "N/A",
          s.gpa !== null ? s.gpa.toFixed(2) : "N/A",
          s.gradYear || "N/A",
          s.resumeUrl || "N/A"
        ].map(val => `"${val}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvRows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", `CredX_VTU_Candidate_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      a.click();
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Candidate report CSV generated!" }
      }));
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  const handleDownloadJobsCSV = async () => {
    setLoading(true);
    try {
      const jobs = await adminService.getAllJobPostings();
      const csvRows = [
        ["Title", "Company", "Min GPA", "Eligibility", "Deadline", "Status", "Reviewer"].join(","),
        ...jobs.map(j => [
          j.title,
          j.companyName,
          j.minGpa.toFixed(2),
          j.eligibility || "N/A",
          j.deadline,
          j.status,
          j.reviewedByName || "N/A"
        ].map(val => `"${val}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvRows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", `CredX_Opportunities_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      a.click();
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Opportunities report CSV generated!" }
      }));
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Placement Reporting Cell</h1>
        <p className="text-sm text-[#64748B] mt-1">Export recruitment details and compile summaries of student candidates.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="text-base font-semibold text-[#0F172A] mb-4 pb-4 border-b border-[#E2E8F0] flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#2563EB]" /> Export Parameters
        </h3>

        {loading ? (
          <div className="py-12"><Spinner label="Compiling report data..." /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 border border-[#E2E8F0] rounded-2xl hover:border-[#2563EB] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#0f172a]">VTU Candidate Database</h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Downloads all active candidate records, branches, dynamic GPA values, and resume links in a standard CSV format.
                </p>
              </div>
              <button
                onClick={handleDownloadCSV}
                className="mt-6 inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl py-2.5 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            <div className="p-5 border border-[#E2E8F0] rounded-2xl hover:border-[#2563EB] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#0f172a]">Campus Opportunities Report</h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Export approved recruiting roles, vacancy metrics, deadline limits, and administrative review approvals logs.
                </p>
              </div>
              <button
                onClick={handleDownloadJobsCSV}
                className="mt-6 inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl py-2.5 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
