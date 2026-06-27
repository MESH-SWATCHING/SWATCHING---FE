import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-zinc-500">
        Checking login...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f6f1] px-8 text-center">
        <div>
          <p className="text-lg font-bold text-zinc-900">Login required</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Please sign in with Google before opening this page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/", { replace: true, state: { from: location.pathname } })}
          className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
        >
          Go to login
        </button>
      </div>
    );
  }

  return <Outlet />;
}
