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

### Credentials

A Gmail Inbox connection holds 4 values.

**Two kinds of value, and mixing them up matters.** A `provider` credential is ONE value for the whole installation — an OAuth app's client secret serves every connected account. An `account` credential is one per connected account. A host that stores the second where it stores the first lets one account's credentials reach another's.

| Field | Scope | Secret | Where it comes from |
|---|---|---|---|
| **OAuth client ID** | per installation | not secret | A DIFFERENT OAuth app than `gmail`'s, from Google Cloud Console -> APIs & Services -> Credentials. This one requests a restricted scope and carries Google's annual CASA assessment; `gmail`'s does not. Do not reuse the same client for both. |
| **OAuth client secret** | per installation | **secret** | The client secret for the same OAuth app. One value for the whole installation. |
| **Access token** | per connected account | **secret** | Per connected Google account, and it expires after ONE HOUR. The host refreshes it with the refresh token. |
| **Refresh token** | per connected account | **secret** | Per connected Google account. Google issues one only when the consent request asks for offline access; without it the connection dies within the hour. |

### Authorising

Gmail Inbox uses OAuth2 (authorization_code). The package DECLARES the exchange; the HOST performs it — a consent screen needs a browser, a redirect URI and somewhere to persist the result, and all three belong to the host.

- **Authorize URL** — https://accounts.google.com/o/oauth2/v2/auth
- **Token URL** — https://oauth2.googleapis.com/token
- **Scopes** — `https://www.googleapis.com/auth/gmail.readonly`
- **Access token lifetime** — 3600 seconds (1 hours). A host that never refreshes works all afternoon and is broken by morning.

The refresh tokens do **not** rotate: the same one is reusable, so a refresh may safely be retried and may run concurrently. Stated rather than assumed, because the opposite — a provider that spends the token and revokes the grant on a replay — looks identical until it happens.

### The estate

**Gmail Inbox has no test estate, and somebody checked.** Everything this connector does is real. Use the faker to build against it.

> Gmail has no sandbox. Every read reaches the connected account's real mail. The faker is the only way to develop against it without touching a real mailbox.

## What it can do

### Actions

#### `label_list` — List Gmail labels

List every label on the mailbox, system and user-created.

`GET /gmail/v1/users/{userId}/labels` · reads only — safe to replay

| Input | Required | What it is |
|---|---|---|
| `userId` | yes | Mailbox |

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
