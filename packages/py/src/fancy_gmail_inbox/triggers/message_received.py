# GENERATED FILE — do not edit.
#
# Emitted from provider/triggers/message-received.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/triggers/message-received.json (or weaver's template/) and
# regenerate:
#
# npm run provider -- gmail_inbox

"""Gmail Inbox's subscription trigger — the delivery contract.

Kept beside the service descriptor rather than inside a node, because the
way a delivery is verified is a fact about GMAIL INBOX.

A SUBSCRIPTION: Gmail Inbox stops delivering unless somebody renews it,
forever, and if nobody does the workflow stops firing with no error
anywhere. LEASE says where the expiry is read from and how early to renew;
the host runs ONE renewal scheduler for every expiring trigger.
"""

from __future__ import annotations

from typing import Any

from .._oidc import verify_oidc_delivery
from .._pubsub_push import decode_delivery as _decode_delivery
from .._runtime import Verification
from ..faker import respond
from ..service import SERVICE

OPERATION = "message_received"
DELIVERY = "subscription"
SETUP = (
    "In YOUR app's Google Cloud project (the one owning the OAuth client): create a Pub/Sub "
    "topic, grant publish on it to gmail-api-push@system.gserviceaccount.com, and create a "
    "PUSH subscription to the route your host mounts for this trigger, with authentication on "
    "(a service account you choose; the endpoint URL as the audience). Put that audience and "
    "service account on the connection as pushAudience and pushServiceAccount, and fetch "
    "Google's signing keys for verification. Then call mailbox_watch with the topic for each "
    "mailbox and store its historyId as the trigger's cursor (startHistoryId); renew the "
    "watch daily. ONE topic serves every mailbox: route each push by its emailAddress, and "
    "only after the token verifies, to a mailbox you watched; drop an unmapped address with a "
    "2xx. Persist cursor.next when a run succeeds. On cursor-expired or cursor-overflow, "
    "watch again for a fresh historyId FIRST, then list with message_list using the "
    "resyncQuery, and match it against the mail you already handled. This trigger never "
    "changes read state."
)
SUBSCRIPTION_TTL = 604800
ROUTE: dict[str, str] = {"by": "emailAddress", "path": "data.emailAddress"}
DECODE: dict[str, str] = {"kind": "pubsub-push"}

# The read the trigger runs FIRST — a Gmail Inbox delivery only names what arrived.
THEN: dict[str, Any] = {
    "action": "history_list",
    "using": {},
    "as": "history",
    "cursor": {
        "param": "startHistoryId",
        "seedFrom": "historyId",
        "advanceFrom": "historyId",
        "page": {
            "param": "pageToken",
            "from": "nextPageToken",
            "collect": "history",
            "maxPages": 20,
        },
        "expiredStatus": 404,
        "resyncQuery": "newer_than:{resyncWindowDays}d",
    },
    "fromConfig": {"labelId": "labelId", "historyTypes": "historyTypes"},
    "also": {},
}

# The lease this subscription carries: where the provider's expiry sits in the
# mailbox_watch response, how it is spelled, how early the host renews, and what it
# calls when the lease is due.
LEASE = {
    "expiresAtFrom": "expiration",
    "expiresAtUnit": "epoch-ms",
    "renewBeforeSeconds": 86400,
    "renewOperation": "mailbox_watch",
}

# Which of this package's actions create, renew and stop the subscription.
# `renew` is None where the provider cannot renew and the host calls create again.
SUBSCRIPTION = {
    "create": "mailbox_watch",
    "renew": "mailbox_watch",
    "stop": "mailbox_stop",
}

# The header carrying "Bearer <token>", which the push is authenticated by.
# A header NAME, not a secret: S105 reads any *TOKEN* name as a password.
TOKEN_HEADER = "Authorization"  # noqa: S105
# The accepted `iss` values.
ISSUERS = ("https://accounts.google.com", "accounts.google.com")
# The claim naming who the token was minted for; it must EQUAL the configured principal.
PRINCIPAL_CLAIM = "email"
# A claim that must be the literal True beside it.
VERIFIED_CLAIM = "email_verified"
# WHICH credentials hold the audience and the principal: field names.
AUDIENCE_CREDENTIAL = "pushAudience"
PRINCIPAL_CREDENTIAL = "pushServiceAccount"


def verify_delivery(
    raw: str,
    headers: dict[str, str],
    keys: list[dict[str, Any]],
    pushaudience: str | None,
    pushserviceaccount: str | None,
    now: int | None = None,
) -> Verification:
    """Verify one inbound Gmail Inbox delivery.
    
    The host calls this BEFORE starting a run. The body proves nothing here: the
    delivery is authenticated by the bearer token in its header. `keys` are the
    provider's signing keys (its JWKS `keys`), fetched and cached by the HOST;
    nothing in this package fetches them. The audience and principal are the
    connection's `pushAudience` and `pushServiceAccount`, and both are REQUIRED:
    an unchecked audience accepts every token the provider signs for anyone, and
    an unchecked principal accepts a stranger's subscription aimed at your URL.
    Any of the three missing refuses every delivery.
    """
    del raw

    scheme: dict[str, Any] = {
        "kind": "oidc-jwt",
        "header": TOKEN_HEADER,
        "issuers": list(ISSUERS),
        "principalClaim": PRINCIPAL_CLAIM,
        "verifiedClaim": VERIFIED_CLAIM,
    }
    result = verify_oidc_delivery(
        headers,
        scheme,
        keys=keys,
        audience=pushaudience,
        principal=pushserviceaccount,
        now=now,
    )
    return Verification(bool(result["ok"]), result.get("reason"))


def decode_delivery(raw: bytes | str) -> Any:
    """Read one VERIFIED Gmail Inbox delivery: pubsub-push, the provider's envelope
    unwrapped to the message it carries.
    
    The host calls this AFTER `verify_delivery` has accepted it, with the SAME
    raw bytes, and starts the run with what it returns. A body that cannot be
    read raises PubSubPushError by name, never passed on.
    """
    return _decode_delivery(DECODE, raw)


def sample_event(config: dict[str, Any] | None = None) -> Any:
    """A faked sample event, so the trigger is runnable before any of the setup
    above.
    
    An author can see the real field names and wire the downstream nodes against
    them before the provider has ever been contacted.
    """
    from .._fake import FakeValues, seed_for_call

    resolved = config or {}
    fake = FakeValues(seed_for_call(SERVICE, OPERATION, resolved))

    event = respond(OPERATION, {"config": resolved, "fake": fake})

    # The run's FIRST step, as the executors do it: history_list with the
    # delivery's own values, published under "history". A delivery only names
    # what arrived.
    read_config: dict[str, Any] = {
        key: resolved[key] for key in ("connection", "mode") if resolved.get(key) is not None
    }
    read_fake = FakeValues(seed_for_call(SERVICE, THEN["action"], read_config))
    read = respond(THEN["action"], {"config": read_config, "fake": read_fake})

    return {
        **event,
        "history": read,
    }


def _at(value: Any, path: str) -> Any:
    """A dotted path into a delivery; None wherever it stops."""
    for key in path.split("."):
        if not isinstance(value, dict):
            return None
        value = value.get(key)
    return value
