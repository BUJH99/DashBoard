import React from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { cn } from "../../lib/cn";

export function ScrollArea({
  children,
  className,
  dark = false,
  axis = "y",
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  axis?: "x" | "y" | "both";
}) {
  return (
    <OverlayScrollbarsComponent
      defer
      className={cn("min-h-0", className)}
      options={{
        overflow: {
          x: axis === "x" || axis === "both" ? "scroll" : "hidden",
          y: axis === "y" || axis === "both" ? "scroll" : "hidden",
        },
        scrollbars: {
          theme: dark ? "os-theme-career-dark" : "os-theme-career",
          autoHide: "never",
          autoHideDelay: 140,
          dragScroll: true,
          clickScroll: true,
        },
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
