import studentService from "./studentService";
import companyService from "./companyService";
import adminService from "./adminService";

export const jobService = {
    getApprovedJobs: studentService.getApprovedJobPostings,
    getCompanyJobs: companyService.getOwnJobPostings,
    getPendingJobs: adminService.getPendingJobPostings,
    getAllJobs: adminService.getAllJobPostings,
    createJob: companyService.createJobPosting,
};

export default jobService;
