import axiosClient from "./axiosClient";

// TEMPORARY MOCK MODE — remove once backend is available
const MOCK_MODE = true;

const mockCompanyStats = [
    { companyName: "Acme Corp", applicationCount: 18 },
    { companyName: "Globex Inc", applicationCount: 12 },
    { companyName: "Initech", applicationCount: 7 },
    { companyName: "Umbrella Ltd", applicationCount: 3 },
];

const mockPlacementRate = {
    rate: 42.5,
    selectedCount: 17,
};

const mockPendingPostings = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        companyName: "Acme Corp",
        description: "Work on our React-based dashboard product.",
        eligibility: "CGPA > 7, CSE/IT only",
        deadline: "2026-08-01",
    },
];

const mockAllPostings = [
    { id: 1, title: "Frontend Developer Intern", companyName: "Acme Corp", status: "PENDING", deadline: "2026-08-01" },
    { id: 2, title: "Backend Engineer", companyName: "Globex Inc", status: "APPROVED", deadline: "2026-08-15" },
    { id: 3, title: "Data Analyst", companyName: "Initech", status: "REJECTED", deadline: "2026-07-30" },
];

export const getPendingPostings = () =>
    MOCK_MODE
        ? Promise.resolve({ data: mockPendingPostings })
        : axiosClient.get("/admin/postings/pending");

export const getAllPostings = () =>
    MOCK_MODE
        ? Promise.resolve({ data: mockAllPostings })
        : axiosClient.get("/admin/postings");

export const approvePosting = (postingId) =>
    MOCK_MODE
        ? Promise.resolve({ data: { success: true } })
        : axiosClient.post(`/admin/postings/${postingId}/approve`);

export const rejectPosting = (postingId) =>
    MOCK_MODE
        ? Promise.resolve({ data: { success: true } })
        : axiosClient.post(`/admin/postings/${postingId}/reject`);

export const getApplicationsPerCompany = () =>
    MOCK_MODE
        ? Promise.resolve({ data: mockCompanyStats })
        : axiosClient.get("/admin/analytics/applications-per-company");

export const getPlacementRate = () =>
    MOCK_MODE
        ? Promise.resolve({ data: mockPlacementRate })
        : axiosClient.get("/admin/analytics/placement-rate");