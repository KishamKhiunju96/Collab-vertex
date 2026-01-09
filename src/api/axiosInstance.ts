import axios from "axios";
import { getToken } from "@/utils/authToken";
import { BASE_URL } from "./apiPaths";


const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "content-type": "application/json",
    },
});

// api.interceptors.request.use(   // Harek API request aagadi  run huncha
//     (config) => {
//         const token = localStorage.getItem("token");        //AuthToken,login haru garnalaii use hunxa
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;       //localstorage bata token liyera  header ma Authorization ma set garxa
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

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
