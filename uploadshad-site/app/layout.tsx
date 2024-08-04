import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "../config/SiteConfig";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/header/SiteHeader";
import { SiteFooter } from "@/components/Footer";
import Script from "next/script";
import { Toaster } from "sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "shadcn",
    "uploadshad",
    "file input",
    "image input",
    "file uploader",
    "image uploader",
    "shadcn/ui",
    "shadcn file input",
    "shadcn image input input",
    "file uploader component",
    "image uploader component",
    "shadcn tag input component",
    "input",
    "radix ui",
    "react tag input",
  ],
  authors: [
    {
      name: "Charles Rossouw",
      url: "https://jaleelbennett.com",
    },
  ],
  creator: "Charles Rossouw",
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: 'white' },
  //   { media: '(prefers-color-scheme: dark)', color: 'black' },
  // ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@meatboyed",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="smooth-scroll" lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
        <Toaster richColors={true} />
        <ShadcnToaster />
        {/* <Script async src={process.env.UMAMI_URL} data-website-id={process.env.UMAMI_DATA_WEBSITE_ID} /> */}
      </body>
    </html>
  );
}
