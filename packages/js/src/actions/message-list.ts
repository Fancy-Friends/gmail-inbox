/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/message-list.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/message-list.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * List message ids matching a search, newest first.
 *
 * GET /gmail/v1/users/{userId}/messages —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list
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

export const MESSAGE_LIST_OPERATION = "message_list";

export type MessageListOptions = {
  /** The node's resolved config. Keys: userId, q, labelId, includeSpamTrash, maxResults, pageToken. */
  config: Record<string, unknown>;
  credentials?: Record<string, string | undefined>;
  mode?: RequestedMode;
  connectionId?: string | null;
  input?: unknown;
  attempts?: number;
  /** Override the transport. The only way to exercise this without a network. */
  transport?: Transport;
};

export async function gmailInboxMessageList(options: MessageListOptions): Promise<ConnectorResult> {
  const config = options.config ?? {};

  if (config.userId === undefined || config.userId === null || config.userId === "") {
    throw new Error(`message_list: "userId" is required (Mailbox).`);
  }

  {
    const n = Number(config.maxResults);
    const given = config.maxResults !== undefined && config.maxResults !== null && config.maxResults !== "";
    if (given && !(Number.isInteger(n) && n >= 1 && n <= 500)) {
      throw new Error(
        `message_list: "maxResults" must be a integer, got ${JSON.stringify(config.maxResults)}.`,
      );
    }
  }

  return callConnector(GMAIL_INBOX, {
    operation: MESSAGE_LIST_OPERATION,
    config,
    input: options.input,
    ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
    ...(options.mode === undefined ? {} : { mode: options.mode }),
    ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
    ...(options.attempts === undefined ? {} : { attempts: options.attempts }),
    ...(options.transport === undefined ? {} : { transport: options.transport }),
    request: {
      method: "GET",
      path: `/gmail/v1/users/${encodeURIComponent(String(config.userId))}/messages`,
      query: {
        ...(config.q !== undefined && config.q !== null && config.q !== "" ? { "q": String(config.q) } : {}),
        ...(config.labelId !== undefined && config.labelId !== null && config.labelId !== "" ? { "labelIds": String(config.labelId) } : {}),
        ...(config.includeSpamTrash !== undefined && config.includeSpamTrash !== null && config.includeSpamTrash !== "" ? { "includeSpamTrash": Boolean(config.includeSpamTrash) } : {}),
        "maxResults": config.maxResults !== undefined && config.maxResults !== null && config.maxResults !== "" ? Math.trunc(Number(config.maxResults)) : 100,
        ...(config.pageToken !== undefined && config.pageToken !== null && config.pageToken !== "" ? { "pageToken": String(config.pageToken) } : {}),
      },
    },
  });
}
