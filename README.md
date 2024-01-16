# Maige

Repo maintenance made simpler.

Quickly set up Maige and let AI handle your issue labels with ease. Get started at [Maige.app](https://maige.app).

## Quick Setup

- Install dependencies: `bun i`
- Set up environment: `cp .env.example .env`
- Start the app: `bun run dev` & in a separate terminal run, `ngrok http 3000`

## GitHub App Integration

Create a GitHub App for webhooks and repo access. Fill in your **.env** with app details and set up the webhook URL as `https://<your-ngrok-url>/api/webhook/github`.

1. Go to Settings (personal or org) > Developer > GitHub Apps
2. Copy your app name, ID, and client secret. Add these to your **.env**.
3. Webhook URL: combine the nGrok URL from above with the handler path eg. `https://abc.ngrok.app/api/webhook/github`.
4. Webhook secret: generate this with `openssl rand -hex 32`. Add it to your **.env**.
5. Permissions: toggle **Issue: Read & Write** and **Pull Request: Read & Write**.
6. Events: toggle **issues**, **issue comments**, **pull requests**, and **labels**.

## Dive In

Access Maige through your nGrok URL and link a test repo. Open an issue and watch Maige work its magic with labels!

Try these commands:

- "maige assign me to this issue"
- "maige remove all labels from this issue"
- "maige add the 'self-hosting' label anytime someone mentions 'docker'"
- "maige what packages does this repo use?"

Enjoy streamlined issue management with Maige! 🚀
