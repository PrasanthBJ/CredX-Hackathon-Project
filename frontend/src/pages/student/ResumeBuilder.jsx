import { useState, useEffect } from "react";
import studentService from "../../services/studentService";
import Spinner from "../../components/Spinner";
import { Plus, Trash2, Printer, Award, Briefcase, GraduationCap, Code } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumeBuilder() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  
  // Work Experience
  const [experiences, setExperiences] = useState([
    { role: "Software Engineer Intern", company: "Google", duration: "Summer 2025", desc: "Collaborated with team members to optimize rendering pipelines." }
  ]);
  
  // Projects
  const [projects, setProjects] = useState([
    { title: "CredX Recruitment Engine", tech: "React, Tailwind, Spring Boot", desc: "Designed modular SaaS portals with granular security structures." }
  ]);
  
  // Skills
  const [skills, setSkills] = useState(["JavaScript", "Java", "Spring Boot", "React", "Tailwind CSS", "MySQL"]);
  const [newSkill, setNewSkill] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (err) { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addExperience = () => {
    setExperiences([...experiences, { role: "", company: "", duration: "", desc: "" }]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const addProject = () => {
    setProjects([...projects, { title: "", tech: "", desc: "" }]);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading resume data..." />
      </div>
    );
  }

  const inputCls = "w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all";

  return (
    <div className="space-y-6 animate-fade-in print:bg-white print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Resume Builder</h1>
          <p className="text-sm text-[#64748B] mt-1">Compile and print a standard A4 profile resume.</p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl px-5 py-2.5 shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print / PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:grid-cols-1 print:gap-0">
        {/* Left Side: Builder inputs */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          {/* Work Experience */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#2563EB]" /> Work Experience
              </h3>
              <button onClick={addExperience} className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {experiences.map((exp, idx) => (
              <div key={idx} className="p-3 border border-[#E2E8F0] rounded-xl space-y-2 relative">
                <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-[#EF4444] hover:text-red-700 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Role" value={exp.role} onChange={(e) => handleExperienceChange(idx, "role", e.target.value)} className={inputCls} />
                  <input placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(idx, "company", e.target.value)} className={inputCls} />
                </div>
                <input placeholder="Duration (e.g. Summer 2025)" value={exp.duration} onChange={(e) => handleExperienceChange(idx, "duration", e.target.value)} className={inputCls} />
                <textarea placeholder="Description" rows={2} value={exp.desc} onChange={(e) => handleExperienceChange(idx, "desc", e.target.value)} className={inputCls} />
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4 text-[#2563EB]" /> Academic Projects
              </h3>
              <button onClick={addProject} className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {projects.map((proj, idx) => (
              <div key={idx} className="p-3 border border-[#E2E8F0] rounded-xl space-y-2 relative">
                <button onClick={() => removeProject(idx)} className="absolute top-2 right-2 text-[#EF4444] hover:text-red-700 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Project Title" value={proj.title} onChange={(e) => handleProjectChange(idx, "title", e.target.value)} className={inputCls} />
                  <input placeholder="Tech Stack" value={proj.tech} onChange={(e) => handleProjectChange(idx, "tech", e.target.value)} className={inputCls} />
                </div>
                <textarea placeholder="Description" rows={2} value={proj.desc} onChange={(e) => handleProjectChange(idx, "desc", e.target.value)} className={inputCls} />
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#2563EB]" /> Technical Skills
            </h3>
            <form onSubmit={addSkill} className="flex gap-2">
              <input placeholder="e.g. Docker" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className={inputCls} />
              <button type="submit" className="bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer">
                Add
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#DBEAFE] px-2 py-0.5 rounded-md">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="text-[#94A3B8] hover:text-[#2563EB]">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: A4 Preview panel */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] shadow-md rounded-2xl p-8 max-w-[800px] mx-auto min-h-[900px] flex flex-col justify-between print:border-0 print:shadow-none print:p-0">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center pb-5 border-b-2 border-[#0F172A]">
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-wide">Dinesh</h2>
              <p className="text-xs text-[#64748B] mt-1">IT Student Candidate · Bengaluru</p>
              {profile?.resumeUrl && (
                <p className="text-[10px] text-[#2563EB] mt-1 select-all hover:underline">{profile.resumeUrl.slice(0, 50)}...</p>
              )}
            </div>

            {/* Grid structure */}
            <div className="space-y-6">
              {/* Education */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-1">Education</h4>
                {profile ? (
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-semibold text-[#0F172A]">{profile.branch || "Information Technology"}</p>
                      <p className="text-[#64748B] mt-0.5">Visvesvaraya Technological University</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#0f172a]">Class of {profile.gradYear || "2026"}</p>
                      <p className="text-emerald-600 font-bold mt-0.5">CGPA: {profile.gpa?.toFixed(2)} / 10.00</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic">Education profile not set. Update profile details.</p>
                )}
              </div>

              {/* Work Experience */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-1">Work Experience</h4>
                {experiences.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic">No experiences added.</p>
                ) : (
                  <div className="space-y-3">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between font-semibold text-[#0F172A]">
                          <span>{exp.role || "Role"} at <span className="text-[#2563EB]">{exp.company || "Company"}</span></span>
                          <span className="text-[#64748B]">{exp.duration || "Duration"}</span>
                        </div>
                        <p className="text-[#64748B] text-[11px] mt-1 leading-relaxed whitespace-pre-wrap">{exp.desc || "Description..."}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-1">Academic Projects</h4>
                {projects.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic">No projects added.</p>
                ) : (
                  <div className="space-y-3">
                    {projects.map((proj, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between font-semibold text-[#0F172A]">
                          <span>{proj.title || "Project"}</span>
                          <span className="text-[#2563EB] font-bold text-[10px]">{proj.tech || "Tech"}</span>
                        </div>
                        <p className="text-[#64748B] text-[11px] mt-1 leading-relaxed whitespace-pre-wrap">{proj.desc || "Description..."}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-1">Technical Skills</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((s) => (
                    <span key={s} className="text-[10px] font-semibold text-[#0F172A] bg-[#F1F5F9] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-[#E2E8F0] text-[9px] text-[#94A3B8] uppercase tracking-wider mt-12 print:mt-6">
            Generated via CredX Enterprise Recruiting Network
          </div>
        </div>
      </div>
    </div>
  );
}
