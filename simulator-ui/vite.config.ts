import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Simulator_UI/",

    server: {
      https: {
        key:  "./localhost-key.pem",
        cert: "./localhost-cert.pem",
      },
      port: 5173,
    },
});
