import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import StatCard from "../components/shared/StatCard";
import dashboardService from "../services/dashboardService";
import authService from "../services/authService";
import {
  GraduationCap, Building2, FileText, TrendingUp, CheckSquare, Users, ClipboardList
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalCompanies: 0, totalApplications: 0, placementRatePercentage: 0.0 });
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const loadData = async (signal) => {
    try {
      setLoading(true);
      const data = await dashboardService.getAdminDashboardData({ signal });
      setPendingJobs(data.pendingJobs);
      setAllJobs(data.allJobs);
      setStats(data.placementRate);
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
    return <div className="flex items-center justify-center py-20"><Spinner label="Loading admin panel..." /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Info */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Placement Cell Admin Dashboard</h1>
        <p className="text-sm text-[#64748B] mt-1">Review recruiter listings, candidates enrollment records, and system-wide hiring parameters.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<GraduationCap className="w-5 h-5" />} label="Registered Candidates" value={stats?.totalStudents ?? 0} delay={0} />
        <StatCard icon={<Building2 className="w-5 h-5" />} label="Partner Recruiters" value={stats?.totalCompanies ?? 0} delay={0.05} />
        <StatCard icon={<FileText className="w-5 h-5" />} label="Total Applications" value={stats?.totalApplications ?? 0} delay={0.1} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Placement Success" value={`${(stats?.placementRatePercentage ?? 0).toFixed(1)}%`} highlight delay={0.15} />
      </div>

      {/* Lower layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column: Quick Actions & Pending List Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Cell Operations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/admin/pending")}
                className="flex flex-col items-center justify-center p-5 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF]/20 rounded-2xl transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">Verify Postings</span>
                <span className="text-[10px] text-[#64748B] mt-1">{pendingJobs.length} roles pending</span>
              </button>

              <button
                onClick={() => navigate("/admin/students")}
                className="flex flex-col items-center justify-center p-5 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF]/20 rounded-2xl transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">Candidate Directory</span>
                <span className="text-[10px] text-[#64748B] mt-1">GPA & credential overrides</span>
              </button>

              <button
                onClick={() => navigate("/admin/reports")}
                className="flex flex-col items-center justify-center p-5 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF]/20 rounded-2xl transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">Generate Reports</span>
                <span className="text-[10px] text-[#64748B] mt-1">VTU placement exports</span>
              </button>
            </div>
          </div>

          {/* Pending Verification list preview */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Pending Review</h3>
              <button onClick={() => navigate("/admin/pending")} className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer">
                Manage approvals
              </button>
            </div>
            {pendingJobs.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-6">All submitted recruiter roles have been verified!</p>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {pendingJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">{job.title}</p>
                      <p className="text-[11px] text-[#64748B]">{job.companyName} · Min GPA {job.minGpa.toFixed(1)}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                      Awaiting Cell Review
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Listings Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">System Job Summary</h3>
            <div className="space-y-3.5 text-xs text-[#64748B]">
              <div className="flex justify-between"><span>Approved Vacancies</span><span className="font-bold text-[#0F172A]">{allJobs.filter(j => j.status === 'APPROVED').length} roles</span></div>
              <div className="flex justify-between"><span>Pending verification</span><span className="font-bold text-amber-600">{pendingJobs.length} roles</span></div>
              <div className="flex justify-between"><span>Rejected vacancies</span><span className="font-bold text-red-500">{allJobs.filter(j => j.status === 'REJECTED').length} roles</span></div>
              <div className="pt-2 border-t border-[#E2E8F0] flex justify-center">
                <button
                  onClick={() => navigate("/admin/jobs")}
                  className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Browse all system jobs
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}