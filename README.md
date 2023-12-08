# Maige

Label your GitHub issues with AI.

Visit [Maige.app](https://maige.app) to get started.

## Setup

First, install dependencies with `bun i`. Copy the environment file: `cp .env.example .env`. Run the app with `bun run dev` then `ngrok http 3000` in another terminal. Copy the resulting URL for later.

### Setting up a GitHub App

You'll need a GitHub App to trigger webhooks and handle access to repos.

1. Go to Settings (personal or org) > Developer > GitHub Apps
2. Copy your app name, ID, and client secret. Add these to your **.env**.
3. Webhook URL: combine the nGrok URL from above with the handler path eg. `https://abc.ngrok.app/api/webhook/github`.
4. Webhook secret: generate this with `openssl rand -hex 32`. Add it to your **.env**.
5. Permissions: toggle **Issue: Read & Write** and **Pull Request: Read & Write**.
6. Events: toggle **issues**, **issue comments**, **pull requests**, and **labels**.

### Usage

Visit your nGrok URL in the browser and integrate a testing repo.

Open an issue. It should get labelled! 🎉

Some other tests:

- "maige assign me to this issue"
- "maige remove all labels from this issue"
- "maige add the 'self-hosting' label anytime someone mentions 'docker'"
- "maige what packages does this repo use?"

ab
