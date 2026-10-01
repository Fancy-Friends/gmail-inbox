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
 * Gmail message — Read one message's headers and preview. The body's
 * plain/HTML text is NOT decoded -- see the raw payload for that.
 *
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/get
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { gmailInboxMeta } from "../service.js";

export const GMAIL_INBOX_MESSAGE_GET_KIND = "@particle-academy/gmail_inbox_message_get";
export const GMAIL_INBOX_MESSAGE_GET_OPERATION = "message_get";

export const GMAIL_INBOX_MESSAGE_GET_META = gmailInboxMeta("action", "read a message", "https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/get");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const GMAIL_INBOX_MESSAGE_GET_OUTPUT: OutputField[] = [
  {
    "path": "data.id",
    "type": "string",
    "description": "The message id."
  },
  {
    "path": "data.threadId",
    "type": "string",
    "description": "The thread this message belongs to."
  },
  {
    "path": "data.labelIds",
    "type": "array",
    "description": "System and user label ids currently on this message."
  },
  {
    "path": "data.snippet",
    "type": "string",
    "description": "Gmail's own short plain-text preview of the body -- a few hundred characters, not the whole message."
  },
  {
    "path": "data.internalDate",
    "type": "string",
    "description": "Unix epoch MILLISECONDS, as a string -- when Gmail received it, which can differ from the Date header."
  },
  {
    "path": "data.payload.headers",
    "type": "array",
    "description": "Every RFC 2822 header as { name, value }, unparsed. From/To/Subject/Date live here."
  },
  {
    "path": "data.payload",
    "type": "unknown",
    "description": "The full MIME tree, raw -- mimeType, body (base64url in body.data for a leaf part), and nested parts for a multipart message. Decode it yourself for plain-text or HTML content; this connector does not flatten it."
  },
  {
    "path": "mode",
    "type": "string",
    "description": "Which estate this ran against. Google has no sandbox, so: fake or live."
  }
];

export const gmailInboxMessageGetKind: NodeKindDefinition = defineConnectorKind(GMAIL_INBOX_MESSAGE_GET_META, {
  name: GMAIL_INBOX_MESSAGE_GET_KIND,
  aliases: ["gmail_inbox_message_get"],
  label: "Gmail message",
  description: "Read one message's headers and preview. The body's plain/HTML text is NOT decoded -- see the raw payload for that.",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "none",
  outputShape: GMAIL_INBOX_MESSAGE_GET_OUTPUT,
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
      "label": "Message ID",
      "required": true,
      "description": "From message_list, or another node's output."
    }
  ],
  defaultConfig: {
    "mode": "auto"
  },
  renderBody: ({ config }) =>
    summarize(GMAIL_INBOX_MESSAGE_GET_META, config as Record<string, unknown>, "read a message"),
});
