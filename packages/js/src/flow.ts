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
  gmailInboxLabelListKind,
  gmailInboxMessageGetKind,
  gmailInboxMessageListKind,
  gmailInboxThreadGetKind,
} from "@particle-academy/gmail-inbox-ui";

import { gmailInboxLabelList } from "./actions/label-list.js";
import { gmailInboxMessageGet } from "./actions/message-get.js";
import { gmailInboxMessageList } from "./actions/message-list.js";
import { gmailInboxThreadGet } from "./actions/thread-get.js";

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

/** The kinds a TypeScript host registers. */
export const GMAIL_INBOX_RUNNABLE_KINDS: NodeKindDefinition[] = [
  { ...gmailInboxLabelListKind, executor: gmailInboxLabelListExecutor },
  { ...gmailInboxMessageGetKind, executor: gmailInboxMessageGetExecutor },
  { ...gmailInboxMessageListKind, executor: gmailInboxMessageListExecutor },
  { ...gmailInboxThreadGetKind, executor: gmailInboxThreadGetExecutor },
];
