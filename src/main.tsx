import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-center"
      offset={96}
      toastOptions={{
        unstyled: true,
        duration: 1000,
        classNames: {
          toast:
            "bg-[#1a1a1a] text-white text-sm font-medium px-5 py-3.5 rounded-full shadow-lg",
        },
      }}
    />
  </StrictMode>,
);
