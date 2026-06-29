import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/therapist", "/admin", "/consultation", "/payment"],
      },
    ],
    sitemap: "https://tki-c62m.vercel.app/sitemap.xml",
  };
}
