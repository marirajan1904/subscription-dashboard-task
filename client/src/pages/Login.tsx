import { useState } from "react";
import { login } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!form.email || !form.password) {
      setToast({ type: "error", message: "Please fill in all fields." });
      return;
    }

    if (!validateEmail(form.email)) {
      setToast({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      await login(dispatch, form);
      setLoading(false);
      setToast({ type: "success", message: "Login Successful!" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setLoading(false);
      setToast({ type: "error", message: err?.response?.data?.message ?? "Login failed" });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome</h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />
          <input
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`relative flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold p-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          New here?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}
