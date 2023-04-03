// .github/actions/label_pr_from_issue/index.js

const { Octokit } = require("@octokit/core");

async function applyLabelFromLinkedIssueToPR(pr, octokit) {
  const linkedIssue = await octokit.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: pr.base.repo.owner.login,
      repo: pr.base.repo.name,
      issue_number: pr.head.ref,
    }
  );

  if (!linkedIssue) {
    console.log("No issue linked.");
    return;
  }

  const linkedIssueLabels = linkedIssue.labels.map((label) => label.name);

  if (linkedIssueLabels.length === 0) {
    console.log("No labels found on the linked issue.");
    return;
  }

  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
    {
      owner: pr.base.repo.owner.login,
      repo: pr.base.repo.name,
      issue_number: pr.number,
      labels: linkedIssueLabels,
    }
  );

  console.log(
    `Applied labels: ${linkedIssueLabels.join(", ")} to PR#${
      pr.number
    } from linked issue`
  );
}

(async () => {
  const token = process.env.GITHUB_TOKEN;
  const prData = JSON.parse(process.env.PR_DATA);
  const octokit = new Octokit({ auth: token });

  await applyLabelFromLinkedIssueToPR(prData, octokit);
})();
