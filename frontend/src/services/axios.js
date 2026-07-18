import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

const pendingRequests = new Map();

function getRequestKey(config) {
    return [
        config.method,
        config.url,
        JSON.stringify(config.params),
        JSON.stringify(config.data),
    ].join("&");
}

axiosInstance.interceptors.request.use(
    (config) => {
        // Prevent duplicate requests: cancel previous identical request
        const key = getRequestKey(config);
        if (pendingRequests.has(key)) {
            const controller = pendingRequests.get(key);
            controller.abort("Duplicate request cancelled");
            pendingRequests.delete(key);
        }

        const controller = new AbortController();
        config.signal = controller.signal;
        pendingRequests.set(key, controller);

        // Set auth header
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => {
        const key = getRequestKey(response.config);
        pendingRequests.delete(key);
        return response;
    },
    (error) => {
        if (error.config) {
            const key = getRequestKey(error.config);
            pendingRequests.delete(key);
        }

        // Check if the error is due to request cancellation
        if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
            return Promise.reject(error);
        }

        let message = "An unexpected error occurred.";
        const status = error.response?.status;

        if (status) {
            switch (status) {
                case 400:
                    message = error.response.data?.message || "Bad Request. Please check your inputs.";
                    break;
                case 401:
                    message = error.response.data?.message || "Session expired. Please log in again.";
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    if (!window.location.pathname.includes("/login")) {
                        window.location.href = "/login";
                    }
                    break;
                case 403:
                    message = "Access denied. You do not have permission.";
                    break;
                case 404:
                    message = error.response.data?.message || "Requested resource not found.";
                    break;
                case 409:
                    message = error.response.data?.message || "Conflict occurred. Data might already exist.";
                    break;
                case 500:
                    message = "Server error. Please try again later.";
                    break;
                default:
                    message = error.response.data?.message || message;
            }
        } else if (error.code === "ECONNABORTED") {
            message = "Request timed out. Please try again.";
        } else if (error.message === "Network Error") {
            message = "Unable to connect to the server. Please check if the backend is running.";
        }

        // Trigger a global custom event for toasts/snackbars to listen to
        window.dispatchEvent(new CustomEvent("api-toast-message", {
            detail: { type: "error", message }
        }));

        return Promise.reject(error);
    }
);

export default axiosInstance;
