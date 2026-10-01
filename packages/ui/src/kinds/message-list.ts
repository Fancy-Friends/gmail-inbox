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
 * List Gmail messages — List message ids matching a search, newest first.
 *
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { gmailInboxMeta } from "../service.js";

export const GMAIL_INBOX_MESSAGE_LIST_KIND = "@particle-academy/gmail_inbox_message_list";
export const GMAIL_INBOX_MESSAGE_LIST_OPERATION = "message_list";

export const GMAIL_INBOX_MESSAGE_LIST_META = gmailInboxMeta("action", "list messages", "https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const GMAIL_INBOX_MESSAGE_LIST_OUTPUT: OutputField[] = [
  {
    "path": "data.messages",
    "type": "array",
    "description": "Each row is { id, threadId } only. Read a message's content with message_get."
  },
  {
    "path": "data.nextPageToken",
    "type": "string",
    "description": "Present when there is another page."
  },
  {
    "path": "data.resultSizeEstimate",
    "type": "number",
    "description": "Gmail's own word for it: an ESTIMATE, not an exact count."
  },
  {
    "path": "mode",
    "type": "string",
    "description": "Which estate this ran against. Google has no sandbox, so: fake or live."
  }
];

export const gmailInboxMessageListKind: NodeKindDefinition = defineConnectorKind(GMAIL_INBOX_MESSAGE_LIST_META, {
  name: GMAIL_INBOX_MESSAGE_LIST_KIND,
  aliases: ["gmail_inbox_message_list"],
  label: "List Gmail messages",
  description: "List message ids matching a search, newest first.",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "none",
  outputShape: GMAIL_INBOX_MESSAGE_LIST_OUTPUT,
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
      "key": "q",
      "label": "Search",
      "description": "Gmail's own search syntax, exactly as typed into the Gmail search box -- e.g. \"from:ada@example.test has:attachment newer_than:7d\". Leave blank to list everything."
    },
    {
      "type": "text",
      "key": "labelId",
      "label": "Label ID",
      "description": "Only messages with this label -- e.g. INBOX, or a label_list id. Gmail's own query parameter accepts several, repeated; this connector offers one for now -- combine more in the search field above instead, using Gmail's own label: search operator."
    },
    {
      "type": "switch",
      "key": "includeSpamTrash",
      "label": "Include spam and trash",
      "default": false
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
    summarize(GMAIL_INBOX_MESSAGE_LIST_META, config as Record<string, unknown>, "list messages"),
});
