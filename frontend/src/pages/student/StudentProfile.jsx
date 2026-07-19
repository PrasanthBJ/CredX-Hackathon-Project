import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import studentService from "../../services/studentService";
import { User, Award, Calendar, GraduationCap, ExternalLink, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [branch, setBranch] = useState("");
  const [gpa, setGpa] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await studentService.getProfile();
      setProfile(data);
      if (data) {
        setBranch(data.branch || "");
        setGpa(data.gpa !== undefined && data.gpa !== null ? String(data.gpa) : "");
        setGradYear(data.gradYear !== undefined && data.gradYear !== null ? String(data.gradYear) : "");
        setResumeUrl(data.resumeUrl || "");
      } else {
        setIsEditing(true);
      }
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const profileData = {
        branch: branch || null,
        gpa: gpa && !isNaN(parseFloat(gpa)) ? parseFloat(gpa) : null,
        gradYear: gradYear && !isNaN(parseInt(gradYear)) ? parseInt(gradYear) : null,
        resumeUrl: resumeUrl || null,
      };
      const updated = await studentService.createOrUpdateProfile(profileData);
      setProfile(updated);
      setIsEditing(false);
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Profile saved successfully!" }
      }));
    } catch (err) { /* handled */ }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading profile..." />
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Academic Profile</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage your educational profile and resume credentials.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#E2E8F0]">
          <h3 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
            <User className="w-5 h-5 text-[#2563EB]" /> Profile Details
          </h3>
          {profile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
            >
              Edit details
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Branch / Major</label>
              <input
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Computer Science & Engineering"
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1.5">GPA (out of 10.0)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="9.15"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1.5">Graduation Year</label>
                <input
                  required
                  type="number"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  placeholder="2026"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Resume URL Link</label>
              <input
                required
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className={inputCls}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl py-2.5 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {submitting ? "Saving..." : "Save Details"}
              </button>
              {profile && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setBranch(profile.branch || "");
                    setGpa(profile.gpa !== undefined && profile.gpa !== null ? String(profile.gpa) : "");
                    setGradYear(profile.gradYear !== undefined && profile.gradYear !== null ? String(profile.gradYear) : "");
                    setResumeUrl(profile.resumeUrl || "");
                  }}
                  className="flex-1 bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-sm font-semibold rounded-xl py-2.5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : profile ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3.5 p-4 border border-[#E2E8F0] bg-[#F8FAFC] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider">Branch</p>
                  <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{profile.branch}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 border border-[#E2E8F0] bg-[#F8FAFC] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider">Cumulative GPA</p>
                  <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{profile.gpa?.toFixed(2)} / 10.00</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 border border-[#E2E8F0] bg-[#F8FAFC] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider">Graduation Year</p>
                  <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{profile.gradYear}</p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-[#E2E8F0] flex items-center justify-center">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
              >
                View Uploaded Resume
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-[#64748B] mb-4">You have not completed your profile credentials yet.</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl px-5 py-2.5 transition-all cursor-pointer"
            >
              Build Profile Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
