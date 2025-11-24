import axios from "axios";
import { store } from "../app/store";
import { setAccessToken, logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "https://subscription-dashboard-task-1-fo2a.onrender.com/api",
  withCredentials: true, // send cookies
});

// Add Authorization header
api.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function onRefreshed(token: string | null) {
  pendingRequests.forEach(cb => cb(token));
  pendingRequests = [];
}

api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise(resolve => {
          pendingRequests.push(token => {
            if (token) originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const resp = await api.post("/auth/refresh-token");
        const newToken = resp.data.accessToken;
        store.dispatch(setAccessToken(newToken));
        isRefreshing = false;
        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer newToken`;
        return api(originalRequest);
      } catch {
        isRefreshing = false;
        onRefreshed(null);
        store.dispatch(logout());
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
