import api from "../../utils/axios";
import { loginSuccess, logout } from "./authSlice";

export async function register(payload: { name: string; email: string; password: string }) {
  await api.post("/auth/register", payload);
}

export async function login(dispatch: any, payload: { email: string; password: string }) {
  const { data } = await api.post("/auth/login", payload);
  dispatch(loginSuccess({ accessToken: data.accessToken, user: data.user }));
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function performLogout(dispatch: any) {
  await api.post("/auth/logout");
  dispatch(logout());
}