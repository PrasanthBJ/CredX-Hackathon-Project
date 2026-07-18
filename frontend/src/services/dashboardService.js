import studentService from "./studentService";
import companyService from "./companyService";
import adminService from "./adminService";
import analyticsService from "./analyticsService";

export const dashboardService = {
    async getStudentDashboardData() {
        const [profile, applications, jobs] = await Promise.all([
            studentService.getProfile().catch(() => null),
            studentService.getOwnApplications().catch(() => []),
            studentService.getApprovedJobPostings().catch(() => []),
        ]);
        return { profile, applications, jobs };
    },

    async getCompanyDashboardData() {
        const [profile, jobs] = await Promise.all([
            companyService.getProfile().catch(() => null),
            companyService.getOwnJobPostings().catch(() => []),
        ]);
        return { profile, jobs };
    },

    async getAdminDashboardData() {
        const [pendingJobs, allJobs, placementRate, companyStats] = await Promise.all([
            adminService.getPendingJobPostings().catch(() => []),
            adminService.getAllJobPostings().catch(() => []),
            analyticsService.getPlacementRate().catch(() => ({})),
            analyticsService.getApplicationsPerCompany().catch(() => ({})),
        ]);
        return { pendingJobs, allJobs, placementRate, companyStats };
    }
};

export default dashboardService;
