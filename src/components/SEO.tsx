import Head from "next/head";
import React from "react";

const DEFAULT_TITLE = "Maige";
const DEFAULT_DESCRIPTION = "Let GPT label your issues.";
const DEFAULT_LINK_PREVIEW = "https://maige.app/preview.png";

function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  linkPreview = DEFAULT_LINK_PREVIEW,
}: {
  title?: string;
  description?: string;
  linkPreview?: string;
}) {
  return (
    <Head>
      <title>Maige</title>

      {/* Meta */}
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta name="theme-color" content="#000" />
      <meta name="description" content={description} />

      {/* OG */}
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta property="og:site_name" content={title} />
      <meta property="og:url" content="https://maige.app" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={linkPreview} />
      <meta property="og:card" content={linkPreview} />
      <meta property="og:image:alt" content="Wizard hat logo" />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={linkPreview} />
      <meta name="twitter:image:alt" content="Wizard hat logo" />
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
    </Head>
  );
}

export default SEO;
