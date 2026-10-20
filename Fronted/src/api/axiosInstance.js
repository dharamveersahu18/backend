import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Request interceptor: attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop on refresh route or login route
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/login") &&
      !originalRequest.url.includes("/users/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${baseURL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data?.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        // User needs to login again
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
