import axiosInstance from "./axios";

export const authService = {
    async login(email, password) {
        const response = await axiosInstance.post("/auth/login", { email, password });
        return response.data;
    },

    async register(name, email, password, role) {
        const response = await axiosInstance.post("/auth/register", {
            name,
            email,
            password,
            role,
        });
        return response.data;
    },

    async verifyEmail(token) {
        const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        return response.data;
    },
};

export default authService;
