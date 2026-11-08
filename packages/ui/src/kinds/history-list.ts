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
 * List Gmail mailbox history — List what changed in a mailbox since a history
 * id: messages added or deleted, labels added or removed.
 *
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { gmailInboxMeta } from "../service.js";

export const GMAIL_INBOX_HISTORY_LIST_KIND = "@particle-academy/gmail_inbox_history_list";
export const GMAIL_INBOX_HISTORY_LIST_OPERATION = "history_list";

export const GMAIL_INBOX_HISTORY_LIST_META = gmailInboxMeta("action", "list mailbox history", "https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const GMAIL_INBOX_HISTORY_LIST_OUTPUT: OutputField[] = [
  {
    "path": "data.history",
    "type": "array",
    "description": "History records, oldest first. Each has an id and messagesAdded / messagesDeleted / labelsAdded / labelsRemoved; a message there carries only id and threadId: read its content with message_get."
  },
  {
    "path": "data.historyId",
    "type": "string",
    "description": "The mailbox's CURRENT history id. Store it as the next start ONLY when there is no nextPageToken."
  },
  {
    "path": "data.nextPageToken",
    "type": "string",
    "description": "Present when there is another page."
  },
  {
    "path": "mode",
    "type": "string",
    "description": "Which estate this ran against. Google has no sandbox, so: fake or live."
  }
];

export const gmailInboxHistoryListKind: NodeKindDefinition = defineConnectorKind(GMAIL_INBOX_HISTORY_LIST_META, {
  name: GMAIL_INBOX_HISTORY_LIST_KIND,
  aliases: ["gmail_inbox_history_list"],
  label: "List Gmail mailbox history",
  description: "List what changed in a mailbox since a history id: messages added or deleted, labels added or removed.",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "none",
  outputShape: GMAIL_INBOX_HISTORY_LIST_OUTPUT,
  configSchema: [
    {
      "type": "text",
      "key": "userId",
      "label": "Mailbox",
      "required": true,
      "default": "me",
      "description": "`me` is the connected account and is almost always what you want."
    },
    {
      "type": "text",
      "key": "startHistoryId",
      "label": "Start history id",
      "required": true,
      "description": "Changes AFTER this id. Take it from a watch, a message, or a previous list's historyId. Out of Gmail's range (typically older than a week) it answers 404."
    },
    {
      "type": "select",
      "key": "historyTypes",
      "label": "Only this kind of change",
      "description": "Blank: every kind. messageAdded is new mail (and sent mail and drafts, unless a label narrows it).",
      "options": [
        {
          "value": "messageAdded",
          "label": "Messages added"
        },
        {
          "value": "messageDeleted",
          "label": "Messages deleted"
        },
        {
          "value": "labelAdded",
          "label": "Labels added"
        },
        {
          "value": "labelRemoved",
          "label": "Labels removed"
        }
      ]
    },
    {
      "type": "text",
      "key": "labelId",
      "label": "Only this label",
      "description": "Only messages with this label, e.g. INBOX for received mail."
    },
    {
      "type": "number",
      "key": "maxResults",
      "label": "Page size",
      "min": 1,
      "max": 500,
      "default": 100,
      "description": "Gmail's own maximum is 500."
    },
    {
      "type": "text",
      "key": "pageToken",
      "label": "Page token",
      "description": "From a previous page's nextPageToken."
    }
  ],
  defaultConfig: {
    "mode": "auto"
  },
  renderBody: ({ config }) =>
    summarize(GMAIL_INBOX_HISTORY_LIST_META, config as Record<string, unknown>, "list mailbox history"),
});
