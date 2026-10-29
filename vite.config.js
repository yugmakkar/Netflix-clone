import { defineConfig } from "vite";
import { resolve } from "path";

// Multi-page app: every HTML entry point must be listed here, otherwise
// `vite build` only emits index.html and drops the rest from dist/.
export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        hindi: resolve(__dirname, "hindi.html"),
        forms: resolve(__dirname, "forms.html"),
        formsHindi: resolve(__dirname, "formsHindi.html"),
        startup: resolve(__dirname, "startup.html"),
        profiles: resolve(__dirname, "profiles.html"),
        browse: resolve(__dirname, "browse.html"),
        watch: resolve(__dirname, "watch.html"),
      },
    },
  },
});
