import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("main.tsx loaded");

const root = document.getElementById("root");
console.log("root element:", root);

if (!root) {
  document.body.innerHTML = "<h1 style='color: red; font-size: 24px;'>Root element not found</h1>";
  console.error("Root element not found");
} else {
  try {
    createRoot(root).render(<App />);
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Error rendering app:", error);
    root.innerHTML = `<h1 style='color: red; font-size: 24px;'>Error: ${String(error)}</h1>`;
  }
}

// Add error boundary
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  document.body.innerHTML += `<div style='color: red; white-space: pre-wrap;'>Global Error: ${event.error?.stack}</div>`;
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled rejection:", event.reason);
  document.body.innerHTML += `<div style='color: orange; white-space: pre-wrap;'>Unhandled Rejection: ${String(event.reason)}</div>`;
});
