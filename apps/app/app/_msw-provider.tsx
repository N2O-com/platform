"use client";

import { type ReactNode, useEffect, useState } from "react";

const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

export const MSWProvider = ({ children }: { readonly children: ReactNode }) => {
  const [ready, setReady] = useState(!MOCKING_ENABLED);

  useEffect(() => {
    if (!MOCKING_ENABLED || ready) {
      return;
    }
    let cancelled = false;
    import("../mocks/browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass" }).then(() => {
        if (!cancelled) {
          setReady(true);
        }
      })
    );
    return () => {
      cancelled = true;
    };
  }, [ready]);

  if (!ready) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          color: "#888",
        }}
      >
        Starting mock service worker…
      </div>
    );
  }

  return <>{children}</>;
};
