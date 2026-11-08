/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/fixtures/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/fixtures/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * The golden fixtures.
 *
 * Deterministic on purpose: the same seed produces the same bytes in
 * TypeScript, PHP and Python, so this file and its twins in the other packages
 * assert the SAME values. That turns the faker into a parity test rather than
 * a convenience — which matters, because cross-runtime drift does not fail
 * loudly. It completes, down one path, with no error.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { fakeRequest } from "@particle-academy/fancy-connector-core";

import { gmailInboxFaker } from "../src/faker.js";

test("history_list fakes the shape Gmail Inbox publishes", () => {
  const config = {};

  const faked = gmailInboxFaker("history_list", fakeRequest("gmail_inbox", "history_list", config));

  assert.deepEqual(faked, {
    "history": [
      {
        "id": "1234567891",
        "messagesAdded": [
          {
            "message": {
              "id": "c54cffbc0dd10ec1",
              "threadId": "ad2e20654d742a74",
              "labelIds": [
                "INBOX",
                "UNREAD"
              ]
            }
          }
        ]
      }
    ],
    "historyId": "1234567891"
  });
});

test("label_list fakes the shape Gmail Inbox publishes", () => {
  const config = {};

  const faked = gmailInboxFaker("label_list", fakeRequest("gmail_inbox", "label_list", config));

  assert.deepEqual(faked, {
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
  });
});

test("mailbox_stop fakes the shape Gmail Inbox publishes", () => {
  const config = {};

  const faked = gmailInboxFaker("mailbox_stop", fakeRequest("gmail_inbox", "mailbox_stop", config));

  assert.deepEqual(faked, {});
});

test("mailbox_watch fakes the shape Gmail Inbox publishes", () => {
  const config = {};

  const faked = gmailInboxFaker("mailbox_watch", fakeRequest("gmail_inbox", "mailbox_watch", config));

  assert.deepEqual(faked, {
    "historyId": "1234567890",
    "expiration": "1767312000000"
  });
});

test("message_get fakes the shape Gmail Inbox publishes", () => {
  const config = {};

  const faked = gmailInboxFaker("message_get", fakeRequest("gmail_inbox", "message_get", config));

  assert.deepEqual(faked, {
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
  });
});

test("message_list fakes the shape Gmail Inbox publishes", () => {
  const config = {};

  const faked = gmailInboxFaker("message_list", fakeRequest("gmail_inbox", "message_list", config));

  assert.deepEqual(faked, {
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
  });
});

test("thread_get fakes the shape Gmail Inbox publishes", () => {
  const config = {};

  const faked = gmailInboxFaker("thread_get", fakeRequest("gmail_inbox", "thread_get", config));

  assert.deepEqual(faked, {
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
  });
});

test("message_received fakes the shape Gmail Inbox publishes", () => {
  const config = {
    "resyncWindowDays": 7,
    "labelId": "INBOX",
    "historyTypes": "messageAdded"
  };

  const faked = gmailInboxFaker("message_received", fakeRequest("gmail_inbox", "message_received", config));

  assert.deepEqual(faked, {
    "subscription": "projects/my-project/subscriptions/gmail-push",
    "messageId": "3998444640442585",
    "publishTime": "2026-11-08T09:00:00.000Z",
    "attributes": {},
    "deliveryAttempt": null,
    "data": {
      "emailAddress": "user@example.test",
      "historyId": 1234567891
    }
  });
});

test("an operation with no fixture throws rather than inventing a shape", () => {
  assert.throws(() => gmailInboxFaker("no_such_operation", fakeRequest("gmail_inbox", "no_such_operation", {})), /no fake response/);
});
