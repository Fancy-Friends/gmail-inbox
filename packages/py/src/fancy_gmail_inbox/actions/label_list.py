# GENERATED FILE — do not edit.
#
# Emitted from provider/actions/label-list.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/actions/label-list.json (or weaver's template/) and regenerate:
#
# npm run provider -- gmail_inbox

"""List every label on the mailbox, system and user-created.

GET /gmail/v1/users/{userId}/labels —
https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/list

This describes the request. `call` resolves the connection, picks the
estate, and either calls Gmail Inbox or calls the faker.
"""

from __future__ import annotations

from typing import Any
from urllib.parse import quote

from .._runtime import CallResult, ConnectorConfigError, Mode, call
from ..service import descriptor

OPERATION = "label_list"
METHOD = "GET"
PATH = "/gmail/v1/users/{userId}/labels"
SIDE_EFFECTS = "none"


def body(config: dict[str, Any]) -> dict[str, Any]:
    """Build the form body for one call, failing loudly and specifically."""
    if config.get("userId") is None or config.get("userId") == "":
        raise ConnectorConfigError(
            "label_list: \"userId\" is required (Mailbox)."
        )

    out: dict[str, Any] = {}

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
        + "/labels"
    )

def label_list(
    config: dict[str, Any],
    *,
    credentials: dict[str, str | None] | None = None,
    mode: Mode = "auto",
    connection_id: str | None = None,
    attempts: int = 3,
) -> CallResult:
    """List every label on the mailbox, system and user-created."""
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
