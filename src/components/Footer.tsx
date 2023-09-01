import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="absolute bottom-0 flex h-10 w-screen gap-1 items-center justify-center">
      <span className="text-xs text-white/40">
        <Link
          className="font-medium text-white/60 transition-opacity hover:text-white/80"
          href="https://github.com/tedspare/maige"
          target="_blank"
        >
        Open source
        </Link>.
      </span>
      <span className="text-xs text-white/40">
        Built by{" "}
        <Link
          className="font-medium text-white/60 transition-opacity hover:text-white/80"
          href="https://github.com/tedspare"
          target="_blank"
        >
          Ted Spare
        </Link>.
      </span>
    </footer>
  );
}

export default Footer;
