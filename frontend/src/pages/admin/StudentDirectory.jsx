import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import studentService from "../../services/studentService";
import { Users, Save, GraduationCap, Award, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentDirectory() {
  const [studentList, setStudentList] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditingStudentModalOpen, setIsEditingStudentModalOpen] = useState(false);
  const [editBranch, setEditBranch] = useState("");
  const [editGpa, setEditGpa] = useState("");
  const [editGradYear, setEditGradYear] = useState("");
  const [editResumeUrl, setEditResumeUrl] = useState("");
  const [updatingStudent, setUpdatingStudent] = useState(false);

  const loadStudentList = async () => {
    setLoadingStudents(true);
    try {
      const list = await studentService.getAllProfiles();
      setStudentList(list);
    } catch (err) { /* handled */ }
    finally { setLoadingStudents(false); }
  };

  useEffect(() => {
    loadStudentList();
  }, []);

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setUpdatingStudent(true);
    try {
      await studentService.updateProfileByOther(selectedStudent.userId, {
        branch: editBranch,
        gpa: parseFloat(editGpa),
        gradYear: parseInt(editGradYear),
        resumeUrl: editResumeUrl
      });
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "success", message: "Student credentials updated successfully!" }
      }));
      setIsEditingStudentModalOpen(false);
      loadStudentList();
    } catch (err) {
      window.dispatchEvent(new CustomEvent("api-toast-message", {
        detail: { type: "error", message: "Failed to update student profile" }
      }));
    } finally {
      setUpdatingStudent(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all";

  if (loadingStudents) {
    return <div className="py-16"><Spinner label="Loading student directory..." /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Candidate Directory</h1>
        <p className="text-sm text-[#64748B] mt-1">Review student academic scores and override GPA details.</p>
      </div>

      {studentList.length === 0 ? (
        <EmptyState title="No candidate records found" description="Profiles will display once students complete profile onboarding." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {studentList.map((student) => (
            <motion.div key={student.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">{student.studentName || "Unnamed"}</h3>
                      <p className="text-xs text-[#64748B]">{student.studentEmail}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setEditBranch(student.branch || "");
                        setEditGpa(student.gpa !== undefined && student.gpa !== null ? String(student.gpa) : "");
                        setEditGradYear(student.gradYear !== undefined && student.gradYear !== null ? String(student.gradYear) : "");
                        setEditResumeUrl(student.resumeUrl || "");
                        setIsEditingStudentModalOpen(true);
                      }}
                      className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] border border-[#DBEAFE] hover:bg-[#EFF6FF] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                      Override Details
                    </button>
                  </div>

                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs space-y-2 mt-2">
                    <div className="flex justify-between"><span className="text-[#94A3B8]">Branch:</span><span className="font-semibold text-[#0F172A]">{student.branch || "Not Specified"}</span></div>
                    <div className="flex justify-between"><span className="text-[#94A3B8]">GPA Score:</span><span className="font-semibold text-[#0F172A]">{student.gpa !== null ? student.gpa.toFixed(2) : "N/A"}</span></div>
                    <div className="flex justify-between"><span className="text-[#94A3B8]">Graduation Year:</span><span className="font-semibold text-[#0F172A]">{student.gradYear || "N/A"}</span></div>
                    {student.resumeUrl && (
                      <div className="flex justify-between pt-1.5 border-t border-[#E2E8F0] mt-1.5">
                        <span className="text-[#94A3B8]">Academic Resume:</span>
                        <a href={student.resumeUrl} target="_blank" rel="noreferrer" className="text-[#2563EB] hover:underline font-semibold flex items-center gap-0.5">
                          View PDF <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-[#E2E8F0]">
                  {student.updatedByList ? (
                    <p className="text-[11px] text-[#64748B]"><span className="font-semibold text-[#0F172A]">History log:</span> {student.updatedByList}</p>
                  ) : (
                    <p className="text-[11px] text-[#94A3B8] italic">Profile has not been overridden by recruiters.</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditingStudentModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/45 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-[#E2E8F0]">
            <div className="px-6 py-5 border-b border-[#E2E8F0] flex justify-between items-center">
              <h3 className="text-base font-bold text-[#0F172A]">Override {selectedStudent?.studentName} Info</h3>
              <button onClick={() => setIsEditingStudentModalOpen(false)} className="text-[#94A3B8] hover:text-[#0f172a] text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1">Branch</label>
                <input required value={editBranch} onChange={(e) => setEditBranch(e.target.value)} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1">GPA</label>
                  <input required type="number" step="0.01" value={editGpa} onChange={(e) => setEditGpa(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1">Grad Year</label>
                  <input required type="number" value={editGradYear} onChange={(e) => setEditGradYear(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1">Resume Link</label>
                <input value={editResumeUrl} onChange={(e) => setEditResumeUrl(e.target.value)} className={inputCls} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button type="button" onClick={() => setIsEditingStudentModalOpen(false)} className="px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-[#F8FAFC] text-sm font-semibold cursor-pointer">Cancel</button>
                <button type="submit" disabled={updatingStudent} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1">
                  <Save className="w-4 h-4" /> {updatingStudent ? "Saving..." : "Save Overrides"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
