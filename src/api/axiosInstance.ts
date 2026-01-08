import axios from "axios";


const api = axios.create({
    baseURL: process.env.Next_Public_,
    timeout: 10000,
    headers: {
        "content-type": "application/json",
    },
});

api.interceptors.request.use(   
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            console.log("Unauthorized! Redirecting to login...");
        }
        return Promise.reject(error);
    }
);

// axiosInstance.ts
import { getToken } from "@/utils/authToken";

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;

