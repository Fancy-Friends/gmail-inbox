/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/manifest.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/manifest.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * Gmail Inbox's node kinds for fancy-flow.
 *
 * Install this on every host. The TypeScript executors live in the js
 * package's `./flow` subpath; PHP and Python hosts run their own and need only
 * this.
 */

export * from "./service.js";
export * from "./kinds/label-list.js";
export * from "./kinds/message-get.js";
export * from "./kinds/message-list.js";
export * from "./kinds/thread-get.js";

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { gmailInboxLabelListKind } from "./kinds/label-list.js";
import { gmailInboxMessageGetKind } from "./kinds/message-get.js";
import { gmailInboxMessageListKind } from "./kinds/message-list.js";
import { gmailInboxThreadGetKind } from "./kinds/thread-get.js";

/** Every Gmail Inbox kind, for a host that registers the lot. */
export const GMAIL_INBOX_KINDS: NodeKindDefinition[] = [
  gmailInboxLabelListKind,
  gmailInboxMessageGetKind,
  gmailInboxMessageListKind,
  gmailInboxThreadGetKind,
];
