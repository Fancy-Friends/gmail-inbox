# GENERATED FILE — do not edit.
#
# Emitted from provider/manifest.json (via weaver's
# template/embed/py/_pubsub_push.py) by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/manifest.json (via weaver's template/embed/py/_pubsub_push.py) (or
# weaver's template/) and regenerate:
#
# npm run provider -- gmail_inbox

"""A Google Cloud Pub/Sub PUSH body, decoded to the message it carries.

The payload TRANSFORM Gmail's ``users.watch`` notifications need: Pub/Sub wraps
each message in an envelope and base64-encodes its ``data``.
fancy-connector-core implements it in TypeScript (``decodePubSubPush``) and PHP
(``PubSubPush::decode``); it has no Python package, so this copy is embedded
where a trigger declares the decode, and weaver's ``tests/oidc-py.test.mjs``
holds it to the core's authored corpus (``fixtures/pubsub-push/``).

It runs AFTER verification: a push is authenticated by the OIDC token in its
header, not by its body. The decisions, each pinned by a case there:

- ``data`` may be standard base64 or base64url, padded or not; anything outside
  both alphabets, and bytes that are not UTF-8, are ``bad-encoding``.
- ``data`` is parsed as JSON; text that is not JSON is ``data-not-json``.
- ``messageId`` / ``publishTime`` are read camelCase first, then snake_case.
- Absent ``attributes`` is ``{}``; absent ``deliveryAttempt`` is ``None``.
"""

from __future__ import annotations

import base64
import binascii
import json
import re
from typing import Any

PUBSUB_PUSH_REASONS = (
    "not-json",
    "missing-message",
    "missing-data",
    "bad-encoding",
    "data-not-json",
)

_ALPHABET = re.compile(r"^[A-Za-z0-9+/_-]*$")


class PubSubPushError(ValueError):
    """Refused BY NAME; ``reason`` is the same string TS and PHP carry."""

    def __init__(self, reason: str, message: str) -> None:
        super().__init__(message)
        self.reason = reason


def _base64_bytes(data: str) -> bytes:
    """Standard or url-safe base64, padding optional. Raises on anything else."""
    unpadded = re.sub(r"={1,2}$", "", data)
    if not _ALPHABET.match(unpadded) or len(unpadded) % 4 == 1:
        raise ValueError("not base64")
    standard = unpadded.replace("-", "+").replace("_", "/")
    return base64.b64decode(standard + "=" * (-len(standard) % 4), validate=True)


def _string_or_none(value: Any) -> str | None:
    return value if isinstance(value, str) else None


def decode_pubsub_push(raw: bytes | str) -> dict[str, Any]:
    """Unwrap a push body to the message it carries.

    ``{subscription, messageId, publishTime, attributes, deliveryAttempt, data}``.
    """
    try:
        body = json.loads(raw.decode("utf-8") if isinstance(raw, bytes) else raw)
    except ValueError as error:
        raise PubSubPushError("not-json", "the push body is not JSON") from error
    if not isinstance(body, dict):
        raise PubSubPushError("not-json", "the push body is not a JSON object")

    message = body.get("message")
    if not isinstance(message, dict):
        raise PubSubPushError("missing-message", "the push body has no message")

    data = message.get("data")
    if not isinstance(data, str) or data == "":
        raise PubSubPushError("missing-data", "the message carries no data")

    try:
        text = _base64_bytes(data).decode("utf-8")
    except (ValueError, binascii.Error) as error:
        raise PubSubPushError(
            "bad-encoding", "the message data is not base64 of UTF-8 text"
        ) from error

    try:
        parsed = json.loads(text)
    except ValueError as error:
        raise PubSubPushError("data-not-json", f"the message data is not JSON: {error}") from error

    attempt = body.get("deliveryAttempt")
    if not isinstance(attempt, int) or isinstance(attempt, bool):
        attempt = None
    attributes = message.get("attributes")
    message_id = _string_or_none(message.get("messageId"))
    publish_time = _string_or_none(message.get("publishTime"))
    return {
        "subscription": _string_or_none(body.get("subscription")),
        "messageId": message_id or _string_or_none(message.get("message_id")),
        "publishTime": publish_time or _string_or_none(message.get("publish_time")),
        "attributes": attributes if isinstance(attributes, dict) else {},
        "deliveryAttempt": attempt,
        "data": parsed,
    }


def decode_delivery(decode: dict[str, str], raw: bytes | str) -> Any:
    """Apply a trigger's declared ``decode``; an unknown kind is refused."""
    if decode.get("kind") == "pubsub-push":
        return decode_pubsub_push(raw)
    # Refused rather than passed through: a kind nothing implements would
    # otherwise publish the raw bytes as if they were the payload.
    raise ValueError(f"unknown decode kind {json.dumps(decode.get('kind'))}")
