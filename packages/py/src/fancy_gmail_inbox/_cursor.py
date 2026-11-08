# GENERATED FILE — do not edit.
#
# Emitted from provider/manifest.json (via weaver's
# template/embed/py/_cursor.py) by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/manifest.json (via weaver's template/embed/py/_cursor.py) (or
# weaver's template/) and regenerate:
#
# npm run provider -- gmail_inbox

"""A read that resumes from a HOST-HELD cursor, and pages.

Gmail's push and Drive's channel notifications say only that something moved;
the follow-up read starts from the cursor the HOST stored (Gmail's
``startHistoryId``, Drive's ``pageToken``). fancy-connector-core implements it in
TypeScript (``readWithCursor``) and PHP (``CursorRead::read``); it has no Python
package, so this copy is embedded where a trigger declares ``then.cursor``, and
weaver's ``tests/cursor-py.test.mjs`` holds it to the core's authored corpus
(``fixtures/cursor-read/``). Python has no executor layer: a trigger's ``THEN``
carries the spec as data, and a host calls ``read_with_cursor`` with its own
call function.

The decisions, each pinned by a case there: ``next`` comes ONLY from the LAST
page; more than ``maxPages`` is ``cursor-overflow``; the provider's
``expiredStatus`` is ``cursor-expired`` and every other failure is re-raised
unchanged; no stored cursor is ``cursor-missing`` with no call made; a collected
list that is absent is ``[]`` and one that is not a list is ``bad-page``;
cursors are strings.
"""

from __future__ import annotations

import math
from collections.abc import Callable, Mapping
from typing import Any

CURSOR_READ_REASONS = ("cursor-missing", "cursor-expired", "cursor-overflow", "bad-page")


class CursorReadError(Exception):
    """Refused BY NAME; ``reason`` is the same string TS and PHP carry."""

    def __init__(self, reason: str, message: str, resync_query: str | None = None) -> None:
        super().__init__(message)
        self.reason = reason
        self.resync_query = resync_query


def _as_cursor(value: Any) -> str | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, str):
        return value or None
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float) and math.isfinite(value):
        return str(int(value)) if value.is_integer() else str(value)
    return None


def _at(value: Any, path: str) -> Any:
    for key in path.split("."):
        if not isinstance(value, dict) or key not in value:
            return None
        value = value[key]
    return value


def _with_list(data: Any, path: str, items: list[Any]) -> dict[str, Any]:
    head, _, rest = path.partition(".")
    base = dict(data) if isinstance(data, dict) else {}
    base[head] = _with_list(base.get(head), rest, items) if rest else items
    return base


def _status(error: BaseException) -> int | None:
    status = getattr(error, "status", None)
    return status if isinstance(status, int) and not isinstance(status, bool) else None


def read_with_cursor(
    spec: Mapping[str, Any],
    cursor: Any,
    call: Callable[[dict[str, str]], Any],
    resync_query: str | None = None,
) -> dict[str, Any]:
    """Read from the stored cursor; ``{data, cursor: {used, next}}`` or CursorReadError."""
    param = str(spec["param"])
    used = _as_cursor(cursor)
    if used is None:
        raise CursorReadError(
            "cursor-missing",
            f"no stored {param}: the host seeds one before the first read",
            resync_query,
        )

    page = spec.get("page")
    collected: list[Any] = []
    last: Any = None
    token: str | None = None
    pages = 0

    while True:
        if page is not None and pages == int(page["maxPages"]):
            raise CursorReadError(
                "cursor-overflow",
                f"more than {page['maxPages']} pages since {param} {used}",
                resync_query,
            )
        params = {param: used}
        if page is not None and token is not None:
            params[str(page["param"])] = token

        try:
            last = call(params)
        except Exception as error:
            if spec.get("expiredStatus") is not None and _status(error) == spec["expiredStatus"]:
                raise CursorReadError(
                    "cursor-expired",
                    f"{param} {used} is out of the provider's range ({spec['expiredStatus']})",
                    resync_query,
                ) from error
            raise
        pages += 1

        if page is None:
            break
        items = _at(last, str(page["collect"]))
        if items is not None and not isinstance(items, list):
            raise CursorReadError("bad-page", f"{page['collect']} is not a list", resync_query)
        if items:
            collected.extend(items)
        token = _as_cursor(_at(last, str(page["from"])))
        if token is None:
            break

    data = _with_list(last, str(page["collect"]), collected) if page is not None else last
    following = _as_cursor(_at(last, str(spec["advanceFrom"])))
    return {"data": data, "cursor": {"used": used, "next": following}}
