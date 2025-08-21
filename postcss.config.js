import autoprefixer from "autoprefixer";

// пробуем Tailwind v4, иначе fallback на v3
let tailwindcss;
try {
  const plugin = (await import("@tailwindcss/postcss")).default;
  tailwindcss = plugin({ config: "./tailwind.config.ts" });
} catch {
  tailwindcss = (await import("tailwindcss")).default;
}

export default {
  plugins: [tailwindcss, autoprefixer],
};
