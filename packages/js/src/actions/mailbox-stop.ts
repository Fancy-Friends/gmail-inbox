/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/mailbox-stop.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/mailbox-stop.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Turn off push notifications for a mailbox.
 *
 * POST /gmail/v1/users/{userId}/stop —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users/stop
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

export const MAILBOX_STOP_OPERATION = "mailbox_stop";

export type MailboxStopOptions = {
  /** The node's resolved config. Keys: userId. */
  config: Record<string, unknown>;
  credentials?: Record<string, string | undefined>;
  mode?: RequestedMode;
  connectionId?: string | null;
  input?: unknown;
  attempts?: number;
  /** Override the transport. The only way to exercise this without a network. */
  transport?: Transport;
};

export async function gmailInboxMailboxStop(options: MailboxStopOptions): Promise<ConnectorResult> {
  const config = options.config ?? {};

  if (config.userId === undefined || config.userId === null || config.userId === "") {
    throw new Error(`mailbox_stop: "userId" is required (Mailbox).`);
  }

  return callConnector(GMAIL_INBOX, {
    operation: MAILBOX_STOP_OPERATION,
    config,
    input: options.input,
    ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
    ...(options.mode === undefined ? {} : { mode: options.mode }),
    ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
    ...(options.attempts === undefined ? {} : { attempts: options.attempts }),
    ...(options.transport === undefined ? {} : { transport: options.transport }),
    request: {
      method: "POST",
      path: `/gmail/v1/users/${encodeURIComponent(String(config.userId))}/stop`,
      json: {},
    },
  });
}
