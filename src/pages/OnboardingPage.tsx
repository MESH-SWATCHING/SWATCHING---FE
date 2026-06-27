import { useNavigate } from "react-router-dom";
import mascotLogo from "../assets/swatching-mascot.png";

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#f7f6f1]">
      {/* Background Doodles */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none opacity-30">
        {/* Top Left */}
        <span className="absolute left-6 top-12 text-xs text-gray-500">xxx</span>
        <span className="absolute left-12 top-16 rotate-12 text-sm text-gray-500">xxxxx</span>
        <span className="absolute left-8 top-24 text-xs text-gray-500">x</span>
        <span className="absolute left-10 top-[30%] text-lg text-gray-500">*</span>
        <span className="absolute left-16 top-[40%] text-lg text-gray-400">@</span>
        <span className="absolute left-12 top-[50%] text-2xl text-gray-500 opacity-60">👁</span>
        <span className="absolute left-5 top-[60%] text-xs text-gray-400">– – –</span>
        <span className="absolute left-14 top-[70%] text-base text-gray-500">+</span>
        {/* Top Right */}
        <span className="absolute right-10 top-10 text-xl text-gray-500">*</span>
        <span className="absolute right-20 top-16 text-2xl text-gray-500 opacity-70">👁</span>
        <span className="absolute right-12 top-32 text-lg text-gray-500">+</span>
        <span className="absolute right-16 top-[35%] -rotate-12 text-sm text-gray-500">x x x</span>
        <span className="absolute right-10 top-[45%] text-xl text-gray-500">❀</span>
        <span className="absolute right-8 top-[58%] text-sm text-gray-400">o</span>
        {/* Bottom */}
        <span className="absolute bottom-[35%] left-8 text-xl text-gray-500">*</span>
        <span className="absolute bottom-[32%] left-1/2 text-sm text-gray-500">+</span>
        <span className="absolute bottom-[35%] right-16 text-xl text-gray-500">*</span>
        <span className="absolute bottom-[28%] right-12 text-2xl text-gray-500 opacity-60">👗</span>
        <span className="absolute bottom-16 right-8 text-3xl text-gray-500">*</span>
        <span className="absolute bottom-12 left-12 rotate-45 text-sm text-gray-500">– – –</span>
        <span className="absolute bottom-8 left-1/4 text-xs text-gray-500">.</span>
        <span className="absolute bottom-20 right-1/3 text-xs text-gray-500">.</span>
        <span className="absolute bottom-[38%] left-1/3 -rotate-12 text-xs text-gray-500">– – – –</span>
      </div>

      {/* Main Content */}
      <main className="z-10 flex flex-1 w-full flex-col items-center justify-center px-6">
        <img
          src={mascotLogo}
          alt="Swatching"
          className="w-56"
        />
      </main>

      {/* Footer */}
      <footer className="z-10 w-full px-6 pb-20">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-[15px] font-medium text-[#3c4043] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google로 시작하기
        </button>
      </footer>
    </div>
  );
}
