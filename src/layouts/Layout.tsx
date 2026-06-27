import { Outlet, useNavigate, useLocation } from "react-router-dom";

// 💡 id를 "swatch"로 통일합니다.
function getActiveTab(pathname: string): string {
  if (pathname.startsWith("/board")) return "board";
  if (pathname.startsWith("/swatch")) return "swatch";
  return "home";
}

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="relative min-h-screen bg-[#f7f5f2] max-w-md mx-auto shadow-sm">
      <main className="pb-28">
        <Outlet />
      </main>
      {/*
      <BottomNav
        activeTab={getActiveTab(pathname)}
        onTabChange={(path) => navigate(path)}
      />
      */}
    </div>
  );
}
