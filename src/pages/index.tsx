import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const title = "Maige";
const description = "Let GPT label your issues.";
const linkPreview = "/logo.png";

const Home: NextPage = () => {
  return (
    <>
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
      <main className="flex h-screen w-screen flex-col items-center justify-center space-y-6 bg-black">
        <h1 className="text-8xl font-bold tracking-tight text-white">Maige</h1>
        <h2 className="text-3xl font-semibold tracking-tight text-white/80">
          Let GPT label your issues.
        </h2>
        <p className="pb-8 italic text-white/60">Magically.</p>
        <Link href="https://github.com/apps/maige-bot">
          <button className="rounded-md border-gray-900 bg-green-600 px-6 py-3 font-medium text-white">
            Install with GitHub
          </button>
        </Link>
      </main>
    </>
  );
};

export default Home;
