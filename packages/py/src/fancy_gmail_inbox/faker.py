# GENERATED FILE — do not edit.
#
# Emitted from provider/fixtures/ by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/fixtures/ (or weaver's template/) and regenerate:
#
# npm run provider -- gmail_inbox

"""The Gmail Inbox faker.

Bit-for-bit identical to the TypeScript and PHP fakers: the same FNV-1a seed
and the same xorshift32 sequence, so a golden fixture asserts the exact
faked payload and ALL THREE runtimes have to produce it. That turns the
faker into a parity test rather than a convenience — which matters, because
cross-runtime drift does not fail loudly. It completes, down one path, with
no error.
"""

from __future__ import annotations

from typing import Any

from ._fake import FakeValues


def _as_number(value: Any) -> float | None:
    """The coercion an `"as": "integer" | "number"` config binding uses: a value
    that IS a number, never int(float(...))'s uncaught ValueError on one that
    merely looks like text (a text field's auto-generated example, before an
    author has typed a real one).
    """
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _label_list(config: dict[str, Any], fake: FakeValues) -> Any:
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
    }


def _message_get(config: dict[str, Any], fake: FakeValues) -> Any:
    return {
        "id": (str(_v) if (_v := config.get("id")) is not None and _v != "" else fake.hex(16)),
        "threadId": fake.hex(16),
        "labelIds": [
            "INBOX",
            "UNREAD",
            "IMPORTANT",
        ],
        "snippet": (
                       "Hi Ada, just confirming the design review is still on for Thursday "
                       "at 2pm. Let me know if..."
                   ),
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
    }


def _message_list(config: dict[str, Any], fake: FakeValues) -> Any:
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
    }


def _thread_get(config: dict[str, Any], fake: FakeValues) -> Any:
    return {
        "id": (str(_v) if (_v := config.get("id")) is not None and _v != "" else fake.hex(16)),
        "historyId": "".join(str(fake.int(0, 9)) for _ in range(10)),
        "messages": [
            {
                "id": fake.hex(16),
                "labelIds": [
                    "INBOX",
                    "IMPORTANT",
                ],
                "snippet": (
                               "Hey team, scheduling the Q3 design review for Thursday at "
                               "2pm. Conference room B..."
                           ),
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
                "snippet": (
                               "Hi Ada, just confirming the design review is still on for "
                               "Thursday at 2pm. Let me know if..."
                           ),
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
    }


def respond(operation: str, request: dict[str, Any]) -> Any:
    """Dispatch to the fixture for one operation."""
    config: dict[str, Any] = request.get("config") or {}
    fake: FakeValues = request["fake"]

    if operation == "label_list":
        return _label_list(config, fake)

    if operation == "message_get":
        return _message_get(config, fake)

    if operation == "message_list":
        return _message_list(config, fake)

    if operation == "thread_get":
        return _thread_get(config, fake)

    # A faker asked for an operation it has no shape for must SAY so. Making
    # something up would produce a green run whose output silently has none of
    # the fields the author is about to reference.
    raise ValueError(
        f'gmail_inbox: no fake response is defined for "{operation}". '
        "Add a fixture under provider/fixtures/ and regenerate — a connector without a faker "
        "cannot be developed against, tested, or demonstrated."
    )
