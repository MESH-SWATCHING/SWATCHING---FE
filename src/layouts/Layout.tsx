import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Bookmark, Grid2X2, Home } from "lucide-react";

function getActiveTab(pathname: string): string {
  if (pathname.startsWith("/board")) return "board";
  if (pathname.startsWith("/swatch")) return "swatch";
  if (pathname.startsWith("/home")) return "home";
  return "";
}

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="relative min-h-screen bg-white">
      <main>
        <Outlet />
      </main>
      <nav
        aria-label="주요 메뉴"
        className="fixed bottom-6 left-1/2 z-50 flex w-fit -translate-x-1/2 items-center gap-1 rounded-full bg-black px-1.5 py-1.5 shadow-lg"
      >
        {[
          { id: "home", label: "Home", path: "/home", icon: Home },
          { id: "board", label: "Board", path: "/board", icon: Grid2X2 },
          {
            id: "swatch",
            label: "My Swatch",
            path: "/swatch",
            icon: Bookmark,
          },
        ].map((tab) => {
          const active = getActiveTab(pathname) === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              onClick={() => navigate(tab.path)}
              className={`flex items-center justify-center rounded-full py-2.5 transition-all ${
                active
                  ? "gap-2 bg-white px-5 text-black"
                  : "px-4 text-white/40 hover:text-white"
              }`}
            >
              <Icon size={20} fill={active ? "currentColor" : "none"} />
              {active && (
                <span className="whitespace-nowrap text-sm font-bold">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
