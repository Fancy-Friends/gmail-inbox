/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/ + triggers/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/ + triggers/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Gmail Inbox's node kinds with their TypeScript executors attached — for
 * hosts that EXECUTE on TS.
 *
 * The authoring surface in @particle-academy/gmail-inbox-ui carries no
 * executor: the editor is React on every host, so a PHP or Python project
 * installs the ui package and never this one.
 */

import type { NodeExecutor, NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import {
  idempotencyKeyFor,
  NO_IDEMPOTENCY_KEY_WARNING,
  resolveConnection,
  triggerEvent,
  type RequestedMode,
} from "@particle-academy/fancy-connector-core";
import { GMAIL_INBOX } from "./service.js";

import {
  gmailInboxHistoryListKind,
  gmailInboxLabelListKind,
  gmailInboxMailboxStopKind,
  gmailInboxMailboxWatchKind,
  gmailInboxMessageGetKind,
  gmailInboxMessageListKind,
  gmailInboxThreadGetKind,
  gmailInboxMessageReceivedTriggerKind,
} from "@particle-academy/gmail-inbox-ui";

import { gmailInboxHistoryList } from "./actions/history-list.js";
import { gmailInboxLabelList } from "./actions/label-list.js";
import { gmailInboxMailboxStop } from "./actions/mailbox-stop.js";
import { gmailInboxMailboxWatch } from "./actions/mailbox-watch.js";
import { gmailInboxMessageGet } from "./actions/message-get.js";
import { gmailInboxMessageList } from "./actions/message-list.js";
import { gmailInboxThreadGet } from "./actions/thread-get.js";
import { GMAIL_INBOX_MESSAGE_RECEIVED, readGmailInboxMessageReceivedAfter } from "./triggers/message-received.js";

export const gmailInboxHistoryListExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});

  const result = await gmailInboxHistoryList({
    config,
    input: ctx.inputs?.in,
  });

  ctx.emit({
    type: "log",
    level: "info",
    nodeId: ctx.node.id,
    message: `gmail_inbox history_list ${(result.data as { id?: string })?.id} (${result.mode})`,
  });

  return { __port: "out", value: result };
};

export const gmailInboxLabelListExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});

  const result = await gmailInboxLabelList({
    config,
    input: ctx.inputs?.in,
  });

  ctx.emit({
    type: "log",
    level: "info",
    nodeId: ctx.node.id,
    message: `gmail_inbox label_list ${(result.data as { id?: string })?.id} (${result.mode})`,
  });

  return { __port: "out", value: result };
};

export const gmailInboxMailboxStopExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});

  const result = await gmailInboxMailboxStop({
    config,
    input: ctx.inputs?.in,
  });

  ctx.emit({
    type: "log",
    level: "info",
    nodeId: ctx.node.id,
    message: `gmail_inbox mailbox_stop ${(result.data as { id?: string })?.id} (${result.mode})`,
  });

  return { __port: "out", value: result };
};

export const gmailInboxMailboxWatchExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});

  const result = await gmailInboxMailboxWatch({
    config,
    input: ctx.inputs?.in,
  });

  ctx.emit({
    type: "log",
    level: "info",
    nodeId: ctx.node.id,
    message: `gmail_inbox mailbox_watch ${(result.data as { id?: string })?.id} (${result.mode})`,
  });

  return { __port: "out", value: result };
};

export const gmailInboxMessageGetExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});

  const result = await gmailInboxMessageGet({
    config,
    input: ctx.inputs?.in,
  });

  ctx.emit({
    type: "log",
    level: "info",
    nodeId: ctx.node.id,
    message: `gmail_inbox message_get ${(result.data as { id?: string })?.id} (${result.mode})`,
  });

  return { __port: "out", value: result };
};

export const gmailInboxMessageListExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});

  const result = await gmailInboxMessageList({
    config,
    input: ctx.inputs?.in,
  });

  ctx.emit({
    type: "log",
    level: "info",
    nodeId: ctx.node.id,
    message: `gmail_inbox message_list ${(result.data as { id?: string })?.id} (${result.mode})`,
  });

  return { __port: "out", value: result };
};

export const gmailInboxThreadGetExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});

  const result = await gmailInboxThreadGet({
    config,
    input: ctx.inputs?.in,
  });

  ctx.emit({
    type: "log",
    level: "info",
    nodeId: ctx.node.id,
    message: `gmail_inbox thread_get ${(result.data as { id?: string })?.id} (${result.mode})`,
  });

  return { __port: "out", value: result };
};

export const gmailInboxMessageReceivedTriggerExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});
  const connection = resolveConnection({
    service: GMAIL_INBOX.service,
    operation: "message_received",
    sandbox: GMAIL_INBOX.sandbox,
    baseUrls: GMAIL_INBOX.baseUrls,
    requires: GMAIL_INBOX.requires,
    connectionId: typeof config.connection === "string" ? config.connection : null,
    requested: typeof config.mode === "string" ? (config.mode as RequestedMode) : null,
  });

  const event = triggerEvent(GMAIL_INBOX_MESSAGE_RECEIVED, connection, ctx.inputs?.in, config);

  // The run's FIRST step: `history_list` from the cursor the HOST stored
  // (`startHistoryId`), every page of it, published with the cursor the
  // host persists once the run succeeds. A lapsed or overflowing cursor
  // fails the run BY NAME, carrying the bounded resync.
  const value = await readGmailInboxMessageReceivedAfter(event, config);

  return { __port: "out", value };
};

/** A dotted path into a delivery; undefined wherever it stops. */
function at(value: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (v, key) => (v !== null && typeof v === "object" ? (v as Record<string, unknown>)[key] : undefined),
    value,
  );
}

/** The kinds a TypeScript host registers. */
export const GMAIL_INBOX_RUNNABLE_KINDS: NodeKindDefinition[] = [
  { ...gmailInboxHistoryListKind, executor: gmailInboxHistoryListExecutor },
  { ...gmailInboxLabelListKind, executor: gmailInboxLabelListExecutor },
  { ...gmailInboxMailboxStopKind, executor: gmailInboxMailboxStopExecutor },
  { ...gmailInboxMailboxWatchKind, executor: gmailInboxMailboxWatchExecutor },
  { ...gmailInboxMessageGetKind, executor: gmailInboxMessageGetExecutor },
  { ...gmailInboxMessageListKind, executor: gmailInboxMessageListExecutor },
  { ...gmailInboxThreadGetKind, executor: gmailInboxThreadGetExecutor },
  { ...gmailInboxMessageReceivedTriggerKind, executor: gmailInboxMessageReceivedTriggerExecutor },
];
