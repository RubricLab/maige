// .github/actions/label_pr_from_issue/index.js

const { Octokit } = require("@octokit/core");
const { graphql, gql } = require("@octokit/graphql");

async function applyLabelFromLinkedIssueToPR(pr, octokit) {
  const query = gql`
    query GetLinkedIssues($owner: String!, $repo: String!, $prNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $prNumber) {
          closingIssuesReferences(first: 10) {
            nodes {
              number
              labels(first: 10) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await graphql(query, {
    owner: pr.base.repo.owner.login,
    repo: pr.base.repo.name,
    pr_number: pr.number,
    headers: {
      authorization: `token ${octokit.auth.token}`,
    },
  });

  const linkedIssues =
    data.repository.pullRequest.closingIssuesReferences.nodes;

  if (linkedIssues.length === 0) {
    console.log("No issue linked.");
    return;
  }

  for (const issue of linkedIssues) {
    const labels = issue.labels.nodes.map((label) => label.name);

    if (labels.length === 0) {
      console.log(`No labels found on the linked issue #${issue.number}.`);
      continue;
    }

    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
      {
        owner: pr.base.repo.owner.login,
        repo: pr.base.repo.name,
        issue_number: pr.number,
        labels: labels,
      }
    );

    console.log(
      `Applied labels: ${labels.join(", ")} to PR#${
        pr.number
      } from linked issue #${issue.number}`
    );
  }
}

(async () => {
  if (!process.env.PR_DATA) {
    console.log("No PR data found.");
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const prData = JSON.parse(process.env.PR_DATA);
  const octokit = new Octokit({ auth: token });

  await applyLabelFromLinkedIssueToPR(prData, octokit);
})();
