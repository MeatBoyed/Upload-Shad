import { siteConfig } from "@/config/SiteConfig";

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
          <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
            GitHub
          </a>
          .
        </p>
        <div className="w-full border" />
        <div className="w-full  min-h-fit flex justify-center items-center flex-col gap-5">
          <div className="flex justify-center items-center flex-col">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Powered by</h3>
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-[#00AAFF] ">Nerf Designs</h2>
            <div className="leading-7">Nerf your competition</div>
          </div>

          <p className="leading-7 text-center">Copyright © {new Date().getFullYear()} Nerf Designs. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
