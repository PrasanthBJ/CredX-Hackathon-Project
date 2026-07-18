import axiosInstance from "./axios";

export const adminService = {
    async getPendingJobPostings() {
        const response = await axiosInstance.get("/admin/postings/pending");
        return response.data;
    },

    async getAllJobPostings() {
        const response = await axiosInstance.get("/admin/postings");
        return response.data;
    },

    async approveJobPosting(postingId) {
        const response = await axiosInstance.post(`/admin/postings/${postingId}/approve`);
        return response.data;
    },

    async rejectJobPosting(postingId) {
        const response = await axiosInstance.post(`/admin/postings/${postingId}/reject`);
        return response.data;
    },
};

export default adminService;
