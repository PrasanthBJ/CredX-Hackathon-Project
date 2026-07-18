import axiosInstance from "./axios";

export const studentService = {
    async getProfile() {
        const response = await axiosInstance.get("/student/profile");
        return response.data;
    },

    async createOrUpdateProfile(profileData) {
        const response = await axiosInstance.post("/student/profile", profileData);
        return response.data;
    },

    async getApprovedJobPostings() {
        const response = await axiosInstance.get("/student/postings");
        return response.data;
    },

    async applyToJobPosting(postingId) {
        // Express postingId as RequestParam
        const response = await axiosInstance.post(`/student/applications?postingId=${postingId}`);
        return response.data;
    },

    async getOwnApplications() {
        const response = await axiosInstance.get("/student/applications");
        return response.data;
    },
};

export default studentService;
