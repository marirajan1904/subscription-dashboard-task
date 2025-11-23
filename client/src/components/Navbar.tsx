import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { performLogout } from "../features/auth/authApi";

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Use proper typed dispatch
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
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      {/* LEFT MENU */}
      <div className="flex gap-4">
        <Link to="/plans" className="hover:underline">Plans</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>

        {user?.role === "admin" && (
          <Link to="/admin/subscriptions" className="hover:underline">
            Admin
          </Link>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex gap-3 items-center">
        <span>{user ? user.name : "Guest"}</span>

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-blue-600 px-3 py-1 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
