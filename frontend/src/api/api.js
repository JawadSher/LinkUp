import axios from "axios";
import { logout } from "../features/auth/authSlice";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if(error.response?.status === 401 && originalRequest.url.includes("/refresh-access-token")){
            console.error("Refresh token expired! Logging out user...");
            const store = (await import("../store/store.js")).default;
            store.dispatch(logout());

            return Promise.reject(error);
        }

        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try{
                console.log("Access token expired! Refreshing...");

                await API.get("/user/auth/refresh-access-token");
                return API(originalRequest);
            } catch(refreshError){
                const store = (await import("../store/store.js")).default;
                store.dispatch(logout());

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;