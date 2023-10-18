import { CreateChatCompletionRequest } from "openai";
import { MAX_BODY_LENGTH } from "../constants";
import { Label } from "../types";
import { truncate } from ".";

/**
 * Ask GPT for labels by title, body, and possible labels
 */
export async function getLabelsFromGPT({
  title,
  body,
  owner,
  name,
  labels,
  repoDescription,
  existingLabelNames,
  customInstructions,
}: {
  title: string;
  body: string;
  owner: string;
  name: string;
  labels: Label[];
  repoDescription?: string;
  existingLabelNames?: string[];
  customInstructions?: string;
}): Promise<string[]> {
  const bodySample = truncate(body, MAX_BODY_LENGTH);

  const prompt = `
You are tasked with labelling a GitHub issue based on its title and body.
The repository is ${name} by ${owner}${
    repoDescription ? `, described as follows: ${repoDescription}` : ""
  }

Here are the user's custom instructions, if any. Please follow them:
${customInstructions}

The possible labels are as follows:
${labels
  .map((l: Label) => `- ${l.name}${l.description ? `: ${l.description}` : ""}`)
  .join("\n")}

Please choose 1-3 of these labels.
The first is always the type of issue, examples: bug, feature request, or question.
The second can usually be the code area if confident, examples: frontend, auth, devOps.

Here is the title of the issue: "${title}"
Here is the body of the issue: "${bodySample}"
${
  existingLabelNames
    ? `Here are the issue's existing labels: "${existingLabelNames?.join(
        ", "
      )}}"`
    : ""
}

Please answer in the format "label1, label2" with only the names of the labels, without explanation.
Examples:
"The dashboard is broken" -> bug, frontend
"Could you add oauth?" -> feature request
"Why do we use GitHub Actions?" -> question, devOps

Remember to try to obey the user's instructions:
${customInstructions}
`;

  // Ask GPT for labels
  const answer = await askGPT({
    prompt,
    model: "gpt-3.5-turbo",
    temperature: 0.6,
    maxTokens: 200,
  });

  // Extract labels from GPT answer
  const gptLabels: string[] = answer
    .split(",")
    // Remove quotes, whitespace, and lowercase
    .map((l: string) => l.trim().toLowerCase().replace(/['"]+/g, ""));

  const labelIds: string[] = gptLabels.reduce(
    (acc: string[], g: string) =>
      labels.some((l: Label) => l.name.toLowerCase().includes(g))
        ? [
            ...acc,
            labels.find((l: Label) => l.name.toLowerCase().includes(g))!.id,
          ]
        : acc,
    []
  );

  return labelIds;
}

/**
 * Ask GPT to update custom instructions
 */
export async function mergeInstructions({
  oldInstructions,
  newInstructions,
  issueBody,
  issueLabels,
}: {
  oldInstructions?: string;
  newInstructions: string;
  issueBody: string;
  issueLabels: string[];
}): Promise<string> {
  // Truncate body if it's too long
  const newInstructionsSample = truncate(newInstructions, MAX_BODY_LENGTH);
  const issueBodySample = truncate(issueBody, MAX_BODY_LENGTH);

  const prompt = `
You are Maige, a concise technical writer AI.
You will be given feedback to incorporate in a set of rules for a ticket-labelling system.
The feedback might apply to you or to that system. Think carefully about which.
---

EXAMPLES:
Here are some examples of how to combine new + old:
- "Always ignore the word ayog" + "Always ignore the word chuwak" = "Always ignore the words ayog and chuwak"
- "Remove previous rules" + "Your favorite color is blue" = "" (empty string)
- "Prefer to apply one label" + "Prefer code area labels" = "Prefer to apply one label, which is code area"
- "Ignore the word scubol" + "Never ignore the word scubol" = "Ignore the word scubol" (override with new)
---

CONTEXT:
The new info might contain feedback on a specific ticket (below). If so, consider generalizing to incorporate the feedback.
Here are the ticket's labels: "${issueLabels?.join?.(", ") || ""}"
Here is the body of the ticket: "${issueBodySample || ""}"
---

READY?
Here are the old rules, if any. Preserve them unless the new info contradicts them:
${oldInstructions || ""}

Here is the new info:
${newInstructionsSample || ""}

Please think carefully, returning only the updated rules. Thank you.
`;

  // Get answer from GPT
  try {
    const answer = await askGPT({
      prompt,
      model: "gpt-4",
      temperature: 0.3,
      maxTokens: MAX_BODY_LENGTH,
    });

    // Truncate answer if it's too long
    const answerSample = truncate(answer, MAX_BODY_LENGTH);

    return answerSample || "";
  } catch (error) {
    console.error(error);
    return "";
  }
}

/**
 * GPT wrapper
 */
export async function askGPT({
  prompt,
  model,
  temperature,
  maxTokens = MAX_BODY_LENGTH,
}: {
  prompt: string;
  model: "gpt-3.5-turbo" | "gpt-4";
  maxTokens?: number;
  temperature: number;
}): Promise<string> {
  // Assemble OpenAI request
  const payload: CreateChatCompletionRequest = {
    model,
    messages: [{ role: "user", content: prompt }],
    temperature,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: maxTokens,
    n: 1,
  };

  const completionsEndpoint = "https://api.openai.com/v1/chat/completions";
  const completionRes = await fetch(completionsEndpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!completionRes.ok) {
    throw new Error(`OpenAI error: ${completionRes.status}`);
  }

  const { choices } = await completionRes.json();
  const answer = choices?.[0]?.message?.content;

  if (!answer || answer?.length === 0) {
    throw new Error("OpenAI error: no answer");
  }

  return answer;
}
