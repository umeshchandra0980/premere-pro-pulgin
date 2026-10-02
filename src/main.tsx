import React from "react";

import { CaptionPanel } from "./components/CaptionPanel/CaptionPanel";
import { uxp, premierepro } from "./globals";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "uxp-panel": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { panelid?: string },
        HTMLElement
      >;
    }
  }
}

export const App = () => {
  const webviewUI = import.meta.env.VITE_BOLT_WEBVIEW_UI === "true";
  const hostName = (uxp?.host?.name as string | undefined)?.toLowerCase() ?? "browser";

  if (hostName === "premierepro") {
    console.log("AutoCaption panel — Premiere Pro host", premierepro);
  } else if (hostName === "browser") {
    console.log("AutoCaption panel — browser preview (fonts + movie + captions)");
  }

  return (
    <>
      {!webviewUI ? (
        <main className="caption-app-root">
          <CaptionPanel />
        </main>
      ) : null}
    </>
  );
};
