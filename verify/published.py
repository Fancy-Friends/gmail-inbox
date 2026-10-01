"""
Gmail Inbox — the published PyPI wheel.

GENERATED — do not edit. Fix weaver's template/ and regenerate.

Runs against the PUBLISHED wheel, installed by name into a fresh venv.
Every other test here imports from ../src and cannot see the packaging —
a missing py.typed or an unshipped module passes there and breaks for
every user.
"""

from importlib.metadata import requires

from fancy_gmail_inbox._fake import FakeValues, seed_for_call
from fancy_gmail_inbox.faker import respond

GOLDENS = [
    {
        "operation": "label_list",
        "config": {},
        "expected": {
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
                    "id": "Label_fake_807796d5270c",
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
        },
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
                    "data": "base64url_body_fake_d3da4d2cd58f",
                },
            },
        },
    },
    {
        "operation": "message_list",
        "config": {},
        "expected": {
            "messages": [
                {
                    "id": "77c068f12110c65e",
                    "threadId": "02b84cd36f670102",
                },
                {
                    "id": "67a7d2812300333a",
                    "threadId": "898b50a9905e2da6",
                },
            ],
            "resultSizeEstimate": 2,
        },
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
                        "IMPORTANT",
                    ],
                    "snippet": (
                                   "Hey team, scheduling the Q3 design review for Thursday "
                                   "at 2pm. Conference room B..."
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
                            "data": "base64url_body_fake_3fc2b21d59a5",
                        },
                    },
                },
                {
                    "id": "274fe178b77115c8",
                    "labelIds": [
                        "INBOX",
                        "UNREAD",
                        "IMPORTANT",
                    ],
                    "snippet": (
                                   "Hi Ada, just confirming the design review is still on "
                                   "for Thursday at 2pm. Let me know if..."
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
                            "data": "base64url_body_fake_2cc3baac2954",
                        },
                    },
                },
            ],
        },
    },
]


def main() -> None:
    # Zero runtime dependencies is a design constraint, checked on the
    # INSTALLED distribution rather than on the pyproject that claimed it.
    declared = requires("fancy-gmail-inbox")
    assert not declared, f"expected no runtime dependencies, got {declared}"
    print("  ok   zero runtime dependencies on the installed distribution")

    for golden in GOLDENS:
        operation, config = golden["operation"], golden["config"]
        fake = FakeValues(seed_for_call("gmail_inbox", operation, config))
        faked = respond(operation, {"config": config, "fake": fake})

        assert faked == golden["expected"], (
            f"the PUBLISHED wheel produced different bytes for {operation} than the repo does"
        )
        print(f"  ok   {operation}")

    print(f"\n  {len(GOLDENS)} operations verified against the published wheel.")


if __name__ == "__main__":
    main()
