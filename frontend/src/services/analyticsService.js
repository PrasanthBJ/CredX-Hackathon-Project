import axiosInstance from "./axios";

export const analyticsService = {
    async getPlacementRate() {
        const response = await axiosInstance.get("/admin/analytics/placement-rate");
        return response.data;
    },

    async getApplicationsPerCompany() {
        const response = await axiosInstance.get("/admin/analytics/applications-per-company");
        return response.data;
    },
};

export default analyticsService;
