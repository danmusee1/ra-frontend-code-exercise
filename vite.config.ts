import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    svgr(), 
    react(), 
    tailwindcss()
  ],
  resolve: { alias: { "@": "/src" } },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup",
  },
});
