import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "NammaBus",
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/NammaBus.js",
        chunkFileNames: "assets/NammaBus-[name].js",
        assetFileNames: "assets/NammaBus-[name][extname]",
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

