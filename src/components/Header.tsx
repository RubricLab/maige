import React from "react";
import wizardHatLogo from "../../public/logo.png";
import Image from "next/image";

function Header() {
  return (
    <header className="absolute top-0 z-10 flex w-screen items-center justify-start p-2">
      <Image
        src={wizardHatLogo}
        alt="Wizard hat logo"
        className="h-12 w-12 cursor-wait rounded-full object-cover"
      />
      <div />
    </header>
  );
}

export default Header;
