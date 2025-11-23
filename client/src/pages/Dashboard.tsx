import { useEffect, useState } from "react";
import { fetchMySubscription } from "../features/subscription/subscriptionApi";

export default function Dashboard() {
  const [sub, setSub] = useState<any | null>(null);
  const [status, setStatus] = useState<string>("none");

  useEffect(() => {
    fetchMySubscription().then((data) => {
      setSub(data.subscription);
      setStatus(data.status);
    }).catch(() => setStatus("none"));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">My Subscription</h1>
      <p className="mb-3">Status: <span className="font-medium">{status}</span></p>
      {sub ? (
        <div className="border p-4 rounded">
          <p><span className="font-semibold">Plan:</span> {sub.plan.name}</p>
          <p><span className="font-semibold">Period:</span> {new Date(sub.start_date).toLocaleDateString()} - {new Date(sub.end_date).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>No active subscription.</p>
      )}
    </div>
  );
}