"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { PropsWithChildren, useEffect } from "react";

export default function CalendlyDialog({ children, url }: PropsWithChildren & { url: string }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl  pt-2">
        <CalendlyEmbed url={url} />
      </DialogContent>
    </Dialog>
  );
}

export function CalendlyEmbed({ url, minHeight }: { url: string; minHeight?: string }) {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute("src", "https://assets.calendly.com/assets/external/widget.js");
    head?.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minHeight: minHeight || "650px", width: "100%" }}
    ></div>
  );
}
