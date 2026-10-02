// import type { premierepro as premiereproTypes } from "./types/ppro";
import type { premierepro as premiereproTypes } from "@adobe/premierepro";

const isBrowser =
  typeof window !== "undefined" && typeof (window as any).uxp === "undefined";

if (typeof require === "undefined") {
  //@ts-ignore
  window.require = (moduleName: string) => {
    // Browser HMR preview — stub Adobe host modules
    if (moduleName === "uxp") {
      return {
        host: { name: "browser", version: "0" },
        versions: { uxp: "browser" },
        shell: { openExternal: (url: string) => window.open(url, "_blank") },
        entrypoints: { _pluginInfo: { id: "com.bolt.uxp", version: "0.0.1" } },
        pluginManager: { plugins: [] },
      };
    }
    return {};
  };
}

export const uxp = require("uxp") as typeof import("uxp");
export const os = require("os") as typeof import("os");

// When require("uxp") returns {} in some hosts, keep a safe host name for UI.
if (!uxp?.host?.name && isBrowser) {
  (uxp as any).host = { name: "browser", version: "0" };
}

const hostName = (uxp && uxp?.host?.name?.toLowerCase()) || "browser";

export const hybridPlugin = async () =>
  (await require("bolt-uxp-hybrid.uxpaddon")) as {
    execSync: (cmd: string) => string;
    exec: (cmd: string) => Promise<string>;
  };

export const photoshop = (
  hostName === "photoshop" ? require("photoshop") : {}
) as typeof import("photoshop");

export const indesign = (
  hostName === "indesign" ? require("indesign") : {}
) as any;

export const premierepro = (
  hostName === "premierepro" ? require("premierepro") : {}
) as premiereproTypes;

// Beta APIs

export const illustrator = (
  hostName === "illustrator" ? require("illustrator") : {}
) as any;

export const aftereffects = (
  hostName === "aftereffects" ? require("aftereffects") : {}
) as any;

export const mediaencoder = (
  hostName === "mediaencoder" ? require("mediaencoder") : {}
) as any;
