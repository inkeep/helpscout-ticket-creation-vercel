# HelpScout Create Ticket Example

## Getting Started

Clone this repository:

```bash
git clone https://github.com/GeorgiyIzmailov/helpscout.git
```

Setup dependencies:

```bash
pnpm install
```

Copy the example env file to make a `.env.development.local` for local development.

```bash
cp .env.example .env.development.local
```

## Create HelpScout application

1. Login to HelpScout

2. Open your profile picture then select **Your Profile**.

3. Click on the **My Apps** tab.

4. Create application by giving it an **App Name**. The **Redirection URL** can be any value, it's not used.

5. Copy the **App ID** and **App Secret** fields

6. Add the copied values to your environment variables:

```bash
HELPSCOUT_APP_ID=<HELPSCOUT_APP_ID>
HELPSCOUT_APP_SECRET=<HELPSCOUT_APP_SECRET>
```

## Get a mailbox ID

1. Open **Inbox** tab

2. On left bottom corner open the **Inbox Settings** and select **Edit Inbox**

3. Copy the ID from the page URL:

```bash
https://secure.helpscout.net/settings/inbox/{HELPSCOUT_MAILBOX_ID}/
```

Add it as an env variable:

```
HELPSCOUT_MAILBOX_ID=<HELPSCOUT_MAILBOX_ID>
```

## Help Scout Access Tokens
HelpScout access tokens received via client-credentials (service-to-service authentication) expire after two days. In order to store the token so it's not fetched on every request, we'll leverage Vercel's Edge Config which is optimized for high-read, low-write scenarios. To use it:

### Create Edge Config
Create an Edge Config storage instance for your project. See [here](https://vercel.com/docs/storage/edge-config/get-started#quickstart). Copy the `ID` and add it as an env variable:

```
EDGE_CONFIG_ID=<EDGE_CONFIG_ID>
```

Creating an Edge Config will also automatically create an `EDGE_CONFIG` env variable in your Vercel project. This is used for reads using the `@vercel/edge-config` SDK.

For local development, you can visit your project's **Settings** > **Environment Variables** and copy it.

Set it as an env variable:

```
EDGE_CONFIG=<EDGE_CONFIG>
```

### Vercel API Access Token

Next, create a Vercel API access token. See [here](https://vercel.com/docs/rest-api#creating-an-access-token). This is used to write to the edge config.

Set it as env variable:

```
VER_API_ACCESS_TOKEN=<VER_API_ACCESS_TOKEN>
```

Lastly, set the Vercel Team ID for where your project is located. You can find this under **Settings** under your Team in the [Vercel dashboard](https://vercel.com)

```
VER_TEAM_ID=<VER_TEAM_ID>
```

## Run locally
```
pnpm dev
```

## API Routes
`/api/create-support-ticket` - Create a new conversation/ticket in your inbox.