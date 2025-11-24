import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { performLogout } from "../features/auth/authApi";

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await performLogout(dispatch); // <-- NO dispatch()
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md flex justify-between items-center">
      {/* LEFT MENU */}
      <div className="flex gap-6 items-center">
        <Link
          to="/plans"
          className="hover:text-yellow-300 transition-colors font-medium"
        >
          Plans
        </Link>
        <Link
          to="/dashboard"
          className="hover:text-yellow-300 transition-colors font-medium"
        >
          Dashboard
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/admin/subscriptions"
            className="hover:text-yellow-300 transition-colors font-medium"
          >
            Admin
          </Link>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="bg-white text-blue-700 px-3 py-1 rounded-full font-semibold shadow">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg font-semibold shadow transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-white text-blue-700 px-4 py-1 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
