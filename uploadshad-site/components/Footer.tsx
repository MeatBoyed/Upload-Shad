import { siteConfig } from "@/config/SiteConfig";
import BrandingFooter from "@/registry/component/NDX/branding-footer";

export function SiteFooter() {
  return (
    <footer className="py-6 flex flex-col justify-center items-center gap-4 mb-8 md:px-8 ">
      <div className="min-h-fit flex flex-col items-center justify-between  gap-4 md:h-24 w-full">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            {siteConfig.author}
          </a>
          . The source code is available on{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
        <div className="w-full border" />
        <BrandingFooter />
      </div>
    </footer>
  );
}
