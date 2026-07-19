import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import authService from "../../services/authService";
import { User, Lock, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentSettings() {
  const [loading, setLoading] = useState(true);
  const [settingsName, setSettingsName] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsProfileImage, setSettingsProfileImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await authService.getSettings();
      setSettingsName(data.name || "");
      setSettingsEmail(data.email || "");
      setSettingsProfileImage(data.profileImage || "");
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await authService.updateSettings({
        name: settingsName,
        email: settingsEmail,
        profileImage: settingsProfileImage
      });
      localStorage.setItem("profileImage", settingsProfileImage || "");
      window.dispatchEvent(new CustomEvent("profile-image-updated", { detail: settingsProfileImage || "" }));
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Account details updated successfully!" }
      }));
    } catch (err) {
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "error", message: err.response?.data?.message || "Failed to update settings" }
      }));
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "error", message: "Please fill in all password fields." }
      }));
      return;
    }
    if (newPassword !== confirmPassword) {
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "error", message: "New passwords do not match." }
      }));
      return;
    }
    setSavingSettings(true);
    try {
      await authService.updateSettings({
        currentPassword,
        newPassword
      });
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Password updated successfully!" }
      }));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "error", message: err.response?.data?.message || "Failed to change password." }
      }));
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading settings..." />
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all";

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Account Settings</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage your account profile picture, credentials, and password security.</p>
      </div>

      {/* Personal Details */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-[#0F172A] mb-5 pb-4 border-b border-[#E2E8F0] flex items-center gap-2">
          <User className="w-5 h-5 text-[#2563EB]" /> Personal Details
        </h3>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
            <img
              src={settingsProfileImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"}
              alt="Profile Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#E2E8F0] shadow-sm"
            />
            <div className="flex flex-col gap-1.5 items-center sm:items-start">
              <label className="bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold rounded-lg px-4 py-2 border border-[#E2E8F0] transition-all cursor-pointer inline-block">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setSettingsProfileImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {settingsProfileImage && (
                <button
                  type="button"
                  onClick={() => setSettingsProfileImage("")}
                  className="text-[11px] text-[#EF4444] font-semibold hover:underline cursor-pointer"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Full Name</label>
              <input required value={settingsName} onChange={(e) => setSettingsName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Email Address</label>
              <input required type="email" value={settingsEmail} onChange={(e) => setSettingsEmail(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl px-6 py-2.5 transition-all disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {savingSettings ? "Saving..." : "Save Account Info"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-[#0F172A] mb-5 pb-4 border-b border-[#E2E8F0] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#2563EB]" /> Security Settings
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl px-6 py-2.5 transition-all disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              {savingSettings ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
