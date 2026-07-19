import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import authService from "../../services/authService";
import companyService from "../../services/companyService";
import {
  User,
  Lock,
  Building,
  Bell,
  Palette,
  Shield,
  Smartphone,
  AlertTriangle,
  Key,
  Globe,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase,
  Mail,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanySettings() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");

  // Account/Profile state
  const [settingsName, setSettingsName] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsProfileImage, setSettingsProfileImage] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalProfileImage, setOriginalProfileImage] = useState("");

  // Password / Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Company state
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [originalCompanyName, setOriginalCompanyName] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [originalWebsite, setOriginalWebsite] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [accountData, companyData] = await Promise.all([
        authService.getSettings().catch(() => ({})),
        companyService.getProfile().catch(() => null),
      ]);

      // Map account settings
      setSettingsName(accountData.name || "");
      setSettingsEmail(accountData.email || "");
      setSettingsProfileImage(accountData.profileImage || "");
      setOriginalName(accountData.name || "");
      setOriginalEmail(accountData.email || "");
      setOriginalProfileImage(accountData.profileImage || "");

      // Map company profile details
      if (companyData) {
        setCompanyName(companyData.companyName || "");
        setDescription(companyData.description || "");
        setWebsite(companyData.website || "");
        setOriginalCompanyName(companyData.companyName || "");
        setOriginalDescription(companyData.description || "");
        setOriginalWebsite(companyData.website || "");
      }
    } catch (err) {
      showToast("error", "Failed to retrieve account preferences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Check for changes to enable save buttons
  const isProfileChanged =
    settingsName !== originalName ||
    settingsEmail !== originalEmail ||
    settingsProfileImage !== originalProfileImage;

  const isCompanyChanged =
    companyName !== originalCompanyName ||
    description !== originalDescription ||
    website !== originalWebsite;

  const isSecurityChanged =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0;

  // Handle Profile settings save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!isProfileChanged) return;
    setSaving(true);
    try {
      await authService.updateSettings({
        name: settingsName,
        email: settingsEmail,
        profileImage: settingsProfileImage,
      });
      setOriginalName(settingsName);
      setOriginalEmail(settingsEmail);
      setOriginalProfileImage(settingsProfileImage);
      localStorage.setItem("profileImage", settingsProfileImage || "");
      window.dispatchEvent(
        new CustomEvent("profile-image-updated", {
          detail: settingsProfileImage || "",
        })
      );
      showToast("success", "Profile configurations saved successfully!");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to update profile settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle Company settings save
  const handleSaveCompany = async (e) => {
    e.preventDefault();
    if (!isCompanyChanged) return;
    setSaving(true);
    try {
      await companyService.createOrUpdateProfile({
        companyName,
        description,
        website,
      });
      setOriginalCompanyName(companyName);
      setOriginalDescription(description);
      setOriginalWebsite(website);
      showToast("success", "Corporate profile updated successfully!");
    } catch (err) {
      showToast("error", "Failed to update company details.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Security settings save
  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("error", "Confirmation passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await authService.updateSettings({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("success", "Password credentials updated successfully!");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to update security credentials."
      );
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "security", label: "Security & Access", icon: Lock },
    { id: "company", label: "Company Profile", icon: Building },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy & Data", icon: Shield },
    { id: "sessions", label: "Active Sessions", icon: Smartphone },
    { id: "apiKeys", label: "API Keys", icon: Key, badge: "Sandbox" },
    { id: "dangerZone", label: "Danger Zone", icon: AlertTriangle, danger: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading settings..." />
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150";

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in relative">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[2000] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                : "bg-rose-50 text-rose-800 border-rose-100"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="text-xs font-semibold leading-relaxed">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
          <span>Recruiter</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-semibold">Settings</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your personal recruiter login credentials and settings layout.
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sticky Left Navigation Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 md:sticky md:top-20 z-10 bg-white border border-slate-100 rounded-2xl p-2 shadow-sm space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-[13px] font-semibold transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? item.danger
                      ? "bg-rose-50 text-rose-700 font-bold"
                      : "bg-[#EFF6FF] text-[#2563EB] font-bold"
                    : item.danger
                    ? "text-rose-500 hover:bg-rose-50/40"
                    : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 ${
                      isActive
                        ? item.danger
                          ? "text-rose-600"
                          : "text-[#2563EB]"
                        : item.danger
                        ? "text-rose-400 group-hover:text-rose-500"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-wider scale-90 border border-slate-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content Section View */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            {/* ══════════ 1. PROFILE SECTION ══════════ */}
            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Profile Details</h3>
                  <p className="text-xs text-slate-500 mt-1">Manage public profile attributes and contact details.</p>
                </div>
                <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                  {/* Photo Upload Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
                    <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                      <img
                        src={
                          settingsProfileImage ||
                          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                        }
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                      <p className="text-xs font-bold text-slate-800">Profile Image</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <label className="bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-bold py-2 px-3 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          Upload new
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () =>
                                  setSettingsProfileImage(reader.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        {settingsProfileImage && (
                          <button
                            type="button"
                            onClick={() => setSettingsProfileImage("")}
                            className="text-[11px] text-rose-600 font-bold hover:underline py-2 px-3 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                        <input
                          required
                          value={settingsName}
                          onChange={(e) => setSettingsName(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                        <input
                          required
                          type="email"
                          value={settingsEmail}
                          onChange={(e) => setSettingsEmail(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit row */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSettingsName(originalName);
                        setSettingsEmail(originalEmail);
                        setSettingsProfileImage(originalProfileImage);
                      }}
                      disabled={!isProfileChanged || saving}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isProfileChanged || saving}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-blue-500/10"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ══════════ 2. SECURITY SECTION ══════════ */}
            {activeSection === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm"
              >
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Security Credentials</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure your login passwords and authentication rules.</p>
                </div>
                <form onSubmit={handleSaveSecurity} className="p-6 space-y-5">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className={inputCls}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showCurrentPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className={inputCls}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password strength guide */}
                  {newPassword.length > 0 && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs text-slate-500 space-y-1.5">
                      <p className="font-bold text-slate-700">Password requirements:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li className={newPassword.length >= 6 ? "text-emerald-600 font-medium" : ""}>Minimum 6 characters length</li>
                        <li className={/\d/.test(newPassword) ? "text-emerald-600 font-medium" : ""}>Must contain at least one numeric digit</li>
                      </ul>
                    </div>
                  )}

                  {/* Submit row */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      disabled={!isSecurityChanged || saving}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isSecurityChanged || saving}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-blue-500/10"
                    >
                      {saving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ══════════ 3. COMPANY PROFILE ══════════ */}
            {activeSection === "company" && (
              <motion.div
                key="company"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm"
              >
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Company Information</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure the company directory details candidates see.</p>
                </div>
                <form onSubmit={handleSaveCompany} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                        <input
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Google"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Corporate Website Link</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                        <input
                          required
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://example.com"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Company Description</label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe organization focus areas, product technologies..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                    />
                  </div>

                  {/* Submit row */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setCompanyName(originalCompanyName);
                        setDescription(originalDescription);
                        setWebsite(originalWebsite);
                      }}
                      disabled={!isCompanyChanged || saving}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isCompanyChanged || saving}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-blue-500/10"
                    >
                      {saving ? "Saving..." : "Save Details"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ══════════ 4. PLACEHOLDER VIEWS ══════════ */}
            {["notifications", "appearance", "privacy", "sessions", "apiKeys"].includes(activeSection) && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Key className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    {navItems.find((n) => n.id === activeSection)?.label} Control
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    This section is configured under standard sandbox credentials. Production enterprise keys can be generated after domain validation.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ══════════ 5. DANGER ZONE ══════════ */}
            {activeSection === "dangerZone" && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm space-y-5"
              >
                <div className="border-b border-rose-100 pb-3 flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Danger Zone Actions</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs p-4 border border-rose-100 bg-rose-50/20 rounded-xl">
                    <div>
                      <p className="font-bold text-slate-900">Deactivate Hiring Account</p>
                      <p className="text-slate-500 mt-0.5">Temporarily freeze recruitment listings and applicants processing.</p>
                    </div>
                    <button className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">
                      Deactivate
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs p-4 border border-rose-200 bg-rose-50/40 rounded-xl">
                    <div>
                      <p className="font-bold text-rose-600">Delete Recruiter Record</p>
                      <p className="text-slate-500 mt-0.5">Permanently remove recruiter metadata from the active database.</p>
                    </div>
                    <button className="bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
