# GENERATED FILE — do not edit.
#
# Emitted from provider/actions/mailbox-watch.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/actions/mailbox-watch.json (or weaver's template/) and regenerate:
#
# npm run provider -- gmail_inbox

"""Start (or renew) push notifications for a mailbox to a Cloud Pub/Sub topic.

POST /gmail/v1/users/{userId}/watch —
https://developers.google.com/workspace/gmail/api/reference/rest/v1/users/watch

This describes the request. `call` resolves the connection, picks the
estate, and either calls Gmail Inbox or calls the faker.
"""

from __future__ import annotations

from typing import Any
from urllib.parse import quote

from .._runtime import CallResult, ConnectorConfigError, Mode, call
from ..service import descriptor

OPERATION = "mailbox_watch"
METHOD = "POST"
PATH = "/gmail/v1/users/{userId}/watch"
SIDE_EFFECTS = "idempotent"


def body(config: dict[str, Any]) -> dict[str, Any]:
    """Build the JSON body for one call, failing loudly and specifically."""
    if config.get("userId") is None or config.get("userId") == "":
        raise ConnectorConfigError(
            "mailbox_watch: \"userId\" is required (Mailbox)."
        )

    if config.get("topicName") is None or config.get("topicName") == "":
        raise ConnectorConfigError(
            "mailbox_watch: \"topicName\" is required (Pub/Sub topic)."
        )

    out: dict[str, Any] = {}
    _value = config.get("topicName")
    if _value is None or _value == "":
        raise ConnectorConfigError("mailbox_watch: \"topicName\" is required.")

    out["topicName"] = str(_value).strip()
    _value = config.get("labelIds")
    if _value is not None and _value != "":
        out["labelIds"] = _labelids_list(config.get("labelIds"))
    _value = config.get("labelFilterBehavior")
    if _value is not None and _value != "":
        out["labelFilterBehavior"] = str(_value)

    return out



def path(config: dict[str, Any]) -> str:
    """The request path, with each config value URL-ENCODED into it.

    `PATH` above is the TEMPLATE, which is what the descriptor advertises;
    this is what a caller sends. A value interpolated raw changes WHICH URL is
    called — a range like `Sheet1!A:B`, or a sheet named `Q1/Q2` — and the
    provider answers 404 about the document rather than about the encoding.
    """
    return (
        "/gmail/v1/users/"
        + quote(str(config.get("userId") or ""), safe="")
        + "/watch"
    )

def mailbox_watch(
    config: dict[str, Any],
    *,
    credentials: dict[str, str | None] | None = None,
    mode: Mode = "auto",
    connection_id: str | None = None,
    attempts: int = 3,
) -> CallResult:
    """Start (or renew) push notifications for a mailbox to a Cloud Pub/Sub topic."""
    return call(
        descriptor(),
        operation=OPERATION,
        method=METHOD,
        path=PATH,
        json_body=body(config),
        config=config,
        credentials=credentials,
        mode=mode,
        connection_id=connection_id,
        attempts=attempts,
    )


def _labelids_list(value: Any) -> list[str]:
    """One value, a ","-separated string, or a list — all end up a list."""
    if isinstance(value, list):
        items = [str(item) for item in value]
    elif isinstance(value, str):
        items = value.split(",")
    else:
        return []

    return [item.strip() for item in items if item.strip()]