// .github/actions/label_pr_from_issue/index.js

const { Octokit } = require("@octokit/core");

async function applyLabelFromLinkedIssueToPR(pr, octokit) {
  const timelineItems = await octokit.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
    {
      owner: pr.base.repo.owner.login,
      repo: pr.base.repo.name,
      issue_number: pr.number,
      mediaType: {
        previews: ["mockingbird"],
      },
    }
  );

  console.log("Timeline items: ", timelineItems);

  const linkedIssues = timelineItems.data.filter(
    (item) =>
      item.event === "cross-referenced" && item.source && item.source.issue
  );

  if (linkedIssues.length === 0) {
    console.log("No issue linked.");
    return;
  }

  // Fetch the first linked issue
  const issueNumber = linkedIssues[0].source.issue.number;
  const linkedIssue = await octokit.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: pr.base.repo.owner.login,
      repo: pr.base.repo.name,
      issue_number: issueNumber,
    }
  );

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
