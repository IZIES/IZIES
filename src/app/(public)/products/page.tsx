import { prisma } from "@/lib/prisma";
import { businessMetadata } from "@/lib/seo";
import { capabilityContent } from "@/lib/capabilities";
import { ProductsPageClient } from "@/components/public/products/ProductsPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = businessMetadata(
  "Products & Labs",
  "Discover the original digital products built by IZIES — from student collaboration platforms to virtual workspace tools. Built for the world.",
  "/products",
);

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function ProductsPage({ searchParams }: Props) {
  let products = await prisma.iziesProduct.findMany({
    where: { isPublic: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const resolvedParams = await searchParams;
  const serviceSlug = resolvedParams?.service as string;
  let activeService: any = null;
  if (serviceSlug) {
    activeService = Object.values(capabilityContent).find(c => c.slug === serviceSlug);
    if (activeService) {
      products = products.filter(p => 
        p.services && p.services.some(s => s.toLowerCase() === activeService.title.toLowerCase() || activeService.title.toLowerCase().includes(s.toLowerCase()))
      );
    }
  }

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Product",
        "url": p.url,
        "name": p.name,
        "description": p.description,
        "image": p.imageUrl ? `https://izies.in${p.imageUrl}` : undefined
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema).replace(/</g, '\\u003c') }} />
      <ProductsPageClient products={products} activeService={activeService} />
    </>
  );
}
