# Maige

Visit [Maige.app](https://maige.app) to get started.

Label your GitHub issues with AI.

## Setup

1. To install deps, `bun i`
2. To run the app, `bun run dev && ngrok http 3000`
3. Copy the nGrok URL to the [Maige Bot](https://github.com/organizations/rubriclab/settings/apps/dev-maige-bot) Webhook URL field in Org settings > Developer > GitHub Apps.
4. Go to the nGrok URL in the browser and integrate a testing repo.
5. Open an issue. It should get labelled.

### Weird things

When you generate a SK with GH for the app - it needs to be reformed. Follow this: https://github.com/gr2m/universal-github-app-jwt#readme
