import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/SiteConfig";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { GitHubLogoIcon, InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { UploadCloud } from "lucide-react";

export default function MainNav() {
  return (
    <div className="container h-14 max-w-screen-2xl items-center hidden md:flex">
      <div className="flex flex-1 items-center justify-between space-x-2">
        <Link href="/">
          <div
            className={cn(
              buttonVariants({
                variant: "link",
              }),
              "px-0"
            )}
          >
            <UploadCloud className="mr-2 h-6" />
            <span className="sr-only">Home link</span>
          </div>
        </Link>
        <nav className="flex items-center">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                }),
                "w-9 px-0"
              )}
            >
              <GitHubLogoIcon className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <Link href={siteConfig.links.instagram} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                }),
                "w-9 px-0"
              )}
            >
              <InstagramLogoIcon className="h-3 w-3 fill-current" />
              <span className="sr-only">Instagram</span>
            </div>
          </Link>

          <ModeToggle />
        </nav>
      </div>
    </div>
  );
}
