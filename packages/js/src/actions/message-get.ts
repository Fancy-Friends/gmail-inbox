/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/message-get.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/message-get.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Read one message's headers and preview. The body's plain/HTML text is NOT
 * decoded -- see the raw payload for that.
 *
 * GET /gmail/v1/users/{userId}/messages/{id} —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/get
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

export const MESSAGE_GET_OPERATION = "message_get";

export type MessageGetOptions = {
  /** The node's resolved config. Keys: userId, id. */
  config: Record<string, unknown>;
  credentials?: Record<string, string | undefined>;
  mode?: RequestedMode;
  connectionId?: string | null;
  input?: unknown;
  attempts?: number;
  /** Override the transport. The only way to exercise this without a network. */
  transport?: Transport;
};

export async function gmailInboxMessageGet(options: MessageGetOptions): Promise<ConnectorResult> {
  const config = options.config ?? {};

  if (config.userId === undefined || config.userId === null || config.userId === "") {
    throw new Error(`message_get: "userId" is required (Mailbox).`);
  }

  if (config.id === undefined || config.id === null || config.id === "") {
    throw new Error(`message_get: "id" is required (Message ID).`);
  }

  return callConnector(GMAIL_INBOX, {
    operation: MESSAGE_GET_OPERATION,
    config,
    input: options.input,
    ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
    ...(options.mode === undefined ? {} : { mode: options.mode }),
    ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
    ...(options.attempts === undefined ? {} : { attempts: options.attempts }),
    ...(options.transport === undefined ? {} : { transport: options.transport }),
    request: {
      method: "GET",
      path: `/gmail/v1/users/${encodeURIComponent(String(config.userId))}/messages/${encodeURIComponent(String(config.id))}`,
      query: {
        "format": "full",
      },
    },
  });
}
