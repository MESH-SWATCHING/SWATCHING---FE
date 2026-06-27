import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { SwatchProvider } from "./context/SwatchContext";
import MySwatchPage from "./pages/MySwatchPage";
import BrandRegisterPage from "./pages/BrandRegisterPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <SwatchProvider>
      <BrowserRouter>
        <Routes>
          {/* BottomNav 있는 화면 */}
          <Route element={<Layout />}></Route>

          {/* BottomNav 없는 화면 */}
          <Route path="/swatch" element={<MySwatchPage />} />
          <Route path="/brand/:id" element={"/"} />
          <Route path="/brand-register" element={<BrandRegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </SwatchProvider>
  );
}
