import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = searchParams.get("token") ?? hashParams.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      window.location.replace("/home");
      return;
    }

    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f7f6f1] text-sm text-zinc-600">
      로그인 처리 중...
    </div>
  );
}
