# Maige

Automate your GitHub issue labeling with the power of AI. Maige streamlines your workflow by intelligently categorizing issues and pull requests. Get started at [Maige.app](https://maige.app).

## Quick Setup

- Install dependencies: `bun i`
- Set up environment: `cp .env.example .env`
- Start the app: `bun run dev`
- Expose locally: `ngrok http 3000`

## GitHub App Integration

Easily integrate Maige with your GitHub repositories:

1. Create a GitHub App in your account settings.
2. Add the app credentials to your **.env** file.
3. Set the webhook URL using your nGrok URL.
4. Secure webhooks with a secret generated via `openssl rand -hex 32`.
5. Enable necessary permissions and events for issues and pull requests.

## Experience the Magic

- Open an issue in your integrated repo and watch Maige label it automatically.
- Use commands like `maige assign me` to manage issues with ease.
- Customize Maige's behavior with simple instructions.

Ready to enhance your GitHub workflow? Visit [Maige.app](https://maige.app) and integrate your first repository today!
