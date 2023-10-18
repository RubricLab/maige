import { Metadata } from "next";
import "~/styles/globals.css";

const title = "Maige";
const description = "AI-powered codebase actions.";
const preview = {
  url: "/preview.png",
  width: 1200,
  height: 630,
  alt: "Maige logo",
};

export const metadata: Metadata = {
  title,
  description,
  themeColor: "#000",
  metadataBase: new URL("https://maige.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title,
    description,
    url: "maige.app",
    siteName: title,
    type: "website",
    images: preview,
  },
  twitter: {
    title,
    creator: "@RubricLabs",
    card: "summary_large_image",
    images: preview,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
