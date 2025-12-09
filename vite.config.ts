import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  esbuild: {
    // Remove console.log, console.warn, console.info in production
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  build: {
    // Minify and optimize for production
    minify: "esbuild",
    sourcemap: false,
  },
}));
