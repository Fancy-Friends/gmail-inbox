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
 * The Gmail Inbox faker.
 *
 * Shapes, not behaviour: the goal is that a downstream node sees the field
 * NAMES Gmail Inbox actually publishes, so an author can wire {{ $json.data.id
 * }} against a fake and have it keep working against the real thing.
 *
 * Deterministic — same inputs, same output. A faker returning a fresh uuid
 * every call cannot be asserted on, so its fixtures degrade to "it did not
 * throw", which is the assertion that catches nothing.
 */

import type { ConnectorFaker, FakeRequest } from "@particle-academy/fancy-connector-core";

function fakeLabelList({ config, fake }: FakeRequest): unknown {
  return {
    "labels": [
      {
        "id": "INBOX",
        "name": "INBOX",
        "type": "system",
      },
      {
        "id": "UNREAD",
        "name": "UNREAD",
        "type": "system",
      },
      {
        "id": "IMPORTANT",
        "name": "IMPORTANT",
        "type": "system",
        "messagesTotal": 412,
        "messagesUnread": 18,
        "threadsTotal": 203,
        "threadsUnread": 11,
      },
      {
        "id": fake.id("Label"),
        "name": "Design Reviews",
        "type": "user",
        "messageListVisibility": "show",
        "labelListVisibility": "labelShow",
        "messagesTotal": 27,
        "messagesUnread": 2,
        "threadsTotal": 9,
        "threadsUnread": 1,
      },
    ],
  };
}

function fakeMessageGet({ config, fake }: FakeRequest): unknown {
  return {
    "id": (config.id !== undefined && config.id !== null && config.id !== "" ? String(config.id) : fake.hex(16)),
    "threadId": fake.hex(16),
    "labelIds": [
      "INBOX",
      "UNREAD",
      "IMPORTANT",
    ],
    "snippet": "Hi Ada, just confirming the design review is still on for Thursday at 2pm. Let me know if...",
    "internalDate": "1790712000000",
    "payload": {
      "mimeType": "text/plain",
      "headers": [
        {
          "name": "From",
          "value": "Grace Hopper <grace@example.test>",
        },
        {
          "name": "To",
          "value": "Ada Lovelace <ada@example.test>",
        },
        {
          "name": "Subject",
          "value": "Re: Design review Thursday",
        },
        {
          "name": "Date",
          "value": "Tue, 29 Sep 2026 14:03:00 -0400",
        },
      ],
      "body": {
        "size": 612,
        "data": fake.id("base64url_body"),
      },
    },
  };
}

function fakeMessageList({ config, fake }: FakeRequest): unknown {
  return {
    "messages": [
      {
        "id": fake.hex(16),
        "threadId": fake.hex(16),
      },
      {
        "id": fake.hex(16),
        "threadId": fake.hex(16),
      },
    ],
    "resultSizeEstimate": 2,
  };
}

function fakeThreadGet({ config, fake }: FakeRequest): unknown {
  return {
    "id": (config.id !== undefined && config.id !== null && config.id !== "" ? String(config.id) : fake.hex(16)),
    "historyId": Array.from({ length: 10 }, () => fake.int(0, 9)).join(""),
    "messages": [
      {
        "id": fake.hex(16),
        "labelIds": [
          "INBOX",
          "IMPORTANT",
        ],
        "snippet": "Hey team, scheduling the Q3 design review for Thursday at 2pm. Conference room B...",
        "internalDate": "1790625600000",
        "payload": {
          "mimeType": "text/plain",
          "headers": [
            {
              "name": "From",
              "value": "Ada Lovelace <ada@example.test>",
            },
            {
              "name": "To",
              "value": "Grace Hopper <grace@example.test>",
            },
            {
              "name": "Subject",
              "value": "Design review Thursday",
            },
            {
              "name": "Date",
              "value": "Mon, 28 Sep 2026 09:00:00 -0400",
            },
          ],
          "body": {
            "size": 540,
            "data": fake.id("base64url_body"),
          },
        },
      },
      {
        "id": fake.hex(16),
        "labelIds": [
          "INBOX",
          "UNREAD",
          "IMPORTANT",
        ],
        "snippet": "Hi Ada, just confirming the design review is still on for Thursday at 2pm. Let me know if...",
        "internalDate": "1790712000000",
        "payload": {
          "mimeType": "text/plain",
          "headers": [
            {
              "name": "From",
              "value": "Grace Hopper <grace@example.test>",
            },
            {
              "name": "To",
              "value": "Ada Lovelace <ada@example.test>",
            },
            {
              "name": "Subject",
              "value": "Re: Design review Thursday",
            },
            {
              "name": "Date",
              "value": "Tue, 29 Sep 2026 14:03:00 -0400",
            },
          ],
          "body": {
            "size": 612,
            "data": fake.id("base64url_body"),
          },
        },
      },
    ],
  };
}

export const gmailInboxFaker: ConnectorFaker = (operation, request) => {
  switch (operation) {
    case "label_list":
      return fakeLabelList(request);

    case "message_get":
      return fakeMessageGet(request);

    case "message_list":
      return fakeMessageList(request);

    case "thread_get":
      return fakeThreadGet(request);

    default:
      // A faker asked for an operation it has no shape for must SAY so. Making
      // something up would produce a green run whose output silently has none
      // of the fields the author is about to reference.
      throw new Error(
        `gmail_inbox: no fake response is defined for "${operation}". ` +
          "Add a fixture under provider/fixtures/ and regenerate — a connector without a faker " +
          "cannot be developed against, tested, or demonstrated.",
      );
  }
};
