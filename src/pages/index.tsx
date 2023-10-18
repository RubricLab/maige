import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import SEO from "~/components/SEO";
import demoSrc from "/public/assets/demo.png";
import Cal from "~/components/logos/Cal";
import Precedent from "~/components/logos/Precedent";
import Trigger from "~/components/logos/Trigger";
import Highlight from "~/components/logos/Highlight";
import { isDev } from "~/lib/utils";

const Home: NextPage = () => {
  return (
    <div className="bg-black">
      <SEO />
      <Header />
      <main className="relative flex h-screen w-screen flex-col items-center">
        <div className="flex grow flex-col items-center justify-center space-y-2">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="bg-gradient-to-l from-orange-200 to-indigo-800 bg-clip-text text-8xl font-bold leading-normal tracking-tight text-transparent">
              Maige
            </h1>
            <h2 className="pb-8 text-3xl font-medium leading-3 tracking-tight text-white/80">
              Have AI label your issues.
            </h2>
          </div>
          <div className="flex max-w-full flex-col items-center space-y-10 py-8">
            <div className="flex h-auto w-full flex-col items-center gap-2">
              <Image
                alt="Demo of Maige labelling an issue"
                src={demoSrc}
                className="h-full w-auto rounded-md object-cover ring-4 ring-green-700 ring-opacity-50"
              />
              <p className="text-sm text-white/60">
                That&apos;s it. That&apos;s all it does for now.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Link
                href={`https://github.com/apps/${isDev ? "dev-" : ""}maige-bot`}
                rel="noopener noreferrer"
              >
                <button className="w-72 rounded-md bg-green-700 p-3 text-xl font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-600/60 enabled:hover:bg-green-600 disabled:opacity-80">
                  Add to your repo
                </button>
              </Link>
              <p className="text-xs text-white/60">Free to try.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-white/60">
              <p className="text-sm">
                New issues will be labelled automatically.
              </p>
              <p className="text-sm">
                Comment{" "}
                <span className="font-medium text-white">
                  &quot;Maige label this&quot;
                </span>{" "}
                to label an existing issue.
              </p>
              <p className="text-sm">
                Comment{" "}
                <span className="font-medium text-white">
                  &quot;Maige label all&quot;
                </span>{" "}
                to label all old issues.
              </p>
              <p className="text-sm">
                Comment{" "}
                <span className="font-medium text-white">
                  &quot;Maige [instructions]&quot;
                </span>{" "}
                to add custom instructions.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="text-sm text-white/60">Used by</p>
            <div className="flex flex-row items-center justify-center space-x-7 text-white/60">
              <Highlight className="h-6 hover:text-white" />
              <Precedent className="group h-6 hover:text-white" />
              <Cal className="h-5 hover:text-white" />
              <Trigger className="h-6 hover:text-white" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
