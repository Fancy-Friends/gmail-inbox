/*
 * Gmail Inbox — the published npm packages.
 *
 * GENERATED — do not edit. Fix weaver's template/ and regenerate.
 *
 * This runs against the PUBLISHED package, installed by name from the
 * registry into a project that has never seen this repo. Every other test
 * here imports from ../src and therefore cannot see the packaging.
 */

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { gmailInboxFaker } from "@particle-academy/gmail-inbox-js";
import { GMAIL_INBOX_KINDS } from "@particle-academy/gmail-inbox-ui";
import { fakeRequest } from "@particle-academy/fancy-connector-core";

/*
 * WHERE did that come from?
 *
 * Node resolves a bare specifier from the importing MODULE's directory, not
 * the working directory. So running this script across from a checkout
 * resolves out of the REPO's node_modules and silently tests the source
 * again — which it did, and passed, before CI caught it.
 *
 * Two things are checked, because neither is enough alone: that the package
 * came from an INSTALL rather than from source, and that this script is not
 * sitting inside the provider repo it is supposed to be testing.
 */
const resolved = import.meta.resolve("@particle-academy/gmail-inbox-js");
const here = dirname(fileURLToPath(import.meta.url));

assert.ok(
  !existsSync(join(here, "..", "packages", "js", "package.json")),
  `${here} is inside the provider repo, so a bare import resolves the repo's ` +
    "own node_modules. Copy this script into a project that installed the " +
    "published package and run it there.",
);
assert.match(resolved, /node_modules/, `resolved ${resolved}, which is not an installed package`);
console.log(`  ok   resolved from ${resolved}`);

const GOLDENS = [
  {
    "operation": "label_list",
    "config": {},
    "expected": {
      "labels": [
        {
          "id": "INBOX",
          "name": "INBOX",
          "type": "system"
        },
        {
          "id": "UNREAD",
          "name": "UNREAD",
          "type": "system"
        },
        {
          "id": "IMPORTANT",
          "name": "IMPORTANT",
          "type": "system",
          "messagesTotal": 412,
          "messagesUnread": 18,
          "threadsTotal": 203,
          "threadsUnread": 11
        },
        {
          "id": "Label_fake_807796d5270c",
          "name": "Design Reviews",
          "type": "user",
          "messageListVisibility": "show",
          "labelListVisibility": "labelShow",
          "messagesTotal": 27,
          "messagesUnread": 2,
          "threadsTotal": 9,
          "threadsUnread": 1
        }
      ]
    }
  },
  {
    "operation": "message_get",
    "config": {},
    "expected": {
      "id": "460c5b2c605e0e98",
      "threadId": "9026959e103bee54",
      "labelIds": [
        "INBOX",
        "UNREAD",
        "IMPORTANT"
      ],
      "snippet": "Hi Ada, just confirming the design review is still on for Thursday at 2pm. Let me know if...",
      "internalDate": "1790712000000",
      "payload": {
        "mimeType": "text/plain",
        "headers": [
          {
            "name": "From",
            "value": "Grace Hopper <grace@example.test>"
          },
          {
            "name": "To",
            "value": "Ada Lovelace <ada@example.test>"
          },
          {
            "name": "Subject",
            "value": "Re: Design review Thursday"
          },
          {
            "name": "Date",
            "value": "Tue, 29 Sep 2026 14:03:00 -0400"
          }
        ],
        "body": {
          "size": 612,
          "data": "base64url_body_fake_d3da4d2cd58f"
        }
      }
    }
  },
  {
    "operation": "message_list",
    "config": {},
    "expected": {
      "messages": [
        {
          "id": "77c068f12110c65e",
          "threadId": "02b84cd36f670102"
        },
        {
          "id": "67a7d2812300333a",
          "threadId": "898b50a9905e2da6"
        }
      ],
      "resultSizeEstimate": 2
    }
  },
  {
    "operation": "thread_get",
    "config": {},
    "expected": {
      "id": "c13ba48400c4b471",
      "historyId": "2162600385",
      "messages": [
        {
          "id": "2589b47f73cde27c",
          "labelIds": [
            "INBOX",
            "IMPORTANT"
          ],
          "snippet": "Hey team, scheduling the Q3 design review for Thursday at 2pm. Conference room B...",
          "internalDate": "1790625600000",
          "payload": {
            "mimeType": "text/plain",
            "headers": [
              {
                "name": "From",
                "value": "Ada Lovelace <ada@example.test>"
              },
              {
                "name": "To",
                "value": "Grace Hopper <grace@example.test>"
              },
              {
                "name": "Subject",
                "value": "Design review Thursday"
              },
              {
                "name": "Date",
                "value": "Mon, 28 Sep 2026 09:00:00 -0400"
              }
            ],
            "body": {
              "size": 540,
              "data": "base64url_body_fake_3fc2b21d59a5"
            }
          }
        },
        {
          "id": "274fe178b77115c8",
          "labelIds": [
            "INBOX",
            "UNREAD",
            "IMPORTANT"
          ],
          "snippet": "Hi Ada, just confirming the design review is still on for Thursday at 2pm. Let me know if...",
          "internalDate": "1790712000000",
          "payload": {
            "mimeType": "text/plain",
            "headers": [
              {
                "name": "From",
                "value": "Grace Hopper <grace@example.test>"
              },
              {
                "name": "To",
                "value": "Ada Lovelace <ada@example.test>"
              },
              {
                "name": "Subject",
                "value": "Re: Design review Thursday"
              },
              {
                "name": "Date",
                "value": "Tue, 29 Sep 2026 14:03:00 -0400"
              }
            ],
            "body": {
              "size": 612,
              "data": "base64url_body_fake_2cc3baac2954"
            }
          }
        }
      ]
    }
  }
];

for (const { operation, config, expected } of GOLDENS) {
  const faked = gmailInboxFaker(operation, fakeRequest("gmail_inbox", operation, config));

  assert.deepEqual(
    faked,
    expected,
    `the PUBLISHED package produced different bytes for ${operation} than the repo does`,
  );
  console.log(`  ok   ${operation}`);
}

// The ui package is a separate tarball, and js depends on it by its
// published name — so this also proves that dependency resolves.
assert.equal(GMAIL_INBOX_KINDS.length, 4);
for (const kind of GMAIL_INBOX_KINDS) {
  const keys = kind.configSchema.map((field) => field.key);
  assert.equal(keys[0], "connection");
  assert.equal(keys[1], "mode");
  assert.ok(kind.outputShape.length > 0, `${kind.name} declares no output shape`);
}
console.log(`  ok   ui kinds resolve from ${"@particle-academy/gmail-inbox-ui"}`);

console.log(`\n  ${GOLDENS.length} operations verified against the published packages.`);
