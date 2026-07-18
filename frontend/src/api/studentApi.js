import axiosClient from "./axiosClient";

// TEMPORARY MOCK MODE — remove once backend is available
const MOCK_MODE = true;

const mockPostings = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        companyName: "Acme Corp",
        description: "Work on our React-based dashboard product.",
        eligibility: "CGPA > 7, CSE/IT only",
        deadline: "2026-08-01",
    },
    {
        id: 2,
        title: "Backend Engineer",
        companyName: "Globex Inc",
        description: "Build REST APIs using Spring Boot.",
        eligibility: "CGPA > 7.5",
        deadline: "2026-08-15",
    },
];

const mockApplications = [
    {
        id: 101,
        postingId: 1,
        postingTitle: "Frontend Developer Intern",
        companyName: "Acme Corp",
        status: "APPLIED",
        appliedAt: "2026-07-15",
    },
];

export const getStudentProfile = () => axiosClient.get("/student/profile");

export const upsertStudentProfile = (profileData) =>
    axiosClient.post("/student/profile", profileData);

export const getApprovedPostings = () =>
    MOCK_MODE
        ? Promise.resolve({ data: mockPostings })
        : axiosClient.get("/student/postings");

export const getPostingById = (id) => axiosClient.get(`/student/postings/${id}`);

export const applyToPosting = (postingId) =>
    MOCK_MODE
        ? Promise.resolve({ data: { success: true } })
        : axiosClient.post("/student/applications", { postingId });

export const getMyApplications = () =>
    MOCK_MODE
        ? Promise.resolve({ data: mockApplications })
        : axiosClient.get("/student/applications");