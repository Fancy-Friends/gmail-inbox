/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/label-list.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/label-list.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * List Gmail labels — List every label on the mailbox, system and
 * user-created.
 *
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/list
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { gmailInboxMeta } from "../service.js";

export const GMAIL_INBOX_LABEL_LIST_KIND = "@particle-academy/gmail_inbox_label_list";
export const GMAIL_INBOX_LABEL_LIST_OPERATION = "label_list";

export const GMAIL_INBOX_LABEL_LIST_META = gmailInboxMeta("action", "list labels", "https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/list");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const GMAIL_INBOX_LABEL_LIST_OUTPUT: OutputField[] = [
  {
    "path": "data.labels",
    "type": "array",
    "description": "Each with id, name and type (system or user). messagesTotal/messagesUnread/threadsTotal/threadsUnread are part of Label's schema but not confirmed present on every list row -- read one label with labels.get if a count comes back missing."
  }
];

export const gmailInboxLabelListKind: NodeKindDefinition = defineConnectorKind(GMAIL_INBOX_LABEL_LIST_META, {
  name: GMAIL_INBOX_LABEL_LIST_KIND,
  aliases: ["gmail_inbox_label_list"],
  label: "List Gmail labels",
  description: "List every label on the mailbox, system and user-created.",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "none",
  outputShape: GMAIL_INBOX_LABEL_LIST_OUTPUT,
  configSchema: [
    {
      "type": "text",
      "key": "userId",
      "label": "Mailbox",
      "required": true,
      "default": "me"
    }
  ],
  defaultConfig: {
    "mode": "auto"
  },
  renderBody: ({ config }) =>
    summarize(GMAIL_INBOX_LABEL_LIST_META, config as Record<string, unknown>, "list labels"),
});
