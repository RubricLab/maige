import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="absolute bottom-0 flex h-10 w-screen items-center justify-center">
      <span className="text-xs text-white/40">
        From{" "}
        <Link
          className="font-medium text-white/60 transition-opacity hover:text-white/80"
          href="https://studio.neat.run"
          target="_blank"
        >
          Neat Studio
        </Link>
        . Please do good.
      </span>
    </footer>
  );
}

export default Footer;
