import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), dts({ rollupTypes: true }), nodePolyfills({ include: ["buffer"] })],
  build: {
    target: "esnext",
    lib: {
      formats: ["es"],
      entry: {
        index: resolve(__dirname, "src/exports/index.ts"),
        actions: resolve(__dirname, "src/exports/actions.ts"),
        components: resolve(__dirname, "src/exports/components.ts"),
        hooks: resolve(__dirname, "src/exports/hooks.ts"),
      },
      // fileName: "auth-kit",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom", "@farcaster/auth-client", "@tanstack/react-query"],
    },
  },
});
