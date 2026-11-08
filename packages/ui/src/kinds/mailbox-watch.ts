/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/mailbox-watch.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/mailbox-watch.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Watch a Gmail mailbox — Start (or renew) push notifications for a mailbox to
 * a Cloud Pub/Sub topic.
 *
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users/watch
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { gmailInboxMeta } from "../service.js";

export const GMAIL_INBOX_MAILBOX_WATCH_KIND = "@particle-academy/gmail_inbox_mailbox_watch";
export const GMAIL_INBOX_MAILBOX_WATCH_OPERATION = "mailbox_watch";

export const GMAIL_INBOX_MAILBOX_WATCH_META = gmailInboxMeta("action", "watch a mailbox", "https://developers.google.com/workspace/gmail/api/reference/rest/v1/users/watch");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const GMAIL_INBOX_MAILBOX_WATCH_OUTPUT: OutputField[] = [
  {
    "path": "data.historyId",
    "type": "string",
    "description": "The mailbox's CURRENT history id: seed the trigger's stored cursor from it."
  },
  {
    "path": "data.expiration",
    "type": "string",
    "description": "When Gmail stops pushing, in epoch MILLISECONDS. Renew before it; Google recommends daily."
  },
  {
    "path": "mode",
    "type": "string",
    "description": "Which estate this ran against. Google has no sandbox, so: fake or live."
  }
];

export const gmailInboxMailboxWatchKind: NodeKindDefinition = defineConnectorKind(GMAIL_INBOX_MAILBOX_WATCH_META, {
  name: GMAIL_INBOX_MAILBOX_WATCH_KIND,
  aliases: ["gmail_inbox_mailbox_watch"],
  label: "Watch a Gmail mailbox",
  description: "Start (or renew) push notifications for a mailbox to a Cloud Pub/Sub topic.",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "idempotent",
  outputShape: GMAIL_INBOX_MAILBOX_WATCH_OUTPUT,
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
      "key": "topicName",
      "label": "Pub/Sub topic",
      "required": true,
      "placeholder": "projects/my-project/topics/gmail-push",
      "description": "The full topic name, in YOUR app's own Google Cloud project: Google requires its project id to match the project whose OAuth client makes this call. One topic serves every mailbox."
    },
    {
      "type": "text",
      "key": "labelIds",
      "label": "Only these labels",
      "description": "Comma-separated label ids to restrict notifications to (e.g. INBOX). Blank: every change is pushed."
    },
    {
      "type": "select",
      "key": "labelFilterBehavior",
      "label": "Label filter",
      "description": "Whether the labels above are the ONLY ones notified (include) or the ones NOT notified (exclude).",
      "options": [
        {
          "value": "include",
          "label": "Only these labels"
        },
        {
          "value": "exclude",
          "label": "Every label except these"
        }
      ]
    }
  ],
  defaultConfig: {
    "mode": "auto"
  },
  renderBody: ({ config }) =>
    summarize(GMAIL_INBOX_MAILBOX_WATCH_META, config as Record<string, unknown>, "watch a mailbox"),
});
