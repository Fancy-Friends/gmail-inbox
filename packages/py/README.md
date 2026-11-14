# Gmail Inbox

[![Fancified](art/fancified.svg)](https://particle.academy)

Gmail Inbox for [fancy-flow][flow] — as **four imported, versioned packages**, one
per runtime. Not vendored source: a copy cannot be upgraded, and third-party APIs
change.

[flow]: https://github.com/Particle-Academy/fancy-flow

| Runtime | Package | Install |
|---|---|---|
| Authoring surface (every host) | `@particle-academy/gmail-inbox-ui` | `npm install @particle-academy/gmail-inbox-ui` |
| Node | `@particle-academy/gmail-inbox-js` | `npm install @particle-academy/gmail-inbox-js` |
| PHP 8.4+ | `particle-academy/gmail-inbox-php` | `composer require particle-academy/gmail-inbox-php` |
| Python 3.11+ | `fancy-gmail-inbox` | `pip install fancy-gmail-inbox` |

The `ui` package is the editor surface and is React on every host — a PHP or
Python project installs it *and* its own runtime package, and never the `js` one.

## What it costs you

One dependency: `@particle-academy/fancy-connector-core` (or
`particle-academy/fancy-connector-core` on Composer), which the `js` and `php`
packages pull in themselves. The Python package has **zero** runtime
dependencies.

**No Gmail Inbox SDK.** Plain HTTP, deliberately: a vendor SDK is third-party code
subject to the kit's full approval bar, and one per provider is hundreds of
dependencies nobody is tracking.

## Setting it up

Everything below is generated from `provider/manifest.json`, so it cannot disagree with what the packages do.

### On Gmail Inbox's side

1. **Create (or reuse) the Google Cloud project for **your app's name**** — Every Google connector shares ONE consent grant (oauth.grant "google"), so use one project and one OAuth client for all of them: one consent and one refresh token per person. ([developers.google.com](https://developers.google.com/workspace/guides/create-project))
2. **Enable the Gmail API and the Cloud Pub/Sub API** — Console: APIs & Services, Library; open the Gmail API, then the Cloud Pub/Sub API and click Enable. ([developers.google.com](https://developers.google.com/workspace/guides/enable-apis))
3. **Configure the consent screen** — Console: Google Auth platform, Branding (app name **your app's name**, support email, contact email), then Audience: Internal for people inside your Google Workspace organisation only, or External (while it is in testing, add each tester under Test users). Then Data Access, Add or Remove Scopes, and add `https://www.googleapis.com/auth/gmail.readonly` beside the scopes of any other Google connector you use. You cannot remove the consent screen once it is configured. This connector's scope is RESTRICTED: an External app needs Google's additional review for it, and the annual security assessment (CASA) applies to the whole OAuth client. Keep it on its own client if your other Google features should not carry that. ([developers.google.com](https://developers.google.com/workspace/guides/configure-oauth-consent))
4. **Create a Web application OAuth client** — Console: Google Auth platform, Clients, Create Client; type Web application. Under Authorized redirect URIs click Add URI and paste **your host's OAuth redirect URL**, then Create. Copy the client ID and client secret when the client is created. ([developers.google.com](https://developers.google.com/workspace/guides/create-credentials))
5. **Create the Pub/Sub topic Gmail publishes to** — In the SAME project, create a topic (any name, e.g. projects/<project>/topics/gmail-push) and grant publish on it to gmail-api-push@system.gserviceaccount.com. An organisation's domain-restricted sharing policy can refuse that grant: configure an exception for that service account if it does. mailbox_watch names this topic, and the watch must be renewed at least every 7 days (Google recommends daily). ([developers.google.com](https://developers.google.com/workspace/gmail/api/guides/push))
6. **Create an AUTHENTICATED push subscription to **your app's name**** — Create a push subscription on the topic with endpoint **your host's webhook URL for this connector**. Check Enable authentication, select a service account, and enter **your host's webhook URL for this connector** as the audience. The Pub/Sub service agent needs iam.serviceAccountTokenCreator in the project, and whoever creates the subscription needs iam.serviceAccounts.actAs on that service account. Every push then carries a Google-signed token this connector checks for that audience and that service account's email. ([docs.cloud.google.com](https://docs.cloud.google.com/pubsub/docs/authenticate-push-subscriptions))
7. **Connect an account and check it works** — Connect one Google account through **your app's name**'s OAuth flow, then run the check below. ([developers.google.com](https://developers.google.com/workspace/gmail/api/guides/push))

Every step in full — who does it, what to paste, which credentials it yields, and how you know it worked — is in [SETUP.md](SETUP.md).

### Credentials

A Gmail Inbox connection holds 6 values.

**Two kinds of value, and mixing them up matters.** A `provider` credential is ONE value for the whole installation — an OAuth app's client secret serves every connected account. An `account` credential is one per connected account. A host that stores the second where it stores the first lets one account's credentials reach another's.

| Field | Scope | Secret | Where it comes from |
|---|---|---|---|
| **OAuth client ID** | per installation | not secret | From Google Cloud Console -> APIs & Services -> Credentials. ONE value for the whole installation. This connector requests a RESTRICTED scope, and Google verifies per OAuth client: sharing one client with the other Google connectors (one consent, one grant) puts every Google feature behind the annual CASA assessment; a separate client for this connector keeps it here alone, at the cost of a second consent. Your choice. |
| **OAuth client secret** | per installation | **secret** | The client secret for the same OAuth app. One value for the whole installation. |
| **Access token** | per connected account | **secret** | Per connected Google account, and it expires after ONE HOUR. The host refreshes it with the refresh token. |
| **Refresh token** | per connected account | **secret** | Per connected Google account. Google issues one only when the consent request asks for offline access; without it the connection dies within the hour. |
| **Push audience** *(optional)* | per installation | not secret | The audience set on the Pub/Sub PUSH subscription (normally the endpoint URL your host mounts for message_received). Every push's Google-signed token must name it; an unchecked audience accepts any token Google signs for anyone. Needed only for the message_received trigger. |
| **Push service account** *(optional)* | per installation | not secret | The service account the push subscription authenticates as (its email). Every push's token must be for exactly this account: a stranger's subscription aimed at your URL carries a token Google signed correctly, and only this check refuses it. Needed only for message_received. |

### Authorising

Gmail Inbox uses OAuth2 (authorization_code). The package DECLARES the exchange; the HOST performs it — a consent screen needs a browser, a redirect URI and somewhere to persist the result, and all three belong to the host.

- **Authorize URL** — https://accounts.google.com/o/oauth2/v2/auth
- **Token URL** — https://oauth2.googleapis.com/token
- **Scopes** — `https://www.googleapis.com/auth/gmail.readonly`
- **Access token lifetime** — 3600 seconds (1 hours). A host that never refreshes works all afternoon and is broken by morning.

**One consent grant, shared** (`grant: "google"`). Every connector declaring the same grant can run on ONE OAuth client, with one consent and one refresh token per person.

- **Authorize with** `access_type=offline`, `include_granted_scopes=true`. Ask for a feature's scopes when it is first used; the new token covers every scope granted before. A refresh token comes back only on the FIRST exchange, so keep the stored one when an exchange returns none.
- **Revoke** — POST https://oauth2.googleapis.com/revoke with `token`. **It removes the WHOLE grant**: every connector sharing it, not only this one. A per-feature disconnect stops using that feature's scopes locally; only a full disconnect revokes.
- **Identify the account by `sub`**: request `openid`, then verify the token response's id_token (issuer `https://accounts.google.com` or `accounts.google.com`, keys at https://www.googleapis.com/oauth2/v3/certs, audience = `clientId`). Never key a connection by email.
- **Restricted scopes**: `https://www.googleapis.com/auth/gmail.readonly`. Verification is per OAuth client, so sharing one client with the rest of the grant puts every feature behind the provider's restricted-scope assessment; a separate client keeps it on this connector alone.

The refresh tokens do **not** rotate: the same one is reusable, so a refresh may safely be retried and may run concurrently. Stated rather than assumed, because the opposite — a provider that spends the token and revokes the grant on a replay — looks identical until it happens.

### The estate

**Gmail Inbox has no test estate, and somebody checked.** Everything this connector does is real. Use the faker to build against it.

> Gmail has no sandbox. Every read reaches the connected account's real mail. The faker is the only way to develop against it without touching a real mailbox.

## What it can do

### Actions

#### `history_list` — List Gmail mailbox history

List what changed in a mailbox since a history id: messages added or deleted, labels added or removed.

`GET /gmail/v1/users/{userId}/history` · reads only — safe to replay

| Input | Required | What it is |
|---|---|---|
| `userId` | yes | `me` is the connected account and is almost always what you want. |
| `startHistoryId` | yes | Changes AFTER this id. Take it from a watch, a message, or a previous list's historyId. Out of Gmail's range (typically older than a week) it answers 404. |
| `historyTypes` | no | Blank: every kind. messageAdded is new mail (and sent mail and drafts, unless a label narrows it). |
| `labelId` | no | Only messages with this label, e.g. INBOX for received mail. |
| `maxResults` | no | Gmail's own maximum is 500. |
| `pageToken` | no | From a previous page's nextPageToken. |

#### `label_list` — List Gmail labels

List every label on the mailbox, system and user-created.

`GET /gmail/v1/users/{userId}/labels` · reads only — safe to replay

| Input | Required | What it is |
|---|---|---|
| `userId` | yes | Mailbox |

#### `mailbox_stop` — Stop watching a Gmail mailbox

Turn off push notifications for a mailbox.

`POST /gmail/v1/users/{userId}/stop` · idempotent — safe to replay

| Input | Required | What it is |
|---|---|---|
| `userId` | yes | `me` is the connected account and is almost always what you want. |

#### `mailbox_watch` — Watch a Gmail mailbox

Start (or renew) push notifications for a mailbox to a Cloud Pub/Sub topic.

`POST /gmail/v1/users/{userId}/watch` · idempotent — safe to replay

| Input | Required | What it is |
|---|---|---|
| `userId` | yes | `me` is the connected account and is almost always what you want. |
| `topicName` | yes | The full topic name, in YOUR app's own Google Cloud project: Google requires its project id to match the project whose OAuth client makes this call. One topic serves every mailbox. |
| `labelIds` | no | Comma-separated label ids to restrict notifications to (e.g. INBOX). Blank: every change is pushed. |
| `labelFilterBehavior` | no | Whether the labels above are the ONLY ones notified (include) or the ones NOT notified (exclude). |

#### `message_get` — Gmail message

Read one message's headers and preview. The body's plain/HTML text is NOT decoded -- see the raw payload for that.

`GET /gmail/v1/users/{userId}/messages/{id}` · reads only — safe to replay

| Input | Required | What it is |
|---|---|---|
| `userId` | yes | Mailbox |
| `id` | yes | From message_list, or another node's output. |

#### `message_list` — List Gmail messages

List message ids matching a search, newest first.

`GET /gmail/v1/users/{userId}/messages` · reads only — safe to replay

| Input | Required | What it is |
|---|---|---|
| `userId` | yes | `me` is the connected account and is almost always what you want. |
| `q` | no | Gmail's own search syntax, exactly as typed into the Gmail search box -- e.g. "from:ada@example.test has:attachment newer_than:7d". Leave blank to list everything. |
| `labelId` | no | Only messages with this label -- e.g. INBOX, or a label_list id. Gmail's own query parameter accepts several, repeated; this connector offers one for now -- combine more in the search field above instead, using Gmail's own label: search operator. |
| `includeSpamTrash` | no | Include spam and trash |
| `maxResults` | no | Gmail's own maximum is 500. |
| `pageToken` | no | From a previous page's nextPageToken. |

#### `thread_get` — Gmail thread

Read every message in a conversation thread, oldest first.

`GET /gmail/v1/users/{userId}/threads/{id}` · reads only — safe to replay

| Input | Required | What it is |
|---|---|---|
| `userId` | yes | Mailbox |
| `id` | yes | A message's threadId, from message_list or message_get. |

### Triggers

#### `message_received` — Gmail message received

Start when new mail arrives in a watched mailbox, with every new message since the last run.

A SUBSCRIPTION: Gmail Inbox delivers to your endpoint only while a subscription it issued is alive, at most 168 hours at a time. Its expiry is read from the `mailbox_watch` response (`expiration`); 86400 seconds before it, the host renews it (`mailbox_watch`). A lease that lapses is re-listed AND re-subscribed, because notifications during the gap are gone. Every delivery: the signature is verified before anything runs. The delivery only names what arrived, so the run's first step reads it: `history_list` with , published under `history`. A failed read fails the run.

**You have to set this up with the provider first:**

In YOUR app's Google Cloud project (the one owning the OAuth client): create a Pub/Sub topic, grant publish on it to gmail-api-push@system.gserviceaccount.com, and create a PUSH subscription to the route your host mounts for this trigger, with authentication on (a service account you choose; the endpoint URL as the audience). Put that audience and service account on the connection as pushAudience and pushServiceAccount, and fetch Google's signing keys for verification. Then call mailbox_watch with the topic for each mailbox and store its historyId as the trigger's cursor (startHistoryId); renew the watch daily. ONE topic serves every mailbox: route each push by its emailAddress, and only after the token verifies, to a mailbox you watched; drop an unmapped address with a 2xx. Persist cursor.next when a run succeeds. On cursor-expired or cursor-overflow, watch again for a fresh historyId FIRST, then list with message_list using the resyncQuery, and match it against the mail you already handled. This trigger never changes read state.

## Run it before you have credentials

Every operation ships a **faker**, whether or not Gmail Inbox has a sandbox. Set a
node's mode to `fake` and it returns the shape Gmail Inbox actually publishes — the
same field names, deterministically — so you can wire the downstream nodes before
touching an account, a key, or a network.

## This repository is generated

`provider/` is the source. Everything under `packages/` is emitted from it and
**must not be hand-edited** — CI regenerates and diffs on every push, and the
next protocol sync destroys anything it finds. See [`AGENTS.md`](AGENTS.md).

## Two namespaces, which do not match on purpose

The repo is `github.com/Fancy-Friends/gmail-inbox`; the packages publish under
`particle-academy`. Nothing derives one from the other — the names come from
weaver's `friends.json` and nowhere else.

## Licence

MIT.
