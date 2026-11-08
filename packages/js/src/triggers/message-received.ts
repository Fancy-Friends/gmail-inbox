/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/triggers/message-received.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/triggers/message-received.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Gmail Inbox's subscription trigger — the delivery contract.
 *
 * Kept beside the service descriptor rather than inside a node, because the
 * way a delivery is verified is a fact about GMAIL INBOX. Two Gmail Inbox
 * triggers must not be able to disagree about how a delivery is verified.
 *
 * A SUBSCRIPTION: Gmail Inbox stops delivering unless somebody renews it,
 * forever, and if nobody does the workflow stops firing with no error
 * anywhere. The lease below says where the expiry is read from and how early
 * to renew; the host runs ONE renewal scheduler for every expiring trigger.
 */

import { decodeDelivery, verifyDelivery, type DeliveryDecode, type InboundDelivery, type Jwk, type LeaseDeclaration, type OidcJwtScheme, readWithCursor, type CursorReadSpec, type Transport, type TriggerDescriptor, type WebhookVerification } from "@particle-academy/fancy-connector-core";
import { gmailInboxFaker } from "../faker.js";
import { gmailInboxHistoryList } from "../actions/history-list.js";

/**
 * How Gmail Inbox's push is authenticated: a bearer token in `Authorization`,
 * signed by the provider, whose issuer must be one of these and whose
 * principal claim must EQUAL the service account the host configured. The
 * keys, the audience and the principal are the HOST's, passed to verify.
 */
export const GMAIL_INBOX_MESSAGE_RECEIVED_OIDC_SCHEME: OidcJwtScheme = {
  kind: "oidc-jwt",
  header: "Authorization",
  issuers: ["https://accounts.google.com", "accounts.google.com"],
  principalClaim: "email",
  verifiedClaim: "email_verified",
};

/**
 * The lease this subscription carries: where the provider's expiry sits in the
 * `mailbox_watch` response (`expiration`, epoch-ms), how early the host
 * renews, and what it calls when the lease is due. The host builds the value
 * with the core's `leaseFromResponse` and runs one scheduler for every
 * expiring trigger.
 */
export const GMAIL_INBOX_MESSAGE_RECEIVED_LEASE: LeaseDeclaration = {
  expiresAtFrom: "expiration",
  expiresAtUnit: "epoch-ms",
  renewBeforeSeconds: 86400,
  renewOperation: "mailbox_watch",
};

/**
 * Which of this package's actions create, renew and stop the subscription.
 * `renew` is null where the provider cannot renew and the host calls create
 * again — after stopping the old one, and after re-listing, because
 * notifications during the gap are gone.
 */
export const GMAIL_INBOX_MESSAGE_RECEIVED_SUBSCRIPTION = { create: "mailbox_watch", renew: "mailbox_watch", stop: "mailbox_stop" } as const;

export const GMAIL_INBOX_MESSAGE_RECEIVED_DECODE: DeliveryDecode = {
  kind: "pubsub-push",
};

export const GMAIL_INBOX_MESSAGE_RECEIVED: TriggerDescriptor = {
  service: "gmail_inbox",
  operation: "message_received",
  delivery: "subscription",
  setup:
    "In YOUR app's Google Cloud project (the one owning the OAuth client): create a Pub/Sub topic, grant publish on it to gmail-api-push@system.gserviceaccount.com, and create a PUSH subscription to the route your host mounts for this trigger, with authentication on (a service account you choose; the endpoint URL as the audience). Put that audience and service account on the connection as pushAudience and pushServiceAccount, and fetch Google's signing keys for verification. Then call mailbox_watch with the topic for each mailbox and store its historyId as the trigger's cursor (startHistoryId); renew the watch daily. ONE topic serves every mailbox: route each push by its emailAddress, and only after the token verifies, to a mailbox you watched; drop an unmapped address with a 2xx. Persist cursor.next when a run succeeds. On cursor-expired or cursor-overflow, watch again for a fresh historyId FIRST, then list with message_list using the resyncQuery, and match it against the mail you already handled. This trigger never changes read state.",
  subscriptionTtl: 604800,
  lease: GMAIL_INBOX_MESSAGE_RECEIVED_LEASE,
  verification: {
    scheme: GMAIL_INBOX_MESSAGE_RECEIVED_OIDC_SCHEME,
  },
  decode: GMAIL_INBOX_MESSAGE_RECEIVED_DECODE,
  route: { by: "emailAddress", path: "data.emailAddress" },
  faker: gmailInboxFaker,
};

/**
 * Where the follow-up read's cursor goes and comes from. The HOST stores it:
 * seeded from the `mailbox_watch` response's `historyId`, advanced to
 * `cursor.next` after each successful run, and filled into this trigger's
 * config on every run.
 */
export const GMAIL_INBOX_MESSAGE_RECEIVED_CURSOR: CursorReadSpec = {
  param: "startHistoryId",
  advanceFrom: "historyId",
  page: { param: "pageToken", from: "nextPageToken", collect: "history", maxPages: 20 },
  expiredStatus: 404,
};

/**
 * Read what changed since the HOST's stored cursor: `history_list` from
 * `config.startHistoryId`, every page, `history` concatenated, published under
 * `history` with `cursor: {used, next}`. Persist `cursor.next` once the run
 * succeeds. A lapsed cursor (cursor-expired) or too many pages
 * (cursor-overflow) is refused BY NAME with the bounded resync query, and a
 * missing one (cursor-missing) calls nothing. In fake mode with no stored
 * cursor the read is faked from a placeholder, so the node runs on a canvas.
 */
export async function readGmailInboxMessageReceivedAfter(
  event: unknown,
  config: Record<string, unknown>,
  options: { credentials?: Record<string, string | undefined>; transport?: Transport } = {},
): Promise<Record<string, unknown>> {
  const stored = config.startHistoryId ?? (config.mode === "fake" ? "1" : undefined);
  const read = await readWithCursor(
    GMAIL_INBOX_MESSAGE_RECEIVED_CURSOR,
    stored,
    async (params) => {
      const result = await gmailInboxHistoryList({
        config: {
          userId: "me",
          maxResults: 100,
          ...(config.connection === undefined || config.connection === null ? {} : { connection: config.connection }),
          ...(config.mode === undefined || config.mode === null ? {} : { mode: config.mode }),
          labelId: config.labelId ?? "INBOX",
          historyTypes: config.historyTypes ?? "messageAdded",
          ...params,
        },
        input: event,
        ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
        ...(options.transport === undefined ? {} : { transport: options.transport }),
      });

      return result.data;
    },
    { resyncQuery: `newer_than:${String(config.resyncWindowDays ?? 7)}d` },
  );

  return {
    ...(event !== null && typeof event === "object" ? (event as Record<string, unknown>) : {}),
    history: read.data,
    cursor: read.cursor,
  };
}

/**
 * Verify one inbound Gmail Inbox delivery.
 *
 * The host calls this BEFORE starting a run. The body proves nothing here: the
 * delivery is authenticated by the bearer token in its header. `keys` are the
 * provider's signing keys (its JWKS `keys`), fetched and cached by the HOST;
 * nothing in this package fetches them. `pushAudience` and
 * `pushServiceAccount` are the connection's, and both are REQUIRED: an
 * unchecked audience accepts every token the provider signs for anyone, and an
 * unchecked principal accepts a stranger's subscription aimed at your URL. Any
 * of the three missing refuses every delivery.
 */
export function verifyGmailInboxDelivery(
  delivery: InboundDelivery,
  expected: { keys: readonly Jwk[]; pushAudience: string | undefined; pushServiceAccount: string | undefined },
  now?: number,
): Promise<WebhookVerification> {
  return verifyDelivery(GMAIL_INBOX_MESSAGE_RECEIVED, delivery, undefined, now, {
    keys: expected.keys,
    audience: expected.pushAudience ?? null,
    principal: expected.pushServiceAccount ?? null,
  });
}

/**
 * Read one VERIFIED Gmail Inbox delivery.
 *
 * The body is not plain JSON: it is pubsub-push, the provider's envelope,
 * unwrapped to the message it carries. The host calls this AFTER
 * `verifyGmailInboxDelivery` has accepted the delivery, with the SAME raw
 * bytes, and starts the run with what it returns. A body that cannot be read
 * is refused by name, never passed on.
 */
export function decodeGmailInboxDelivery(raw: Uint8Array | string): unknown {
  return decodeDelivery(GMAIL_INBOX_MESSAGE_RECEIVED_DECODE, raw);
}
