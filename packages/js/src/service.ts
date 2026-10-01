/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/manifest.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/manifest.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Gmail Inbox, as one service descriptor shared by every Gmail Inbox
 * operation.
 *
 * @particle-academy/fancy-connector-core carries what is true of ALL
 * connectors. This carries what is true of Gmail Inbox: its base URL, its auth
 * scheme, its idempotency header, and its faker.
 *
 * ## The sandbox trap, written down where it is used
 *
 * Gmail has no sandbox. Every read reaches the connected account's real mail.
 * The faker is the only way to develop against it without touching a real
 * mailbox.
 */

import type { ConnectorMode, PreparedRequest, ServiceDescriptor } from "@particle-academy/fancy-connector-core";

import { gmailInboxFaker } from "./faker.js";

/**
 * The connector API version this package was GENERATED against.
 *
 * A literal, never imported. An imported constant lets an upgrade rewrite the
 * very claim it exists to detect, after which the copy agrees with itself
 * forever.
 */
export const CONNECTOR_API_VERSION = 1;

export const GMAIL_INBOX_BASE_URLS = {
  "live": "https://gmail.googleapis.com"
} as const;

/** Credential keys a remote call cannot proceed without. */
export const GMAIL_INBOX_REQUIRES = [
  "accessToken",
  "refreshToken",
  "clientId",
  "clientSecret"
] as const;

/**
 * Apply Gmail Inbox's auth scheme to an outgoing request.
 *
 *
 *
 * The mode is passed in because for some providers auth and estate are the
 * same decision expressed in the URL; here it is unused, and saying so is
 * cheaper than wondering later whether it was forgotten.
 */
export function gmailInboxAuthorize(
  credentials: Record<string, string | undefined>,
  request: PreparedRequest,
  _mode: ConnectorMode,
): void {
  request.headers.Authorization = `Bearer ${credentials.accessToken ?? ""}`;
}

/** The Gmail Inbox service, for the TypeScript runtime. */
export const GMAIL_INBOX: ServiceDescriptor = {
  service: "gmail_inbox",
  title: "Gmail Inbox",
  sandbox: "none",
  baseUrls: { ...GMAIL_INBOX_BASE_URLS },
  requires: [...GMAIL_INBOX_REQUIRES],
  authorize: gmailInboxAuthorize,
  faker: gmailInboxFaker,
};
