import { useEffect, useState } from "react";
import { fetchMySubscription } from "../features/subscription/subscriptionApi";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [sub, setSub] = useState<any | null>(null);
  const [status, setStatus] = useState<string>("none");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // <-- useNavigate hook

  useEffect(() => {
    fetchMySubscription()
      .then((data) => {
        setSub(data.subscription);
        setStatus(data.status);
      })
      .catch(() => setStatus("none"));
  }, []);

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    none: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Subscription</h1>

      <div className="flex justify-center mb-6">
        <span className={`px-4 py-2 rounded-full font-medium ${statusColors[status] || statusColors.none}`}>
          {status.toUpperCase()}
        </span>
      </div>

      {sub ? (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition duration-300 text-center">
          <h2 className="text-xl font-semibold mb-3">{sub.plan.name}</h2>
          <p className="mb-2">
            <span className="font-medium">Start:</span> {new Date(sub.start_date).toLocaleDateString()}
          </p>
          <p className="mb-4">
            <span className="font-medium">End:</span> {new Date(sub.end_date).toLocaleDateString()}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 px-5 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            Manage Subscription
          </button>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-100 rounded-xl shadow-md">
          <p className="text-gray-700 text-lg mb-4">You don’t have an active subscription.</p>
          <button
            onClick={() => navigate("/plans")}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Subscribe Now
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && sub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4">{sub.plan.name} Details</h2>
            <p className="mb-2">
              <span className="font-medium">Status:</span> {status.toUpperCase()}
            </p>
            <p className="mb-2">
              <span className="font-medium">Start Date:</span> {new Date(sub.start_date).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <span className="font-medium">End Date:</span> {new Date(sub.end_date).toLocaleDateString()}
            </p>
            <p className="mb-4">
              <span className="font-medium">Features:</span>
            </p>
            <ul className="list-disc list-inside mb-4">
              {sub.plan.features.map((f: string, idx: number) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/plans")} // <-- Navigate to plans
              className="w-full px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Upgrade / Change Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
