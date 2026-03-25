import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@rush-ui/react": new URL("../../packages/react/src/index.ts", import.meta.url).pathname,
      "@rush-ui/tokens": new URL("../../packages/tokens/src/index.ts", import.meta.url).pathname
    }
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts"
  }
});
