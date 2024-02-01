# Maige

Repo maintenance made simpler.

Quickly set up Maige and let AI handle your issue labels with ease. Get started at [Maige.app](https://maige.app).

## Quick Setup

- Install dependencies: `bun i`
- Set up the environment: `vercel env pull` or `cp .env.example .env`
- Start the app: `bun run dev`
- Expose the app: in a separate terminal, run `ngrok http 3000`

## GitHub App Integration

Create a GitHub App for webhooks and repo access. Populate your **.env** with the app details.

1. Go to Settings (personal or org) > Developer > GitHub Apps
2. Copy your app name, ID, and client secret. Add these to your **.env**.
3. Callback URL: nGrok URL + GitHub auth endpoint eg. `https://abc.ngrok.app/api/auth/callback/github`
4. Webhook URL: nGrok URL + handler path eg. `https://abc.ngrok.app/api/webhook/github`.
5. Webhook secret: generate this with `openssl rand -hex 32`. Add it to your **.env**.
6. Permissions: toggle **Issue: Read & Write** and **Pull Request: Read & Write**.
7. Events: toggle **issues**, **issue comments**, and **pull requests**.
8. Private key: generate a private key. Download it. Run the following command ([source](https://github.com/gr2m/universal-github-app-jwt?tab=readme-ov-file#converting-pkcs1-to-pkcs8)) to convert it to the right format:

   ```sh
   openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private-key.pem -out private-key-pkcs8.key
   ```

   then copy **private-key-pkcs8.key**'s text contents to your **.env**.

## Dive In

Access Maige through your nGrok URL and link a test repo. Open an issue to test Maige out!

Try these commands:

- "maige assign me to this issue"
- "maige remove all labels from this issue"
- "maige add the 'self-hosting' label anytime someone mentions 'docker'"
- "maige what packages does this repo use?"

Enjoy streamlined issue management with Maige! 🚀
