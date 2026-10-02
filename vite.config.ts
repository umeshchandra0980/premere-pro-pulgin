import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { runAction, uxp } from "vite-uxp-plugin";
import react from "@vitejs/plugin-react";

import { config } from "./uxp.config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Downloads is redirected (C:\Users\...\Downloads → D:\CDrive_Moved\...).
// Align Vite root with the real path so index.html is not emitted as absolute.
const projectRoot = fs.realpathSync.native(__dirname);

const action = process.env.BOLT_ACTION;
const mode = process.env.MODE;
process.env.VITE_BOLT_MODE = mode;

if (action) runAction(config, action);

const shouldNotEmptyDir =
  mode === "dev" && config.manifest.requiredPermissions?.enableAddon;

export default defineConfig({
  root: projectRoot,
  plugins: [
    // Skip UXP packaging plugin during plain browser HMR (`npm run browser`)
    ...(mode ? [uxp(config, mode)] : []),
    react(),
  ],
  resolve: {
    // Keep cwd/junction path consistent with Windows folder redirection
    preserveSymlinks: true,
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    sourcemap: mode && ["dev", "build"].includes(mode) ? "inline" : false,
    minify: false,
    emptyOutDir: !shouldNotEmptyDir,
    rollupOptions: {
      input: path.join(projectRoot, "index.html"),
      external: [
        "premierepro",
        "bolt-uxp-hybrid.uxpaddon",
        "uxp",
        "fs",
        "os",
        "path",
        "process",
        "shell",
      ],
      output: {
        // format: "cjs",
        format: "iife", // Needed for Webview UI in Vue to prevent global overrides
      },
    },
  },
  publicDir: "public",
});
