import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://shopora.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/profile/", "/checkout/", "/order/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
