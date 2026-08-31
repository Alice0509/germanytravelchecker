import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TrainTroubleTool from "./components/TrainTroubleTool.jsx";
import "./train.css";

const root = document.getElementById("train-tool-root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <TrainTroubleTool />
    </StrictMode>,
  );
}
