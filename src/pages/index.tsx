import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import wizardHatLogo from "../../public/logo.png";

const title = "Maige";
const description = "Let GPT label your issues.";
const linkPreview = "/logo.png";

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Join the waitlist:");

  const submitEmail = useCallback(async () => {
    if (!canSubmit) return;

    setMessage("Submitting...");
    setLoading(true);

    const res = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (res.status === 202) {
      setMessage("You're already on the list! Check your email for details.");
    } else if (res.status === 201) {
      setMessage("Thanks! We'll be in touch soon.");
    } else {
      setMessage("Something went wrong. Please try again later.");
    }

    setLoading(false);
    setEmail("");
  }, [email, canSubmit]);

  useEffect(() => {
    setCanSubmit(isValidEmail(email));
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
          <h1 className="bg-gradient-to-l from-red-200 to-indigo-800 bg-clip-text text-8xl font-bold leading-normal tracking-tight text-transparent">
            Maige
          </h1>
          <h2 className="text-3xl font-medium tracking-tight text-white/70">
            Let GPT label your issues.
          </h2>
          <p className="pb-8 italic text-white/60">Automagically.</p>
          <p className="text-white/80">{message}</p>
          <div className="w-72 space-y-4">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-900 p-2 px-3 text-center text-white transition-colors hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600/60 active:border-gray-600"
              placeholder="me@startup.so"
              disabled={loading}
            />
            <button
              onClick={submitEmail}
              disabled={!canSubmit || loading}
              className="w-full rounded-md border-gray-900 bg-green-700 p-2 font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-600/60 enabled:hover:bg-green-600 disabled:opacity-80"
            >
              Submit
            </button>
          </div>
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
