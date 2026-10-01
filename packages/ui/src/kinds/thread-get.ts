/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/thread-get.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/thread-get.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Gmail thread — Read every message in a conversation thread, oldest first.
 *
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/get
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { gmailInboxMeta } from "../service.js";

export const GMAIL_INBOX_THREAD_GET_KIND = "@particle-academy/gmail_inbox_thread_get";
export const GMAIL_INBOX_THREAD_GET_OPERATION = "thread_get";

export const GMAIL_INBOX_THREAD_GET_META = gmailInboxMeta("action", "read a thread", "https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/get");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const GMAIL_INBOX_THREAD_GET_OUTPUT: OutputField[] = [
  {
    "path": "data.id",
    "type": "string",
    "description": "The thread id."
  },
  {
    "path": "data.historyId",
    "type": "string",
    "description": "Gmail's change-tracking cursor as of this read."
  },
  {
    "path": "data.messages",
    "type": "array",
    "description": "Every message in the thread, oldest first, each shaped like message_get's output."
  },
  {
    "path": "mode",
    "type": "string",
    "description": "Which estate this ran against. Google has no sandbox, so: fake or live."
  }
];

export const gmailInboxThreadGetKind: NodeKindDefinition = defineConnectorKind(GMAIL_INBOX_THREAD_GET_META, {
  name: GMAIL_INBOX_THREAD_GET_KIND,
  aliases: ["gmail_inbox_thread_get"],
  label: "Gmail thread",
  description: "Read every message in a conversation thread, oldest first.",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "none",
  outputShape: GMAIL_INBOX_THREAD_GET_OUTPUT,
  configSchema: [
    {
      "type": "text",
      "key": "userId",
      "label": "Mailbox",
      "required": true,
      "default": "me"
    },
    {
      "type": "text",
      "key": "id",
      "label": "Thread ID",
      "required": true,
      "description": "A message's threadId, from message_list or message_get."
    }
  ],
  defaultConfig: {
    "mode": "auto"
  },
  renderBody: ({ config }) =>
    summarize(GMAIL_INBOX_THREAD_GET_META, config as Record<string, unknown>, "read a thread"),
});
