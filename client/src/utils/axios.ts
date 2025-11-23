import axios from "axios";
import { store } from "../app/store";
import { setAccessToken, logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // to send/receive refresh token cookies
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function onRefreshed(token: string | null) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const resp = await api.post("/auth/refresh-token");
        const newToken = resp.data.accessToken as string;
        store.dispatch(setAccessToken(newToken));
        isRefreshing = false;
        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (e) {
        isRefreshing = false;
        onRefreshed(null);
        store.dispatch(logout());
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;