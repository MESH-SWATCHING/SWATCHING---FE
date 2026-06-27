import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./layouts/Layout";
import { AuthProvider } from "./context/AuthContext";
import { SwatchProvider } from "./context/SwatchContext";
import MySwatchPage from "./pages/MySwatchPage";
import BrandRegisterPage from "./pages/BrandRegisterPage";
import AdminPage from "./pages/AdminPage";
import BoardDeckPage from "./pages/BoardDeckPage";
import DeckPage from "./pages/DeckPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-page-in">
      <Routes location={location}>
        {/* BottomNav 있는 화면 */}
        <Route element={<Layout />}></Route>

        {/* BottomNav 없는 화면 */}
        <Route path="/boardDeck" element={<BoardDeckPage />} />
        <Route path="/deck" element={<DeckPage />} />
        <Route path="/swatch" element={<MySwatchPage />} />
        <Route path="/brand/:id" element={"/"} />
        <Route path="/brand-register" element={<BrandRegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SwatchProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </SwatchProvider>
    </AuthProvider>
  );
}
