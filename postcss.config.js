import autoprefixer from "autoprefixer";

let tailwindcss: any;

try {
  // Tailwind v4: основной плагин теперь в @tailwindcss/postcss
  const plugin = (await import("@tailwindcss/postcss")).default;
  // Явно указываем путь до TypeScript-конфига, чтобы распознавались токены темы
  tailwindcss = plugin({ config: "./tailwind.config.ts" });
} catch {
  // Fallback для окружений с Tailwind v3
  tailwindcss = (await import("tailwindcss")).default;
}

export default {
  plugins: [tailwindcss, autoprefixer],
};
