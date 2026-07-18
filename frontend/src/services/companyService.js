import axiosInstance from "./axios";

export const companyService = {
    async getProfile() {
        const response = await axiosInstance.get("/company/profile");
        return response.data;
    },

    async createOrUpdateProfile(profileData) {
        const response = await axiosInstance.post("/company/profile", profileData);
        return response.data;
    },

    async createJobPosting(jobData) {
        const response = await axiosInstance.post("/company/postings", jobData);
        return response.data;
    },

    async getOwnJobPostings() {
        const response = await axiosInstance.get("/company/postings");
        return response.data;
    },
};

export default companyService;
