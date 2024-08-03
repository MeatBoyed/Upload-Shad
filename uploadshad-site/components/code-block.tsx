import { cn } from "@/lib/utils";
import CopyButton from "./copy-button";
import { ReactNode } from "react";

// TODO: FIX Copy Button

function CodeBlock({
  value,
  className,
  copyable = true,
}: {
  value?: ReactNode;
  className?: string;
  codeClass?: string;
  copyable?: boolean;
  codeWrap?: boolean;
  noCodeFont?: boolean;
  noMask?: boolean;
}) {
  value = value || "";

  return (
    <pre
      style={{ maxHeight: "500px", overflowY: "auto" }}
      className={cn(
        `relative h-full w-full whitespace-pre-wrap rounded-lg py-4 px-6 text-sm border text-white/75 bg-zinc-950 dark:bg-zinc-900
          } `,
        className
      )}
    >
      <CopyButton value={value as string} copyable={copyable} />
      {value}
    </pre>
  );
}

export default CodeBlock;
