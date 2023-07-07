import React from "react";

function Precedent({ className }: { className?: string }) {
  return (
    <a href="https://precedent.dev" target="_blank" rel="noreferrer noopener">
      <div className={`${className} flex items-center justify-center gap-2`}>
        <img
          src="/assets/logos/precedent.png"
          className="max-h-full opacity-70 invert"
        />
        <p className="text-2xl">Precedent</p>
      </div>
    </a>
  );
}

export default Precedent;
