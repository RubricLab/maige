import { Session } from "@e2b/sdk";
import { expect, test } from "bun:test";
import { SerpAPI } from "langchain/tools";
import { exec } from "lib/tools";
import { env } from "~/env.mjs";

test("Bun test runner", () => {
  // This is arbitrary. Could just return true.
  expect(Bun.version).toInclude("1.0");
});

test.skip(
  "GH CLI",
  async () => {
    const shell = await Session.create({
      apiKey: env.E2B_API_KEY,
      id: "Nodejs",
    });

    const cli = await exec({
      description:
        "Executes a shell command with the GH CLI installed and logged in",
      name: "gh_cli",
      setupCmd: `sudo apt install gh && gh auth login --with-token <<< "${env.GITHUB_ACCESS_TOKEN}"`,
      shell,
    });

    const authStatus = await cli.func({ cmd: "gh auth status" });

    expect(authStatus).toInclude("Logged in to github.com");
  },
  15 * 1000 // extend default 5s timeout
);

test("SERP API", async () => {
  const serp = new SerpAPI();
  const res = await serp.call("today's weather in san francisco");

  const weather = JSON.parse(res);

  expect(weather.location).toBe("San Francisco, CA");
});

test.todo("E2E", () => {
  console.log(
    "It should pass a sample issue to engineer() and have it appropriately labelled"
  );
});