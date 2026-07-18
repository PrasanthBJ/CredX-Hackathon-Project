import axiosClient from "./axiosClient";

export const getPendingPostings = () => axiosClient.get("/admin/postings/pending");

export const getAllPostings = () => axiosClient.get("/admin/postings");

export const approvePosting = (postingId) =>
    axiosClient.post(`/admin/postings/${postingId}/approve`);

export const rejectPosting = (postingId) =>
    axiosClient.post(`/admin/postings/${postingId}/reject`);

export const getApplicationsPerCompany = () =>
    axiosClient.get("/admin/analytics/applications-per-company");

export const getPlacementRate = () =>
    axiosClient.get("/admin/analytics/placement-rate");