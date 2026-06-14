import type { ConfigEnv, UserConfig } from "vite";
import path from "node:path";
import process from "node:process";
import { pluginAssetpack as assetpack } from "#/vite/plugin/assetpack-vite-plugin";
import { fullReloadWhen } from "#/vite/plugin/full-reload-by-ext.ts";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import glsl from "vite-plugin-glsl";

export default defineConfig(async (_configEnv: ConfigEnv) => {
  return {
    clearScreen: true,
    server: {
      port: 3212,
      open: false,
      sourcemapIgnoreList(_sourcePath: string, _sourcemapPath: string): boolean {
        return false;
      },
    },
    resolve: {
      alias: {
        "∆": path.resolve(__dirname, "./src/engine"),
        "@": path.resolve(__dirname, "./src/app"),
        "#": path.resolve(__dirname, "./scripts"),
      },
    },
    plugins: [
      devtoolsJson(),
      glsl(),
      fullReloadWhen(["ts", "tsx", "frag", "vert"]).change(),
      assetpack(),
    ],
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
  };
});
