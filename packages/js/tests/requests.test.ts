/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */

/**
 * What Gmail Inbox actually receives.
 *
 * Every assertion below is about the request rather than the response, and
 * none of it touches the network: the transport is a stub that records what it
 * was handed.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { PreparedRequest } from "@particle-academy/fancy-connector-core";

import { gmailInboxLabelList } from "../src/actions/label-list.js";
import { gmailInboxMessageGet } from "../src/actions/message-get.js";
import { gmailInboxMessageList } from "../src/actions/message-list.js";
import { gmailInboxThreadGet } from "../src/actions/thread-get.js";

/** Capture the prepared request instead of sending it. */
function capture() {
  const seen: PreparedRequest[] = [];

  return {
    seen,
    transport: async (request: PreparedRequest) => {
      seen.push(request);

      return { status: 200, body: JSON.stringify({ id: "captured" }), headers: {} };
    },
  };
}

const CREDENTIALS = {
  "clientId": "test_clientId",
  "clientSecret": "test_clientSecret",
  "accessToken": "test_accessToken",
  "refreshToken": "test_refreshToken"
};

test("label_list sends GET /gmail/v1/users/{userId}/labels", async () => {
  const { seen, transport } = capture();

  await gmailInboxLabelList({
    config: {
      "userId": "example-userId"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen.length, 1);
  assert.equal(seen[0]!.method, "GET");
  assert.ok(new URL(seen[0]!.url).pathname.endsWith("/gmail/v1/users/example-userId/labels"), seen[0]!.url);

  assert.deepEqual(
    Object.fromEntries(new URL(seen[0]!.url).searchParams),
    {},
  );
});

test("message_get sends GET /gmail/v1/users/{userId}/messages/{id}", async () => {
  const { seen, transport } = capture();

  await gmailInboxMessageGet({
    config: {
      "userId": "example-userId",
      "id": "example-id"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen.length, 1);
  assert.equal(seen[0]!.method, "GET");
  assert.ok(new URL(seen[0]!.url).pathname.endsWith("/gmail/v1/users/example-userId/messages/example-id"), seen[0]!.url);

  assert.deepEqual(
    Object.fromEntries(new URL(seen[0]!.url).searchParams),
    {
      "format": "full"
    },
  );
});

test("message_list sends GET /gmail/v1/users/{userId}/messages", async () => {
  const { seen, transport } = capture();

  await gmailInboxMessageList({
    config: {
      "userId": "example-userId",
      "q": "example-q",
      "labelId": "example-labelId",
      "includeSpamTrash": true,
      "maxResults": 500,
      "pageToken": "example-pageToken"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen.length, 1);
  assert.equal(seen[0]!.method, "GET");
  assert.ok(new URL(seen[0]!.url).pathname.endsWith("/gmail/v1/users/example-userId/messages"), seen[0]!.url);

  assert.deepEqual(
    Object.fromEntries(new URL(seen[0]!.url).searchParams),
    {
      "q": "example-q",
      "labelIds": "example-labelId",
      "includeSpamTrash": "true",
      "maxResults": "500",
      "pageToken": "example-pageToken"
    },
  );
});

test("thread_get sends GET /gmail/v1/users/{userId}/threads/{id}", async () => {
  const { seen, transport } = capture();

  await gmailInboxThreadGet({
    config: {
      "userId": "example-userId",
      "id": "example-id"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen.length, 1);
  assert.equal(seen[0]!.method, "GET");
  assert.ok(new URL(seen[0]!.url).pathname.endsWith("/gmail/v1/users/example-userId/threads/example-id"), seen[0]!.url);

  assert.deepEqual(
    Object.fromEntries(new URL(seen[0]!.url).searchParams),
    {
      "format": "full"
    },
  );
});

test("the credential is placed the way the provider wants it", async () => {
  const { seen, transport } = capture();

  await gmailInboxLabelList({
    config: {
      "userId": "example-userId"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen[0]!.headers.Authorization, "Bearer test_accessToken");
});

test("a missing required field is refused BEFORE anything is sent", async () => {
  // Nothing was attempted, so there is nothing to classify — and the message names
  // the field, rather than letting the provider answer three frames later with
  // "invalid request".
  const { seen, transport } = capture();

  await assert.rejects(
    gmailInboxLabelList({
      config: {},
      credentials: CREDENTIALS,
      mode: "live",
      transport,
    }),
    new RegExp("userId"),
  );

  assert.equal(seen.length, 0, "the request must not have been sent");
});
