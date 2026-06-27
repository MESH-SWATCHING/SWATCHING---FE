import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { AuthProvider } from "./context/AuthContext";
import { SwatchProvider } from "./context/SwatchContext";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import BrandNotePage from "./pages/BrandNotePage";
import MySwatchPage from "./pages/MySwatchPage";
import BrandRegisterPage from "./pages/BrandRegisterPage";
import AdminPage from "./pages/AdminPage";
import BoardDeckPage from "./pages/BoardDeckPage";
import DeckPage from "./pages/DeckPage";

export default function App() {
  return (
    <AuthProvider>
      <SwatchProvider>
        <BrowserRouter>
          {/* 데스크톱에서 모바일 앱처럼 보이도록 폰 쉘 래퍼 */}
          <div className="flex min-h-screen justify-center bg-zinc-200">
            <div className="relative w-full max-w-[430px] overflow-x-hidden shadow-2xl">
              <Routes>
                <Route path="/" element={<OnboardingPage />} />
                <Route element={<Layout />}>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/board" element={<BoardDeckPage />} />
                  <Route path="/swatch" element={<MySwatchPage />} />
                </Route>
                <Route path="/brand/:id" element={<BrandNotePage />} />
                <Route path="/boardDeck" element={<DeckPage />} />
                <Route path="/brand-register" element={<BrandRegisterPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </SwatchProvider>
    </AuthProvider>
  );
}
