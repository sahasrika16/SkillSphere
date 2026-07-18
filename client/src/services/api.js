import axios from "axios";

const api = axios.create({
  baseURL: "https://skillsphere-backend-72pj.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("skillsphere_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("skillsphere_token");
      localStorage.removeItem("skillsphere_user");
    }

    return Promise.reject(error);
  }
);

export default api;