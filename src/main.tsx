import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";

// Disable React DevTools in production
if (import.meta.env.PROD) {
  const noop = () => undefined;
  const DEV_TOOLS = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (typeof DEV_TOOLS === "object") {
    for (const key in DEV_TOOLS) {
      if (typeof DEV_TOOLS[key] === "function") {
        DEV_TOOLS[key] = noop;
      }
    }
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    'Failed to find root element. Make sure there is a <div id="root"></div> in your HTML.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
