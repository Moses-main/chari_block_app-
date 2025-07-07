import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StarknetProvider from "./utils/starknetProvider.tsx";
import App from "./App.tsx";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StarknetProvider>
      <App />
    </StarknetProvider>
  </StrictMode>
);
