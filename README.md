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

## Get application secrets

1. Login to HelpScout (accept the invite sent to your e-mail).

2. To test the repository you need to create an app on the platform. Open your profile picture then select **Your Profile**.

3. Click on the **My Apps** tab.

4. Create application by giving it an **App Name** and setting its **Redirection URL** to `http://localhost:3000/api/helpscout-webhook`.

5. Copy the **App ID** and **App Secret** fields

6. Add the copied values to the `.env` file:

```bash
HELPSCOUT_APP_ID=<HELPSCOUT_APP_ID>
HELPSCOUT_APP_SECRET=<HELPSCOUT_APP_SECRET>
```

## Get a mailbox ID

1. Open **Inbox** tab

2. On left bottom corner open the **Inbox Settings** and select **Edit Inbox**

3. Copy arbitrary numbers in the page URL:

```bash
https://secure.helpscout.net/settings/inbox/{YOUR_HELPSCOUT_MAILBOX_ID}/
```

In our case, the mailbox ID is `320281`.

It should also be added to the .env file:

```bash
HELPSCOUT_MAILBOX_ID="YOUR_HELPSCOUT_MAILBOX_ID";
```

## Help Scout Access Tokens
HelpScout access tokens received via client-credentials (service-to-service authentication) expire after two days. In order to store the token so it's not fetched on every request, we'll leverage Vercel's Edge Config which is optimized for high-read, low-write scenarios. To use it:

### Create Edge Config
Create an Edge Config storage instance for your project. See [here](https://vercel.com/docs/storage/edge-config/get-started#quickstart). Copy the `ID` and add it as an env variable:

```
EDGE_CONFIG_ID=<EDGE_CONFIG_ID>
```

Creating an Edge Config will also automatically create an `EDGE_CONFIG` env variable in your project. This is used for reads using the `@vercel/edge-config` SDK.

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

## Routes
`/api/create-support-ticket` - Create a new conversation/ticket in your inbox.
