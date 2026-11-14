# Setting up Gmail Inbox

Generated from `provider/manifest.json`; do not edit. Each step cites the provider page it
came from. Words in **bold** are values from YOUR app, filled in where a host shows these steps.

## 1. Create (or reuse) the Google Cloud project for **your app's name**

Every Google connector shares ONE consent grant (oauth.grant "google"), so use one project and one OAuth client for all of them: one consent and one refresh token per person.

Source: [developers.google.com](https://developers.google.com/workspace/guides/create-project)

## 2. Enable the Gmail API and the Cloud Pub/Sub API

Console: APIs & Services, Library; open the Gmail API, then the Cloud Pub/Sub API and click Enable.

Source: [developers.google.com](https://developers.google.com/workspace/guides/enable-apis)

## 3. Configure the consent screen

Console: Google Auth platform, Branding (app name **your app's name**, support email, contact email), then Audience: Internal for people inside your Google Workspace organisation only, or External (while it is in testing, add each tester under Test users). Then Data Access, Add or Remove Scopes, and add `https://www.googleapis.com/auth/gmail.readonly` beside the scopes of any other Google connector you use. You cannot remove the consent screen once it is configured. This connector's scope is RESTRICTED: an External app needs Google's additional review for it, and the annual security assessment (CASA) applies to the whole OAuth client. Keep it on its own client if your other Google features should not carry that.

Source: [developers.google.com](https://developers.google.com/workspace/guides/configure-oauth-consent)

## 4. Create a Web application OAuth client

Console: Google Auth platform, Clients, Create Client; type Web application. Under Authorized redirect URIs click Add URI and paste **your host's OAuth redirect URL**, then Create. Copy the client ID and client secret when the client is created.

**Copy:**

- Authorized redirect URI: **your host's OAuth redirect URL**

**Yields:** `clientId`, `clientSecret`

Source: [developers.google.com](https://developers.google.com/workspace/guides/create-credentials)

## 5. Create the Pub/Sub topic Gmail publishes to

In the SAME project, create a topic (any name, e.g. projects/<project>/topics/gmail-push) and grant publish on it to gmail-api-push@system.gserviceaccount.com. An organisation's domain-restricted sharing policy can refuse that grant: configure an exception for that service account if it does. mailbox_watch names this topic, and the watch must be renewed at least every 7 days (Google recommends daily).

**Copy:**

- Publisher principal: gmail-api-push@system.gserviceaccount.com

Source: [developers.google.com](https://developers.google.com/workspace/gmail/api/guides/push)

## 6. Create an AUTHENTICATED push subscription to **your app's name**

Create a push subscription on the topic with endpoint **your host's webhook URL for this connector**. Check Enable authentication, select a service account, and enter **your host's webhook URL for this connector** as the audience. The Pub/Sub service agent needs iam.serviceAccountTokenCreator in the project, and whoever creates the subscription needs iam.serviceAccounts.actAs on that service account. Every push then carries a Google-signed token this connector checks for that audience and that service account's email.

**Copy:**

- Endpoint URL: **your host's webhook URL for this connector**
- Audience: **your host's webhook URL for this connector**

**Yields:** `pushAudience`, `pushServiceAccount`

Source: [docs.cloud.google.com](https://docs.cloud.google.com/pubsub/docs/authenticate-push-subscriptions)

## 7. Connect an account and check it works — an AGENT step

Connect one Google account through **your app's name**'s OAuth flow, then run the check below.

**The agent is asked:**

> Using **your app's name**'s **this connector's name** connection, run label_list and report how many labels it returns. Then call mailbox_watch with the topic, ask the person to send the account an email, and confirm **your app's name** received a message_received push whose token verified and which routed to this connection.

**Done when:** label_list answers, and a new email arrives as a verified message_received.

Source: [developers.google.com](https://developers.google.com/workspace/gmail/api/guides/push)
