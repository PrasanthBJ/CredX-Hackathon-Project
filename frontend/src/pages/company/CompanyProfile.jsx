import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import companyService from "../../services/companyService";
import { Building, Globe, Save, Edit2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await companyService.getProfile();
      setProfile(data);
      if (data) {
        setCompanyName(data.companyName || "");
        setDescription(data.description || "");
        setWebsite(data.website || "");
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
      const updated = await companyService.createOrUpdateProfile({
        companyName,
        description,
        website,
      });
      setProfile(updated);
      setIsEditing(false);
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Company profile updated successfully!" }
      }));
    } catch (err) { /* handled */ }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner label="Loading company profile..." /></div>;
  }

  const inputCls = "w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Company Profile</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage corporate information details displayed to candidates.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#E2E8F0]">
          <h3 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
            <Building className="w-5 h-5 text-[#2563EB]" /> Corporate Details
          </h3>
          {profile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Info
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Company Name</label>
              <input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Google Inc."
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Brief Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe organization goals, core products, and corporate values..."
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Website URL Link</label>
              <input
                required
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://google.com"
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
                {submitting ? "Saving..." : "Save Profile"}
              </button>
              {profile && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCompanyName(profile.companyName || "");
                    setDescription(profile.description || "");
                    setWebsite(profile.website || "");
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
            <div className="p-4 border border-[#E2E8F0] bg-[#F8FAFC] rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Company Description</h4>
              <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">{profile.description}</p>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-center">
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
              >
                Visit Corporate Website
                <Globe className="w-4 h-4" />
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
              Set Up Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
