# HelpScout Create Ticket Example

## Getting Started

Clone this repository:

```bash
git clone https://github.com/GeorgiyIzmailov/helpscout.git
```

Setup dependencies:

```bash
npm install
```

## Get application secrets

1. Login to HelpScout (accept the invite sent to your e-mail).

2. To test the repository you need to create an app on the platform. Open your profile picture then select **Your Profile**.

3. Click on the **My Apps** tab.

4. Create application by giving it an **App Name** and setting its **Redirection URL** to `http://localhost:3000/api/helpscout-webhook`.

5. Copy the **App ID** and **App Secret** fields

6. Add the copied values to the `.env` file:

```bash
...
REACT_APP_CLIENT_ID="YOUR_CLIENT_ID";
REACT_APP_SECRET_ID="YOUR_SECRET_ID";
...
```

## Get a mailbox ID

1. Open **Inbox** tab

2. On left bottom corner open the **Inbox Settings** and select **Edit Inbox**

3. Copy arbitrary numbers in the page URL:

```bash
https://secure.helpscout.net/settings/inbox/{YOUR_MAILBOX_ID}/
```

In our case, the mailbox ID is `320281`.

It should also be added to the .env file:

```bash
...
REACT_APP_MAILBOX_ID="YOUR_MAILBOX_ID";
...
```

## Authorize application

Authorize an application created on the HelpScout platform.

Use the following commands:

```bash
npm run build && npm start
```

Click **Authorize the app** to authorize the app. (Required on every application restart)

Click **Create Ticket ✨** to create a conversation/ticket.

(You can modify conversation/ticket content in the `src/helper/const.ts`).

## Routes

`/api/helpscout-webhook` - Webhook use by helpscout to set applications tokens.

`/api/create-support-ticket` - Create a new conversation/ticket in your inbox.
