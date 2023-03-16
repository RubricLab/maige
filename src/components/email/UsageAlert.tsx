import React from "react";
import { Tailwind } from "@react-email/tailwind";
import { Button } from "@react-email/button";

type Props = {
  link?: string;
};

function UsageTemplate({ link }: Props) {
  return (
    <div>
      <Tailwind>
        <h1>Thanks for using Maige!</h1>
        <p className="italic">We hope you like it.</p>
        <p>
          Accessing text-generation APIs can be expensive, so we ask you to add
          a payment method at this point.
        </p>
        <p>
          Usage will remain free up to 10 issues per month. Past that,
          you&apos;ll get 10 issues per dollar.
        </p>
        {link && (
          <Button
            className="w-full rounded-md bg-green-600 p-2 px-4 font-medium text-white"
            href={link}
          >
            Get started
          </Button>
        )}
        <p>Best,</p>
        <p>Ted</p>
      </Tailwind>
    </div>
  );
}

export default UsageTemplate;
