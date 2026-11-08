/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/mailbox-stop.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/mailbox-stop.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Stop watching a Gmail mailbox — Turn off push notifications for a mailbox.
 *
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users/stop
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { gmailInboxMeta } from "../service.js";

export const GMAIL_INBOX_MAILBOX_STOP_KIND = "@particle-academy/gmail_inbox_mailbox_stop";
export const GMAIL_INBOX_MAILBOX_STOP_OPERATION = "mailbox_stop";

export const GMAIL_INBOX_MAILBOX_STOP_META = gmailInboxMeta("action", "stop watching", "https://developers.google.com/workspace/gmail/api/reference/rest/v1/users/stop");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const GMAIL_INBOX_MAILBOX_STOP_OUTPUT: OutputField[] = [
  {
    "path": "mode",
    "type": "string",
    "description": "Which estate this ran against. Google has no sandbox, so: fake or live."
  }
];

export const gmailInboxMailboxStopKind: NodeKindDefinition = defineConnectorKind(GMAIL_INBOX_MAILBOX_STOP_META, {
  name: GMAIL_INBOX_MAILBOX_STOP_KIND,
  aliases: ["gmail_inbox_mailbox_stop"],
  label: "Stop watching a Gmail mailbox",
  description: "Turn off push notifications for a mailbox.",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "idempotent",
  outputShape: GMAIL_INBOX_MAILBOX_STOP_OUTPUT,
  configSchema: [
    {
      "type": "text",
      "key": "userId",
      "label": "Mailbox",
      "required": true,
      "default": "me",
      "description": "`me` is the connected account and is almost always what you want."
    }
  ],
  defaultConfig: {
    "mode": "auto"
  },
  renderBody: ({ config }) =>
    summarize(GMAIL_INBOX_MAILBOX_STOP_META, config as Record<string, unknown>, "stop watching"),
});
