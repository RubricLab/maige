import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import SEO from "~/components/SEO";
import demoSrc from "/public/assets/demo.png";
import Neat from "~/components/logos/Neat";
import Cal from "~/components/logos/Cal";

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
      <SEO />
      <Header />
      <main className="relative flex h-screen w-screen flex-col items-center">
        <div className="flex grow flex-col items-center justify-center space-y-2">
          <h1 className="bg-gradient-to-l from-red-200 to-indigo-800 bg-clip-text text-8xl font-bold leading-normal tracking-tight text-transparent">
            Maige
          </h1>
          <h2 className="pb-8 text-3xl font-medium tracking-tight text-white/80">
            Let GPT label your issues.
          </h2>
          {/* <p className="text-white/80">{message}</p> */}
          <div className="flex max-w-sm flex-col items-center space-y-4 py-8">
            {/* <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-gray-900 p-2 px-3 text-center text-white transition-colors hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600/60 active:border-gray-600"
              placeholder="me@startup.so"
              disabled={loading}
            />
            <button
              onClick={submitEmail}
              disabled={!canSubmit || loading}
              className="w-full rounded-md bg-green-700 p-2 font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-600/60 enabled:hover:bg-green-600 disabled:opacity-80"
            >
              Submit
            </button> */}
            <div className="mb-8 flex h-auto w-full flex-col items-center gap-4">
              <Image
                alt="Demo of Maige labelling an issue"
                src={demoSrc}
                className="h-full w-auto rounded-md object-cover ring-4 ring-green-700 ring-opacity-50"
              />
              <p className="text-sm text-white/60">
                That's it. That's all it does for now.
              </p>
            </div>
            <Link href="https://github.com/apps/maige-bot" target="_blank">
              <button className="w-72 rounded-md bg-green-700 p-3 font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-600/60 enabled:hover:bg-green-600 disabled:opacity-80">
                Install on GitHub
              </button>
            </Link>
            <p className="text-sm text-white/60">
              First 10 issues free. Then 10 issues/$.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="text-sm text-white/60">Used by</p>
            <div className="flex flex-row items-center justify-center space-x-6 text-white/60">
              <Cal className="h-6" />
              <Neat className="h-6" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
