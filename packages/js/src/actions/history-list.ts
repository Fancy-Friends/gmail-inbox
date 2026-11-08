/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/history-list.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/history-list.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * List what changed in a mailbox since a history id: messages added or
 * deleted, labels added or removed.
 *
 * GET /gmail/v1/users/{userId}/history —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list
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

export const HISTORY_LIST_OPERATION = "history_list";

export type HistoryListOptions = {
  /** The node's resolved config. Keys: userId, startHistoryId, historyTypes, labelId, maxResults, pageToken. */
  config: Record<string, unknown>;
  credentials?: Record<string, string | undefined>;
  mode?: RequestedMode;
  connectionId?: string | null;
  input?: unknown;
  attempts?: number;
  /** Override the transport. The only way to exercise this without a network. */
  transport?: Transport;
};

export async function gmailInboxHistoryList(options: HistoryListOptions): Promise<ConnectorResult> {
  const config = options.config ?? {};

  if (config.userId === undefined || config.userId === null || config.userId === "") {
    throw new Error(`history_list: "userId" is required (Mailbox).`);
  }

  if (config.startHistoryId === undefined || config.startHistoryId === null || config.startHistoryId === "") {
    throw new Error(`history_list: "startHistoryId" is required (Start history id).`);
  }

  {
    const n = Number(config.maxResults);
    const given = config.maxResults !== undefined && config.maxResults !== null && config.maxResults !== "";
    if (given && !(Number.isInteger(n) && n >= 1 && n <= 500)) {
      throw new Error(
        `history_list: "maxResults" must be a integer, got ${JSON.stringify(config.maxResults)}.`,
      );
    }
  }

  return callConnector(GMAIL_INBOX, {
    operation: HISTORY_LIST_OPERATION,
    config,
    input: options.input,
    ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
    ...(options.mode === undefined ? {} : { mode: options.mode }),
    ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
    ...(options.attempts === undefined ? {} : { attempts: options.attempts }),
    ...(options.transport === undefined ? {} : { transport: options.transport }),
    request: {
      method: "GET",
      path: `/gmail/v1/users/${encodeURIComponent(String(config.userId))}/history`,
      query: {
        "startHistoryId": String(config.startHistoryId),
        ...(config.historyTypes !== undefined && config.historyTypes !== null && config.historyTypes !== "" ? { "historyTypes": String(config.historyTypes) } : {}),
        ...(config.labelId !== undefined && config.labelId !== null && config.labelId !== "" ? { "labelId": String(config.labelId) } : {}),
        "maxResults": config.maxResults !== undefined && config.maxResults !== null && config.maxResults !== "" ? Math.trunc(Number(config.maxResults)) : 100,
        ...(config.pageToken !== undefined && config.pageToken !== null && config.pageToken !== "" ? { "pageToken": String(config.pageToken) } : {}),
      },
    },
  });
}
