# Changelog — Gmail Inbox

All four packages — `@particle-academy/gmail-inbox-ui`, `@particle-academy/gmail-inbox-js`,
`particle-academy/gmail-inbox-php` and `fancy-gmail-inbox` — are released together
under one version. They are generated from one `provider/` definition, so a
change to it changes all four, and separate version lines would only record
which of the four somebody remembered to bump.

**Write entries HERE**, in the weaver envelope at `providers/gmail-inbox/CHANGELOG.md`,
then regenerate. This file is the one thing in a release that cannot be
derived — somebody has to write what changed — but writing it in the
provider repo would be a hand-edit that `.weaver.json` flags and the next
sync destroys.

## [0.4.0] — 2026-11-08

### Added

- **One Google consent grant, shared by every Google connector** (`oauth.grant:
  "google"`), for an org-level Google connection: one OAuth client, one consent
  and one refresh token per person, with each feature's scopes asked for when it
  is first used. Declared in the manifest, the `-ui` package's OAuth constant,
  the README and the registry index:
  - `authorizeParams`: `access_type=offline` and `include_granted_scopes=true`.
    A refresh token comes back only on the FIRST code exchange, so keep the stored
    one when an exchange returns none.
  - `revoke`: POST `https://oauth2.googleapis.com/revoke` with `token`, and
    `scope: "grant"`. **Revoking removes the person's WHOLE Google grant, every
    Google connector**, so a per-feature disconnect stops using that feature's
    scopes locally and only a full Google disconnect revokes.
  - `identity`: identify the account by the id_token's `sub` (request `openid`;
    issuer `https://accounts.google.com` or `accounts.google.com`; audience is
    the `clientId`), never by email, which Google says is neither unique nor
    permanent.
  `restrictedScopes` is `gmail.readonly`: Google verifies per OAuth client, so
  sharing one client with the other Google connectors puts every feature behind
  the annual CASA assessment, and a separate client keeps it here alone. The
  `clientId` help now states that trade-off instead of forbidding a shared client.

  Nothing a request sends has changed; this is what a host needs to run the
  connection.

## [0.3.0] — 2026-11-08

### Added

- **Laravel integration, in this package** (`src/Laravel/`), auto-discovered
  through composer's `extra.laravel`. Laravel is SUGGESTED, never required:
  outside a Laravel app none of it loads.
  - a service provider that merges `config/gmail-inbox.php` under
    `connectors.gmail-inbox` (credentials from the environment, or per call for a
    multi-account app);
  - the `GmailInbox` facade: `GmailInbox::call('<operation>', [...])` runs any action;
  - `GmailInbox::fake()`, answered from the connector's faker, with
    `assertSent` / `assertNotSent` / `assertNothingSent` / `assertSentCount`;
  - a webhook ROUTE per trigger (`Route::gmailInboxMessageReceived('/path')`) that VERIFIES the raw delivery with the trigger's own scheme before the app sees it, answers 401 with the reason when it does not, then dispatches an event (`Events\\…Received`);
  - its own Pest test of all of it against a booted Laravel app.

### Changed

- **Tests: Pest `^5`**, and `laravel/framework` `^13` as a DEV-ONLY test
  dependency (the framework this package integrates with; nothing ships in
  `require`).

## [0.2.0] — 2026-11-08

### Added

- **`message_received`: a trigger for new Gmail mail, still read-only**
  (`gmail.readonly` is the only scope). `mailbox_watch` makes Gmail publish
  mailbox changes to a Cloud Pub/Sub topic in YOUR app's own Google Cloud
  project, and a push subscription delivers each change to your host.
  - **Every push is verified before anything reads it.** It carries a
    Google-signed token in `Authorization`, checked for Google's issuer, the
    subscription's audience (`pushAudience`), and the push service account
    with `email_verified` true (`pushServiceAccount`). The service-account
    check is what refuses a stranger's subscription aimed at your URL.
  - **Routing.** The Pub/Sub envelope is unwrapped, then the push is routed by
    `emailAddress`, only after verification. One topic serves every mailbox.
  - **What arrives.** A push carries only the mailbox's NEW position, so the
    trigger reads `history.list` from the cursor YOUR HOST stored. It reads
    every page and publishes the changes under `history` with `cursor: {used,
    next}`. Your host persists `cursor.next` when a run succeeds.
  - **Received mail only, by default:** `labelId: INBOX` and `historyTypes:
    messageAdded`, so no sent mail or drafts. Widen either in the trigger's
    config.
  - **A lapsed cursor** (Gmail's 404) or more than 20 pages fails by name, as
    `cursor-expired` or `cursor-overflow`. Each carries a bounded resync query
    (`newer_than:7d`; `resyncWindowDays` sets it, default 7). Watch again
    first, then list with that query. The mailbox is never fully re-pulled.
  - **The watch is a lease:** Gmail's `expiration` is in epoch milliseconds,
    renewed by watching again, a day early. Google requires at least once
    every 7 days and recommends daily.
  - **Read state is never changed.**

  New actions: `mailbox_watch`, `mailbox_stop` and `history_list`. New
  credentials: `pushAudience` and `pushServiceAccount`, needed only for the
  trigger. Requires fancy-connector-core 0.14.0.

## [0.1.0] — 2026-10-01

### Added

- **First release.** `message_list` (search, label filter, pagination),
  `message_get`, `thread_get`, `label_list`. OAuth2 with `gmail.readonly`.
- **A SEPARATE connector from `gmail`, by design, not a scope widening of
  it.** `gmail.readonly` is a RESTRICTED Google OAuth scope requiring an
  annual CASA security assessment on the app that requests it, and
  Google's verification is per OAUTH CLIENT — attaching it to `gmail`'s
  own client would have put the recurring assessment on every existing
  send-only consumer. A second connector, a second OAuth client, puts it
  only where it is actually needed. Part of the owner's Google Workspace
  commission (Tynn #19) — Fancy's own compliance audit found this before
  any code was written, and the split was decided before this connector
  existed.
- `message_get` and `thread_get` publish `payload.headers` (From, To,
  Subject, Date, unparsed) and Gmail's own `snippet` preview, but do NOT
  decode the MIME body tree — `payload.parts` can nest arbitrarily for a
  multipart message, and flattening it to plain text/HTML is real parsing
  work this connector does not do yet. The raw `payload` is still
  published for a host that wants to decode it. Noted rather than
  rushed, the same shape as Drive's deferred file upload.
- Gmail has no sandbox — every read reaches the connected account's real
  mailbox. The faker is the only way to develop against it without doing
  that.
