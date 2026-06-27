import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { SwatchProvider } from "./context/SwatchContext";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import BrandNotePage from "./pages/BrandNotePage";
import MySwatchPage from "./pages/MySwatchPage";
import BrandRegisterPage from "./pages/BrandRegisterPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <SwatchProvider>
      <BrowserRouter>
        {/* 데스크톱에서 모바일 앱처럼 보이도록 폰 쉘 래퍼 */}
        <div className="flex min-h-screen justify-center bg-zinc-200">
          <div className="relative w-full max-w-[430px] overflow-x-hidden shadow-2xl">
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route
              path="/board"
              element={
                <div className="min-h-screen bg-[#faf9f5] px-5 pt-10 text-center">
                  <h1 className="font-display text-2xl font-bold">
                    Swatch Deck
                  </h1>
                  <p className="mt-3 text-sm text-[#78767b]">
                    Board 화면을 준비하고 있습니다.
                  </p>
                </div>
              }
            />
            <Route path="/swatch" element={<MySwatchPage />} />
          </Route>
          <Route path="/brand/:id" element={<BrandNotePage />} />
          <Route path="/brand-register" element={<BrandRegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
          </div>
        </div>
      </BrowserRouter>
    </SwatchProvider>
  );
}
