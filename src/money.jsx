import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MoneyTroubleTool from "./components/MoneyTroubleTool.jsx";
import "./money.css";

const root = document.getElementById("money-tool-root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <MoneyTroubleTool />
    </StrictMode>,
  );
}
