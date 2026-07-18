import axiosClient from "./axiosClient";

export const getCompanyProfile = () => axiosClient.get("/company/profile");

export const upsertCompanyProfile = (profileData) =>
    axiosClient.post("/company/profile", profileData);

export const createPosting = (postingData) =>
    axiosClient.post("/company/postings", postingData);

export const getMyPostings = () => axiosClient.get("/company/postings");

export const getApplicants = (postingId) =>
    axiosClient.get(`/company/postings/${postingId}/applicants`);

export const updateApplicationStatus = (applicationId, status) =>
    axiosClient.patch(`/company/applications/${applicationId}`, { status });