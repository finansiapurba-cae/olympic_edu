import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build:single` membuat satu file HTML mandiri (dist-single/index.html).
export default defineConfig(({ mode }) => ({
  plugins: mode === "single" ? [react(), viteSingleFile()] : [react()],
  base: "./",
  build: mode === "single" ? { outDir: "dist-single" } : {},
}));
