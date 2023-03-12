import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import wizardHatLogo from "../../public/logo.png";

const title = "Maige";
const description = "Let GPT label your issues.";
const linkPreview = "/logo.png";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitEmail = useCallback(async () => {
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    setIsSubmitting(false);
    setEmail("");
    setIsSubmitted(true);
  }, [email]);

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
          <h1 className="bg-gradient-to-l from-red-50 to-indigo-900 bg-clip-text text-8xl font-bold leading-normal tracking-tight text-transparent">
            Maige
          </h1>
          <h2 className="text-3xl font-medium tracking-tight text-white/70">
            Let GPT label your issues.
          </h2>
          <p className="pb-8 italic text-white/60">Maigically.</p>
          {isSubmitted ? (
            <p className="text-green-600">Thanks! We&apos;ll be in touch.</p>
          ) : (
            <p className="text-white/80">Join the waitlist:</p>
          )}
          <div className="w-56 space-y-4">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-900 p-2 px-3 text-white transition-colors hover:border-gray-600 focus:outline-none focus:ring-4 focus:ring-green-600/60 active:border-gray-600"
              placeholder="me@startup.so"
              disabled={isSubmitted || isSubmitting}
            />
            <button
              onClick={submitEmail}
              disabled={!email || isSubmitted || isSubmitting}
              className="w-full rounded-md border-gray-900 bg-green-700 p-2 font-medium text-white transition-all enabled:hover:bg-green-600 disabled:opacity-80"
            >
              Submit
            </button>
          </div>
          {/* <Link href="https://github.com/apps/maige-bot">
            <button className="rounded-md border-gray-900 bg-green-700 px-6 py-3 font-medium text-white blur-sm transition-all duration-500 hover:scale-105 hover:bg-green-600 hover:blur-none">
              Install with GitHub
            </button>
          </Link> */}
        </div>
      </main>
      <footer className="absolute bottom-0 flex h-10 w-screen items-center justify-center">
        <span className="text-xs text-white/40">
          By{" "}
          <Link
            className="font-medium text-white/60"
            href="https://studio.neat.run"
          >
            Neat Studio
          </Link>
          . Please don&apos;t destroy the world with this.
        </span>
      </footer>
    </div>
  );
};

export default Home;
