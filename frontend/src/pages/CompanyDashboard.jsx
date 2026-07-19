import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import StatCard from "../components/shared/StatCard";
import companyService from "../services/companyService";
import dashboardService from "../services/dashboardService";
import authService from "../services/authService";
import {
  Briefcase, Plus, Clock, TrendingUp, Building, ArrowRight, UserCheck, BarChart2
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";

const PIE_COLORS = ["#22C55E", "#F59E0B", "#EF4444"];

export default function CompanyDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const loadData = async (signal) => {
    try {
      setLoading(true);
      const data = await dashboardService.getCompanyDashboardData({ signal });
      setProfile(data.profile);
      setJobs(data.jobs);
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    loadData(controller.signal);
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, []);

  const approvedJobsCount = jobs.filter(j => j.status === "APPROVED").length;
  const pendingJobsCount = jobs.filter(j => j.status === "PENDING").length;
  const rejectedJobsCount = jobs.filter(j => j.status === "REJECTED").length;

  const pipelineData = [
    { name: "Approved", count: approvedJobsCount, fill: "#22C55E" },
    { name: "Pending", count: pendingJobsCount, fill: "#F59E0B" },
    { name: "Rejected", count: rejectedJobsCount, fill: "#EF4444" },
  ].filter(d => d.count > 0);

  const approvalRate = jobs.length > 0 ? Math.round((approvedJobsCount / jobs.length) * 100) : 0;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner label="Loading overview..." /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">{profile ? profile.companyName : "Recruiter Dashboard"}</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage job postings, track applicant pipelines, and filter VTU candidates.</p>
        </div>
        <button
          onClick={() => navigate("/company/post-job")}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<Briefcase className="w-5 h-5" />} label="Total Postings" value={jobs.length} subtext="System vacancy forms" delay={0} />
        <StatCard icon={<Building className="w-5 h-5" />} label="Approved Active Roles" value={approvedJobsCount} subtext="Live in candidate directory" subtextColor="text-[#2563EB]" delay={0.05} />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Pending Verification" value={pendingJobsCount} subtext="Awaiting admin cell review" delay={0.1} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Approval Ratio" value={`${approvalRate}%`} highlight delay={0.15} />
      </div>

      {/* Lower Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions & Recent Listings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Quick Shortcuts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/company/post-job")}
                className="flex flex-col items-center justify-center p-5 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF]/20 rounded-2xl transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">Post New Role</span>
                <span className="text-[10px] text-[#64748B] mt-1">Submit requirements</span>
              </button>

              <button
                onClick={() => navigate("/company/jobs")}
                className="flex flex-col items-center justify-center p-5 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF]/20 rounded-2xl transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">Manage Postings</span>
                <span className="text-[10px] text-[#64748B] mt-1">View list status</span>
              </button>

              <button
                onClick={() => navigate("/company/applicants")}
                className="flex flex-col items-center justify-center p-5 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF]/20 rounded-2xl transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">Search Candidates</span>
                <span className="text-[10px] text-[#64748B] mt-1">Verify dynamic GPAs</span>
              </button>
            </div>
          </div>

          {/* Recent Listings */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Recent Activity</h3>
              <button onClick={() => navigate("/company/jobs")} className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer">
                View all postings
              </button>
            </div>
            {jobs.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-6">No jobs posted yet.</p>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">{job.title}</p>
                      <p className="text-[11px] text-[#64748B]">Min GPA: {job.minGpa.toFixed(1)} · Deadline {new Date(job.deadline).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      job.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      job.status === "PENDING" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-red-50 text-red-600 border border-red-100"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pipeline Pie Chart & Corporate Profile overview */}
        <div className="space-y-6">
          {/* Donut Chart */}
          {pipelineData.length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#2563EB]" /> Job Pipeline Distribution
              </h3>
              <div className="w-full h-40 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={4} dataKey="count">
                      {pipelineData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {pipelineData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-[10px] font-medium text-[#64748B]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} /> {d.name} ({d.count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Profile Overview Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-[#2563EB]" /> Corporate profile
            </h3>
            {profile ? (
              <div className="space-y-2.5 text-xs text-[#64748B]">
                <p className="font-semibold text-[#0F172A]">{profile.companyName}</p>
                <p className="leading-relaxed">{profile.description?.slice(0, 100)}...</p>
                <button
                  onClick={() => navigate("/company/profile")}
                  className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5"
                >
                  Edit details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#64748B] italic">Company details not completed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}