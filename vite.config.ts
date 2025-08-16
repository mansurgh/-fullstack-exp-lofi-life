import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  let tagger;
  if (mode === "development") {
    try {
      const mod = await import("lovable-tagger");
      tagger = mod.componentTagger();
    } catch {
      console.warn("lovable-tagger not found, skipping component tagging.");
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), tagger].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
