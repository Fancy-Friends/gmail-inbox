/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/triggers/message-received.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/triggers/message-received.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Gmail message received — Start when new mail arrives in a watched mailbox,
 * with every new message since the last run.
 *
 * https://developers.google.com/workspace/gmail/api/guides/push
 *
 * Delivery: subscription. In YOUR app's Google Cloud project (the one owning
 * the OAuth client): create a Pub/Sub topic, grant publish on it to
 * gmail-api-push@system.gserviceaccount.com, and create a PUSH subscription to
 * the route your host mounts for this trigger, with authentication on (a
 * service account you choose; the endpoint URL as the audience). Put that
 * audience and service account on the connection as pushAudience and
 * pushServiceAccount, and fetch Google's signing keys for verification. Then
 * call mailbox_watch with the topic for each mailbox and store its historyId
 * as the trigger's cursor (startHistoryId); renew the watch daily. ONE topic
 * serves every mailbox: route each push by its emailAddress, and only after
 * the token verifies, to a mailbox you watched; drop an unmapped address with
 * a 2xx. Persist cursor.next when a run succeeds. On cursor-expired or
 * cursor-overflow, watch again for a fresh historyId FIRST, then list with
 * message_list using the resyncQuery, and match it against the mail you
 * already handled. This trigger never changes read state.
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { gmailInboxMeta } from "../service.js";

export const GMAIL_INBOX_MESSAGE_RECEIVED_TRIGGER_KIND = "@particle-academy/gmail_inbox_message_received_trigger";
export const GMAIL_INBOX_MESSAGE_RECEIVED_TRIGGER_OPERATION = "message_received";

export const GMAIL_INBOX_MESSAGE_RECEIVED_TRIGGER_META = gmailInboxMeta("trigger", "new mail", "https://developers.google.com/workspace/gmail/api/guides/push");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const GMAIL_INBOX_MESSAGE_RECEIVED_TRIGGER_OUTPUT: OutputField[] = [
  {
    "path": "messageId",
    "type": "string",
    "description": "Pub/Sub's id for this push. The same push may be delivered more than once."
  },
  {
    "path": "publishTime",
    "type": "string",
    "description": "When Pub/Sub published it."
  },
  {
    "path": "data.emailAddress",
    "type": "string",
    "description": "The mailbox. The ONLY routing key, and only after verification."
  },
  {
    "path": "data.historyId",
    "type": "number",
    "description": "The mailbox's new position, as Gmail pushed it. The read below starts from the STORED cursor, not this."
  },
  {
    "path": "history.history",
    "type": "array",
    "description": "Every change since the stored cursor, all pages, oldest first. New mail is history[].messagesAdded[].message {id, threadId}: read each with message_get."
  },
  {
    "path": "history.historyId",
    "type": "string",
    "description": "The mailbox's position after the read."
  },
  {
    "path": "history.nextPageToken",
    "type": "string",
    "description": "Always absent here: every page was read."
  },
  {
    "path": "cursor.used",
    "type": "string",
    "description": "The stored cursor this read started from."
  },
  {
    "path": "cursor.next",
    "type": "string",
    "description": "The cursor to store once this run succeeds (null: keep the one used)."
  }
];

export const gmailInboxMessageReceivedTriggerKind: NodeKindDefinition = defineConnectorKind(GMAIL_INBOX_MESSAGE_RECEIVED_TRIGGER_META, {
  name: GMAIL_INBOX_MESSAGE_RECEIVED_TRIGGER_KIND,
  aliases: ["gmail_inbox_message_received_trigger"],
  label: "Gmail message received",
  description: "Start when new mail arrives in a watched mailbox, with every new message since the last run.",
  inputs: [],
  outputs: [{ id: "out" }],
  sideEffects: "none",
  outputShape: GMAIL_INBOX_MESSAGE_RECEIVED_TRIGGER_OUTPUT,
  configSchema: [
    {
      "type": "text",
      "key": "startHistoryId",
      "label": "Stored cursor",
      "description": "The host fills this on every run from the cursor it stored: seeded from mailbox_watch's historyId, then cursor.next after each successful run."
    },
    {
      "type": "number",
      "key": "resyncWindowDays",
      "label": "Resync window (days)",
      "min": 1,
      "max": 30,
      "description": "How far back the host re-lists after a lapse, never the whole mailbox."
    },
    {
      "type": "text",
      "key": "labelId",
      "label": "Only this label",
      "description": "INBOX: received mail only. Blank: every label, including sent mail and drafts."
    },
    {
      "type": "select",
      "key": "historyTypes",
      "label": "Only this kind of change",
      "options": [
        {
          "value": "messageAdded",
          "label": "New messages"
        },
        {
          "value": "messageDeleted",
          "label": "Deleted messages"
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
    }
  ],
  defaultConfig: {
    "mode": "auto",
    "resyncWindowDays": 7,
    "labelId": "INBOX",
    "historyTypes": "messageAdded"
  },
  renderBody: ({ config }) =>
    summarize(GMAIL_INBOX_MESSAGE_RECEIVED_TRIGGER_META, config as Record<string, unknown>, "new mail"),
});
