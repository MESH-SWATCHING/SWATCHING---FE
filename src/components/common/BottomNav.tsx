import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Bookmark } from "lucide-react";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/boardDeck", icon: LayoutGrid, label: "Board" },
  { path: "/swatch", icon: Bookmark, label: "Swatch" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getActive = () => {
    if (pathname.startsWith("/boardDeck") || pathname.startsWith("/deck")) return "/boardDeck";
    if (pathname.startsWith("/swatch")) return "/swatch";
    return "/";
  };

  const activeTab = getActive();

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1a1a1a] rounded-full flex items-center p-1.5 shadow-xl z-40">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex items-center justify-center gap-2 rounded-full transition-all duration-300 ease-out
              ${isActive
                ? "bg-white text-[#1a1a1a] px-5 py-2.5 shadow-sm"
                : "text-[#666] px-3 py-2.5 hover:text-[#999]"
              }`}
          >
            <Icon size={isActive ? 18 : 16} strokeWidth={isActive ? 2.2 : 1.5} />
            {isActive && (
              <span className="text-xs font-bold animate-fade-in">{tab.label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
