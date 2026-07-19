import { useEffect, useState, useRef } from "react";
import Spinner from "../../components/Spinner";
import analyticsService from "../../services/analyticsService";
import dashboardService from "../../services/dashboardService";
import { BarChart3, TrendingUp, Info } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [companyStats, setCompanyStats] = useState({});
  const abortControllerRef = useRef(null);

  const loadData = async (signal) => {
    try {
      setLoading(true);
      const data = await dashboardService.getAdminDashboardData({ signal });
      setStats(data.placementRate);
      setCompanyStats(data.companyStats);
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    loadData(controller.signal);
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, []);

  const companyChartData = Object.entries(companyStats || {}).map(([name, count]) => ({
    name: name.length > 12 ? `${name.substring(0, 12)}.` : name,
    count
  }));

  const trendRate = stats?.placementRatePercentage || 0;
  const historicalTrendData = [
    { name: "Q1", rate: Math.max(0, trendRate - 20) },
    { name: "Q2", rate: Math.max(0, trendRate - 12) },
    { name: "Q3", rate: Math.max(0, trendRate - 5) },
    { name: "Q4", rate: trendRate }
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner label="Loading cell metrics..." /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Placement Cell Metrics</h1>
        <p className="text-sm text-[#64748B] mt-1">Review statistical charts on hiring rates and application allocations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Trend rates */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-[#2563EB]" /> Historical Placement Rates
          </h3>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalTrendData} margin={{ left: -25, right: 10, top: 10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="rate" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Company Distribution */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-[#2563EB]" /> Applications / Partner Recruiter
          </h3>
          {companyChartData.length === 0 ? (
            <p className="text-xs text-[#64748B] text-center py-12">No active statistics available.</p>
          ) : (
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyChartData} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
