import autoprefixer from "autoprefixer";

let tailwindcss;
try {
  tailwindcss = (await import("@tailwindcss/postcss")).default;
} catch {
  tailwindcss = (await import("tailwindcss")).default;
}

export default {
  plugins: [tailwindcss, autoprefixer],
};
