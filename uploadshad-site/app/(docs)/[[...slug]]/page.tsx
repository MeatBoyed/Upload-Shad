import { notFound } from "next/navigation";
import { allDocs } from "contentlayer/generated";

import "../../mdx.css";
import type { Metadata } from "next";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Balancer from "react-wrap-balancer";

import { siteConfig } from "@/config/SiteConfig";
import { absoluteUrl, cn } from "@/lib/utils";
import { Mdx } from "@/components/mdx-components";
import { DocsPager } from "@/components/pager";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || "";
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(doc.slug),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [siteConfig.ogImage],
      creator: "@shadcn",
    },
  };
}

export async function generateStaticParams(): Promise<DocPageProps["params"][]> {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    notFound();
  }

  return (
    <main className="w-full relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-1 max-w-4xl">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">Docs</div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">{doc.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>{doc.title}</h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
        </div>
        <div className="pb-12 pt-8">
          <Mdx code={doc.body.code} />
        </div>
        <DocsPager doc={doc} />
      </div>
    </main>
  );
}
