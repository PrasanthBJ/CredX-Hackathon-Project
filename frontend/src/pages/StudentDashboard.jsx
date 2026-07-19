import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import StatCard from "../components/shared/StatCard";
import dashboardService from "../services/dashboardService";
import authService from "../services/authService";
import {
  FileText, Award, Calendar, BarChart2, Briefcase, ArrowRight, Lightbulb, Bell,
} from "lucide-react";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();
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

  // Stats calculation
  const shortlistedCount = applications.filter(a => a.status === "SHORTLISTED").length;
  const interviewCount = applications.filter(a => a.status === "INTERVIEW").length;
  const totalJobsCount = jobs.length;
  const eligibleJobsCount = jobs.filter(j => profile ? profile.gpa >= j.minGpa : false).length;
  const placementRate = totalJobsCount > 0 ? Math.round((eligibleJobsCount / totalJobsCount) * 100) : 0;

  // Profile completion
  const profileFields = profile ? [profile.branch, profile.gpa, profile.gradYear, profile.resumeUrl].filter(Boolean).length : 0;
  const profileCompletion = Math.round((profileFields / 4) * 100);

  // Upcoming deadlines from jobs
  const upcomingDeadlines = [...jobs]
    .filter(j => new Date(j.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  // Recent applications (last 3)
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading overview..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Welcome back, {profile?.branch ? "Dinesh" : "Student"}! 👋
          </h1>
          <p className="text-sm text-[#64748B] mt-1">Here is a summary of your campus recruiting progress.</p>
        </div>

        {/* Profile Completeness Card */}
        <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl px-5 py-3 shadow-sm shrink-0">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#E2E8F0" strokeWidth="4" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="#2563EB" strokeWidth="4"
                strokeDasharray={`${(profileCompletion / 100) * 125.6} 125.6`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#2563EB]">
              {profileCompletion}%
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0F172A]">Academic Profile</p>
            <button
              onClick={() => navigate("/student/profile")}
              className="text-[11px] text-[#2563EB] font-medium hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
            >
              {profileCompletion < 100 ? "Complete your profile" : "Update Profile"}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="My Applications"
          value={applications.length}
          subtext="Total submissions"
          delay={0}
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Shortlisted Applications"
          value={shortlistedCount}
          subtext="Passed screening"
          delay={0.05}
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Scheduled Interviews"
          value={interviewCount}
          subtext="Upcoming meetings"
          delay={0.1}
        />
        <StatCard
          icon={<BarChart2 className="w-5 h-5" />}
          label="Job Eligibility Match"
          value={`${placementRate}%`}
          subtext="Compatible vacancies"
          highlight
          delay={0.15}
        />
      </div>

      {/* Lower Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column: Quick Actions & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/student/jobs")}
                className="flex flex-col items-center justify-center p-5 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF]/20 rounded-2xl transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">Browse Jobs</span>
                <span className="text-[10px] text-[#64748B] mt-1">Explore open roles</span>
              </button>

              <button
                onClick={() => navigate("/student/settings")}
                className="flex flex-col items-center justify-center p-5 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF]/20 rounded-2xl transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">Manage Account</span>
                <span className="text-[10px] text-[#64748B] mt-1">Update passwords</span>
              </button>
            </div>
          </div>

          {/* Recent Applications Feed */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Recent Activity</h3>
              <button
                onClick={() => navigate("/student/applications")}
                className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                View all applications
              </button>
            </div>

            {recentApplications.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-6">No applications submitted yet.</p>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">{app.postingTitle}</p>
                      <p className="text-[11px] text-[#64748B]">{app.companyName} · Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deadlines, Tips, notifications */}
        <div className="space-y-6">
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Upcoming Deadlines</h3>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-4">No upcoming deadlines.</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((job) => {
                  const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={job.id} className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{job.companyName} – {job.title.split(' ')[0]}</p>
                        <p className="text-[11px] text-[#64748B]">Apply by {new Date(job.deadline).toLocaleDateString()}</p>
                      </div>
                      <span className={`font-bold px-2 py-0.5 rounded-lg text-[10px] ${
                        daysLeft <= 3 ? "bg-red-50 text-[#EF4444]" : daysLeft <= 7 ? "bg-amber-50 text-amber-600" : "bg-[#EFF6FF] text-[#2563EB]"
                      }`}>
                        {daysLeft} days
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Placement Tip</h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Completing your dynamic academic profile increases recruiters' filtering match score. Go to the profile tab to upload your updated resume details!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}