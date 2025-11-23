import { useEffect, useState } from "react";
import { fetchPlans, subscribeToPlan } from "../features/subscription/subscriptionApi";

export default function Plans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans().then(setPlans).catch(() => setMsg("Failed to load plans"));
  }, []);

  async function handleSubscribe(id: string) {
    setMsg(null);
    try {
      await subscribeToPlan(id);
      setMsg("Subscribed successfully!");
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Subscription failed");
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Available Plans</h1>
      {msg && <p className="mb-3 text-blue-700">{msg}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="border rounded p-4">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-700">₹{p.price}</p>
            <p className="text-gray-600">Duration: {p.duration} days</p>
            <ul className="list-disc ml-5 mt-2 text-sm">
              {p.features.map((f: string, idx: number) => <li key={idx}>{f}</li>)}
            </ul>
            <button className="mt-3 bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleSubscribe(p.id)}>
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}