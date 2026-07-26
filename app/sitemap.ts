import { MetadataRoute } from "next";
import { fetchCatalogSummary } from "@/lib/hp-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.dskashmir.com";

  // Static routes
  const routes = ["", "/collections", "/about", "/contact", "/sitemap", "/privacy-policy", "/terms-of-use", "/cookie-settings"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })
  );

  // Dynamic product routes
  const { products } = await fetchCatalogSummary({ catalogName: "Laptops", pageSize: 1000 });
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...routes, ...productRoutes];
}
