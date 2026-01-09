import axios from "axios";
import { getToken } from "@/utils/authToken";
import { BASE_URL } from "./apiPaths";


const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
api.interceptors.response.use(
    (response) => response.data,        //Aafaii response ko matraii data return garxa
    (error) => {
        if (error.response?.status === 401) {
            console.log("Unauthorized! Redirecting to login...");
        }
        return Promise.reject(error);
    }
);


api.interceptors.request.use(
    (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;
