import { useState } from "react";
import { login } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(dispatch, form);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-600 text-white p-2 rounded" type="submit">Login</button>
      </form>
      <p className="mt-3 text-sm">New here? <Link to="/register" className="text-blue-600">Create account</Link></p>
    </div>
  );
}