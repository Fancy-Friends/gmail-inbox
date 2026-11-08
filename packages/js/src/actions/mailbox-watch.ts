/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/mailbox-watch.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/mailbox-watch.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Start (or renew) push notifications for a mailbox to a Cloud Pub/Sub topic.
 *
 * POST /gmail/v1/users/{userId}/watch —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users/watch
 *
 * Notice what is NOT here: no key, no base URL, no mode check, no retry loop,
 * no fake/real branch. This describes the request; callConnector resolves the
 * connection, picks the estate, and either calls Gmail Inbox or calls the
 * faker.
 */

import {
  callConnector,
  type ConnectorResult,
  type RequestedMode,
  type Transport,
} from "@particle-academy/fancy-connector-core";
import { GMAIL_INBOX } from "../service.js";

export const MAILBOX_WATCH_OPERATION = "mailbox_watch";

export type MailboxWatchOptions = {
  /** The node's resolved config. Keys: userId, topicName, labelIds, labelFilterBehavior. */
  config: Record<string, unknown>;
  credentials?: Record<string, string | undefined>;
  mode?: RequestedMode;
  connectionId?: string | null;
  input?: unknown;
  attempts?: number;
  /** Override the transport. The only way to exercise this without a network. */
  transport?: Transport;
};

export async function gmailInboxMailboxWatch(options: MailboxWatchOptions): Promise<ConnectorResult> {
  const config = options.config ?? {};

  if (config.userId === undefined || config.userId === null || config.userId === "") {
    throw new Error(`mailbox_watch: "userId" is required (Mailbox).`);
  }

  if (config.topicName === undefined || config.topicName === null || config.topicName === "") {
    throw new Error(`mailbox_watch: "topicName" is required (Pub/Sub topic).`);
  }

  return callConnector(GMAIL_INBOX, {
    operation: MAILBOX_WATCH_OPERATION,
    config,
    input: options.input,
    ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
    ...(options.mode === undefined ? {} : { mode: options.mode }),
    ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
    ...(options.attempts === undefined ? {} : { attempts: options.attempts }),
    ...(options.transport === undefined ? {} : { transport: options.transport }),
    request: {
      method: "POST",
      path: `/gmail/v1/users/${encodeURIComponent(String(config.userId))}/watch`,
      json: {
        "topicName": String(config.topicName).trim(),
        ...(config.labelIds !== undefined && config.labelIds !== null && config.labelIds !== "" ? { "labelIds": labelidsList(config.labelIds) } : {}),
        ...(config.labelFilterBehavior !== undefined && config.labelFilterBehavior !== null && config.labelFilterBehavior !== "" ? { "labelFilterBehavior": String(config.labelFilterBehavior) } : {}),
      },
    },
  });
}

/** One value, a ","-separated string, or an array — all end up a list. */
function labelidsList(value: unknown): string[] {
  const items = Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(",")
      : [];

  return items.map((item) => item.trim()).filter(Boolean);
}
