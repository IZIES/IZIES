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

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  let products = await prisma.iziesProduct.findMany({
    where: { isPublic: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const serviceSlug = searchParams?.service as string;
  let activeService: any = null;
  if (serviceSlug) {
    activeService = Object.values(capabilityContent).find(c => c.slug === serviceSlug);
    if (activeService) {
      products = products.filter(p => 
        p.services && p.services.some(s => s.toLowerCase() === activeService.title.toLowerCase() || activeService.title.toLowerCase().includes(s.toLowerCase()))
      );
    }
  }

  return <ProductsPageClient products={products} activeService={activeService} />;
}
