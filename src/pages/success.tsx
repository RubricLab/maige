import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import wizardHatLogo from "../../public/logo.png";

const title = "Maige";
const description = "Let GPT label your issues.";
const linkPreview = "/logo.png";

const Home: NextPage = () => {
  return (
    <div className="bg-black">
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
      <header className="absolute top-0 z-10 flex w-screen items-center justify-start p-2">
        <Image
          src={wizardHatLogo}
          alt="Wizard hat logo"
          className="h-12 w-12 cursor-wait rounded-full object-cover"
        />
        <div />
      </header>
      <main className="relative flex h-screen w-screen flex-col items-center">
        <div className="flex grow flex-col items-center justify-center space-y-4">
          <h1 className="bg-gradient-to-l from-red-200 to-indigo-800 bg-clip-text text-8xl font-bold leading-normal tracking-tight text-transparent">
            Success! 🎉
          </h1>
          <h2 className="text-3xl font-medium tracking-tight text-white/80">
            You&apos;re in.
          </h2>
        </div>
      </main>
      <footer className="absolute bottom-0 flex h-10 w-screen items-center justify-center">
        <span className="text-xs text-white/40">
          From{" "}
          <Link
            className="font-medium text-white/60 transition-opacity hover:text-white/80"
            href="https://studio.neat.run"
          >
            Neat Studio
          </Link>
          . Please do good.
        </span>
      </footer>
    </div>
  );
};

export default Home;
