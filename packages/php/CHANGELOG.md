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
