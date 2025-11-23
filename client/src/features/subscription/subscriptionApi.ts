import api from "../../utils/axios";

export async function fetchPlans() {
  const { data } = await api.get("/plans");
  return data;
}

export async function subscribeToPlan(planId: string) {
  const { data } = await api.post(`/subscribe/${planId}`);
  return data;
}

export async function fetchMySubscription() {
  const { data } = await api.get("/my-subscription");
  return data;
}

export async function fetchAllSubscriptions() {
  const { data } = await api.get("/admin/subscriptions");
  return data;
}