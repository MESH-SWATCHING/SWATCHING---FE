import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
    }

    api.get("/api/v1/me")
      .then((res) => {
        const role = res.data.data?.role;
        if (role === "ADMIN") {
          window.location.replace("/admin");
        } else {
          window.location.replace("/home");
        }
      })
      .catch(() => {
        window.location.replace("/home");
      });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f6f1]">
      <p className="text-sm text-gray-400">로그인 중...</p>
    </div>
  );
}
