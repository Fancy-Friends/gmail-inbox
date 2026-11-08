# GENERATED FILE — do not edit.
#
# Emitted from provider/actions/history-list.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/actions/history-list.json (or weaver's template/) and regenerate:
#
# npm run provider -- gmail_inbox

"""List what changed in a mailbox since a history id: messages added or
deleted, labels added or removed.

GET /gmail/v1/users/{userId}/history —
https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list

This describes the request. `call` resolves the connection, picks the
estate, and either calls Gmail Inbox or calls the faker.
"""

from __future__ import annotations

from typing import Any
from urllib.parse import quote

from .._runtime import CallResult, ConnectorConfigError, Mode, call
from ..service import descriptor

OPERATION = "history_list"
METHOD = "GET"
PATH = "/gmail/v1/users/{userId}/history"
SIDE_EFFECTS = "none"


def body(config: dict[str, Any]) -> dict[str, Any]:
    """Build the form body for one call, failing loudly and specifically."""
    if config.get("userId") is None or config.get("userId") == "":
        raise ConnectorConfigError(
            "history_list: \"userId\" is required (Mailbox)."
        )

    if config.get("startHistoryId") is None or config.get("startHistoryId") == "":
        raise ConnectorConfigError(
            "history_list: \"startHistoryId\" is required (Start history id)."
        )

    maxresults = config.get("maxResults")
    if maxresults is not None and maxresults != "":
        try:
            _n = float(maxresults)
        except (TypeError, ValueError):
            _n = None
        if _n is None or _n != int(_n) or _n < 1 or _n > 500:
            raise ConnectorConfigError(
                "history_list: \"maxResults\" must be a integer, got "
                f"{maxresults!r}."
            )

    out: dict[str, Any] = {}
    _value = config.get("startHistoryId")
    if _value is None or _value == "":
        raise ConnectorConfigError("history_list: \"startHistoryId\" is required.")

    out["startHistoryId"] = str(_value)
    _value = config.get("historyTypes")
    if _value is not None and _value != "":
        out["historyTypes"] = str(_value)
    _value = config.get("labelId")
    if _value is not None and _value != "":
        out["labelId"] = str(_value)
    _value = config.get("maxResults")
    out["maxResults"] = int(float(_value)) if _value is not None and _value != "" else 100
    _value = config.get("pageToken")
    if _value is not None and _value != "":
        out["pageToken"] = str(_value)

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
        + "/history"
    )

def history_list(
    config: dict[str, Any],
    *,
    credentials: dict[str, str | None] | None = None,
    mode: Mode = "auto",
    connection_id: str | None = None,
    attempts: int = 3,
) -> CallResult:
    """List what changed in a mailbox since a history id: messages added or deleted, labels added or
    removed.
    """
    return call(
        descriptor(),
        operation=OPERATION,
        method=METHOD,
        path=PATH,
        form=body(config),
        config=config,
        credentials=credentials,
        mode=mode,
        connection_id=connection_id,
        attempts=attempts,
    )
