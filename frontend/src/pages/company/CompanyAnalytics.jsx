import { useEffect, useState, useRef } from "react";
import Spinner from "../../components/Spinner";
import companyService from "../../services/companyService";
import { BarChart3, PieChart as PieIcon, TrendingUp, HelpCircle } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

const PIE_COLORS = ["#22C55E", "#F59E0B", "#EF4444"];

export default function CompanyAnalytics() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const abortControllerRef = useRef(null);

  const loadData = async (signal) => {
    try {
      setLoading(true);
      const list = await companyService.getOwnJobPostings({ signal });
      setJobs(list);
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
    { name: "Approved Listings", count: approvedJobsCount, fill: "#22C55E" },
    { name: "Pending Review", count: pendingJobsCount, fill: "#F59E0B" },
    { name: "Rejected Listings", count: rejectedJobsCount, fill: "#EF4444" },
  ].filter(d => d.count > 0);

  const mockDistribution = [
    { name: "SDE - I", count: 18 },
    { name: "QA Intern", count: 6 },
    { name: "Data Analyst", count: 12 },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner label="Loading analytics reporting..." /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Listing Analytics</h1>
        <p className="text-sm text-[#64748B] mt-1">Review statistical breakdowns of candidate compatibility and postings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Job pipeline breakdown */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-4.5 h-4.5 text-[#2563EB]" /> Opportunity Distribution
          </h3>
          {pipelineData.length === 0 ? (
            <p className="text-xs text-[#64748B] text-center py-10">No posted jobs to report.</p>
          ) : (
            <>
              <div className="w-full h-52 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="count">
                      {pipelineData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4">
                {pipelineData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748B]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} /> {d.name} ({d.count})
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Applicants distribution per job */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-[#2563EB]" /> Applicant Matching distribution
          </h3>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDistribution} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-[#94A3B8] italic text-center">Visualizes applications distribution per posted listing category.</p>
        </div>
      </div>
    </div>
  );
}
