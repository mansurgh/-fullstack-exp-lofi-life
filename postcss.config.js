import autoprefixer from "autoprefixer";

let tailwindcss;
try {
  // Tailwind v4 exposes its PostCSS plugin at @tailwindcss/postcss
  const plugin = (await import("@tailwindcss/postcss")).default;
  // Explicitly point the plugin at our TypeScript config so theme tokens
  // like `border-border` are recognized even when the new plugin is used.
  tailwindcss = plugin({ config: "./tailwind.config.ts" });
} catch {
  // Fall back to the legacy plugin for Tailwind v3 environments
  tailwindcss = (await import("tailwindcss")).default;
}

export default {
  plugins: [tailwindcss, autoprefixer],
};
