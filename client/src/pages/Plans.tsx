import { useEffect, useState } from "react";
import { fetchPlans, subscribeToPlan } from "../features/subscription/subscriptionApi";
import Toast from "../components/Toast";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";

export default function Plans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingFetch(true);
    fetchPlans()
      .then((data) => setPlans(data))
      .catch(() => setToast({ type: "error", message: "Failed to load plans" }))
      .finally(() => setLoadingFetch(false));
  }, []);

  async function handleSubscribe(id: string) {
    if (!user) {
      setToast({ type: "error", message: "Please login first to subscribe!" });
      return navigate("/login");
    }

    setLoadingId(id);
    try {
      await subscribeToPlan(id);
      setLoadingId(null);
      setToast({ type: "success", message: "Subscribed successfully!" });
    } catch (e: any) {
      setLoadingId(null);
      setToast({ type: "error", message: e?.response?.data?.message ?? "Subscription failed" });
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Plans</h1>

      {loadingFetch ? (
        <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition duration-300 border-t-8 border-blue-500"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{p.name}</h2>
                <p className="text-gray-600 text-lg mb-4">₹{p.price} / {p.duration} days</p>

                <ul className="space-y-1 mb-4">
                  {p.features.map((f: string, idx: number) => (
                    <li key={idx} className="flex items-center">
                      <span className="mr-2 text-green-500">✔</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(p.id)}
                  disabled={loadingId === p.id}
                  className={`w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {loadingId === p.id && (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                  )}
                  {loadingId === p.id ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Popup */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}
