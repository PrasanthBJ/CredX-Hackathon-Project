import React, { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import SearchableSelect from "../common/SearchableSelect";
import "./SwitchWorkspaceModal.css";

function SwitchWorkspaceModal({ onClose, onSelect, currentDriveId, currentRoleId }) {
    const [selectedDriveId, setSelectedDriveId] = useState(currentDriveId || "");
    const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId || "");

    const driveOptions = [
        { value: "drive-1", label: "CredX Campus Placement 2026" },
        { value: "drive-2", label: "CredX Summer Internship Drive" },
        { value: "drive-3", label: "Off-Campus Opportunities" }
    ];

    const roleOptions = [
        { value: "student-cand", label: "Student Candidate" },
        { value: "student-rep", label: "Student Representative" },
        { value: "recruiter-mgr", label: "Hiring Manager" },
        { value: "recruiter-lead", label: "Lead Talent Acquisition" },
        { value: "admin-lead", label: "Placement Coordinator" },
        { value: "admin-head", label: "Placement Cell Head" }
    ];

    const handleSwitch = (e) => {
        e.preventDefault();
        const drive = driveOptions.find(d => d.value === selectedDriveId);
        const role = roleOptions.find(r => r.value === selectedRoleId);
        
        if (drive && role) {
            onSelect(drive.value, role.value, drive.label, role.label);
            window.dispatchEvent(new CustomEvent("api-toast-message", {
                detail: { type: "success", message: `Workspace switched to: ${drive.label}` }
            }));
        }
        onClose();
    };

    return (
        <div className="switch-workspace-overlay">
            <div className="switch-workspace-modal">
                <button className="switch-workspace-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                
                <div className="switch-workspace-header">
                    <h2 className="switch-workspace-title">Switch Workspace</h2>
                    <p className="switch-workspace-subtitle">Choose another campus recruiting drive and role assigned to your profile.</p>
                </div>

                <form onSubmit={handleSwitch} className="switch-workspace-form">
                    <div className="switch-workspace-field">
                        <label>Active Recruitment Drive</label>
                        <SearchableSelect
                            placeholder="Select Campus Drive"
                            options={driveOptions}
                            value={selectedDriveId}
                            onChange={(val) => setSelectedDriveId(val)}
                            iconType="warehouse"
                        />
                    </div>

                    <div className="switch-workspace-field">
                        <label>Assigned Profile Role</label>
                        <SearchableSelect
                            placeholder="Select Role"
                            options={roleOptions}
                            value={selectedRoleId}
                            onChange={(val) => setSelectedRoleId(val)}
                            iconType="role"
                            disabled={!selectedDriveId}
                        />
                    </div>

                    <div className="switch-workspace-actions">
                        <button type="button" className="switch-workspace-cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="switch-workspace-submit-btn" 
                            disabled={!selectedDriveId || !selectedRoleId}
                        >
                            Switch Workspace
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SwitchWorkspaceModal;
