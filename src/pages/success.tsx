import { type NextPage } from "next";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import SEO from "~/components/SEO";

const Home: NextPage = () => {
  return (
    <div className="bg-black">
      <SEO />
      <Header />
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
      <Footer />
    </div>
  );
};

export default Home;
