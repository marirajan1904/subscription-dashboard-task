import { useEffect, useState } from "react";
import { fetchAllSubscriptions } from "../features/subscription/subscriptionApi";

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllSubscriptions().then(setSubs).catch(() => setError("Failed to load subscriptions"));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">All Subscriptions</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">User</th>
              <th className="p-2 border">Plan</th>
              <th className="p-2 border">Start</th>
              <th className="p-2 border">End</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id}>
                <td className="p-2 border">{s.user.name} ({s.user.email})</td>
                <td className="p-2 border">{s.plan.name}</td>
                <td className="p-2 border">{new Date(s.start_date).toLocaleDateString()}</td>
                <td className="p-2 border">{new Date(s.end_date).toLocaleDateString()}</td>
                <td className="p-2 border">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}