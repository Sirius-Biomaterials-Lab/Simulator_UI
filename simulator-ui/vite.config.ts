import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // всё, что начинается с /modules → http://213.189.216.8:8000
      "/modules": {
        target: "http://213.189.216.8:8000",
        changeOrigin: true,   // подменяет host-заголовок → нужен большинству API
        secure: false,        // если backend на http или на https c self-signed
        // rewrite не нужен, потому что префикс совпадает
      },
    },
  },
});
