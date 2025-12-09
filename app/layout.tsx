import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-Enhanced Design Workflow | Cloudflare One Design Team",
  description: "A comprehensive guide and toolkit for integrating AI capabilities into your design workflow. Open-source resource by Cloudflare One Design Team.",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&family=Source+Sans+3:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
