# GENERATED FILE — do not edit.
#
# Emitted from provider/manifest.json (via weaver's
# template/embed/py/_oidc.py) by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/manifest.json (via weaver's template/embed/py/_oidc.py) (or
# weaver's template/) and regenerate:
#
# npm run provider -- gmail_inbox

"""RS256 JWT verification, and the ``oidc-jwt`` delivery scheme, against host keys.

Gmail's Pub/Sub push carries ``Authorization: Bearer <JWT>``, signed by Google,
over a body that proves nothing. fancy-connector-core implements this in
TypeScript (``verifyJwt``, ``verifyOidcDelivery``) and PHP (``Jwt::verify``,
``OidcDelivery::verify``); it has no Python package, so this copy is embedded
where a trigger declares the scheme, and weaver's ``tests/oidc-py.test.mjs``
holds it to the core's own corpora (``fixtures/jwt``, led by RFC 7515 A.2, and
``fixtures/oidc-delivery``). The reasons are the same fixed strings.

Python's standard library has no RSA and no third-party code is allowed, so the
signature is checked by hand: ``pow(s, e, n)`` compared with the EMSA-PKCS1-v1_5
encoding of the SHA-256 digest (RFC 8017 9.2). Every value is public, so
nothing here is timing-sensitive.

Every rule fails CLOSED: RS256 only (``none`` and ``HS256`` refused by name);
a ``kid`` must name a supplied key; ``exp`` is required and ``nbf`` honoured,
both with ``leeway`` seconds of skew; the audience is required unless passed as
None ON PURPOSE; the issuer is matched when given. Nothing here fetches a key
set: the HOST fetches and caches it and passes the keys in.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
import time
from collections.abc import Mapping, Sequence
from typing import Any

JWT_ALGORITHMS = ("RS256",)

_B64URL = re.compile(r"^[A-Za-z0-9_-]*$")
_BEARER = re.compile(r"^bearer +(\S+)$", re.IGNORECASE)
# DigestInfo for SHA-256 (RFC 8017 9.2, note 1), before the 32-byte digest.
_SHA256_DIGEST_INFO = bytes.fromhex("3031300d060960864801650304020105000420")


def _fail(reason: str) -> dict[str, Any]:
    return {"ok": False, "reason": reason}


def _b64url_bytes(segment: str) -> bytes | None:
    """Strict base64url: the URL alphabet only, no padding, no whitespace."""
    if not _B64URL.match(segment) or len(segment) % 4 == 1:
        return None
    try:
        return base64.urlsafe_b64decode(segment + "=" * (-len(segment) % 4))
    except ValueError:
        return None


def _json_segment(segment: str) -> dict[str, Any] | None:
    raw = _b64url_bytes(segment)
    if raw is None:
        return None
    try:
        value = json.loads(raw.decode("utf-8"))
    except ValueError:
        return None
    return value if isinstance(value, dict) else None


def _select_key(keys: Sequence[Mapping[str, Any]], kid: Any) -> Mapping[str, Any] | str:
    """The key to verify with, or why there is none."""
    rsa = [
        k
        for k in keys
        if isinstance(k, Mapping)
        and k.get("kty") == "RSA"
        and isinstance(k.get("n"), str)
        and isinstance(k.get("e"), str)
    ]
    if isinstance(kid, str):
        for k in rsa:
            if k.get("kid") == kid:
                return k
        return f"no key for kid {json.dumps(kid)}"
    # No kid: only an unambiguous single key may be used.
    return rsa[0] if len(rsa) == 1 else "token names no kid and the key is ambiguous"


def _rs256_valid(signing_input: bytes, signature: bytes, n: int, e: int) -> bool:
    """RSASSA-PKCS1-v1_5 verification with SHA-256 (RFC 8017 8.2.2)."""
    k = (n.bit_length() + 7) // 8
    if len(signature) != k:
        return False
    s = int.from_bytes(signature, "big")
    if s >= n:
        return False
    encoded = pow(s, e, n).to_bytes(k, "big")
    t = _SHA256_DIGEST_INFO + hashlib.sha256(signing_input).digest()
    if k < len(t) + 11:
        return False
    expected = b"\x00\x01" + b"\xff" * (k - len(t) - 3) + b"\x00" + t
    return hmac.compare_digest(encoded, expected)


def verify_jwt(
    token: str,
    *,
    keys: Sequence[Mapping[str, Any]],
    audience: str | Sequence[str] | None,
    issuer: str | Sequence[str] | None = None,
    now: int | float | None = None,
    leeway: int = 60,
) -> dict[str, Any]:
    """Verify a JWS compact token. ``{ok, header, claims}`` or ``{ok: False, reason}``."""
    parts = token.split(".") if isinstance(token, str) else []
    if len(parts) != 3 or parts[0] == "" or parts[1] == "":
        return _fail("token is not a JWS compact serialization")
    h, p, s = parts

    header = _json_segment(h)
    if header is None:
        return _fail("token header is not base64url JSON")

    # The algorithm first: an attacker chooses it, so nothing else is trusted
    # until it is one of ours.
    if header.get("alg") not in JWT_ALGORITHMS:
        return _fail(f"alg {json.dumps(header.get('alg'))} is not accepted")

    key = _select_key(keys, header.get("kid"))
    if isinstance(key, str):
        return _fail(key)

    signature = _b64url_bytes(s)
    if signature is None:
        return _fail("signature is not base64url")

    n_bytes = _b64url_bytes(str(key["n"]))
    e_bytes = _b64url_bytes(str(key["e"]))
    if not n_bytes or not e_bytes:
        return _fail("the key could not be used to verify")
    n = int.from_bytes(n_bytes, "big")
    e = int.from_bytes(e_bytes, "big")
    if n == 0 or e == 0:
        return _fail("the key could not be used to verify")
    if not _rs256_valid(f"{h}.{p}".encode("ascii"), signature, n, e):
        return _fail("signature did not match")

    claims = _json_segment(p)
    if claims is None:
        return _fail("token payload is not base64url JSON")

    current = time.time() // 1 if now is None else now
    # isinstance, never a helper: it is what narrows the type for mypy, and a
    # bool is an int in Python but not a number in a JWT.
    exp = claims.get("exp")
    if not isinstance(exp, (int, float)) or isinstance(exp, bool):
        return _fail("token has no exp")
    if current > exp + leeway:
        return _fail("token has expired")
    nbf = claims.get("nbf")
    if isinstance(nbf, (int, float)) and not isinstance(nbf, bool) and current + leeway < nbf:
        return _fail("token is not valid yet")

    if issuer is not None:
        issuers = [issuer] if isinstance(issuer, str) else list(issuer)
        iss = claims.get("iss")
        if not isinstance(iss, str) or iss not in issuers:
            return _fail("token issuer is not accepted")

    if audience is not None:
        wanted = [audience] if isinstance(audience, str) else list(audience)
        aud = claims.get("aud")
        offered = [aud] if isinstance(aud, str) else aud if isinstance(aud, list) else []
        if not any(isinstance(a, str) and a in wanted for a in offered):
            return _fail("token audience is not accepted")

    return {"ok": True, "header": header, "claims": claims}


def _header(headers: Mapping[str, Any], name: str) -> str | None:
    wanted = name.lower()
    for key, value in headers.items():
        if str(key).lower() != wanted:
            continue
        if isinstance(value, list):
            return str(value[0]) if value else None
        return None if value is None else str(value)
    return None


def verify_oidc_delivery(
    headers: Mapping[str, Any],
    scheme: Mapping[str, Any],
    *,
    keys: Sequence[Mapping[str, Any]],
    audience: str | None,
    principal: str | None,
    now: int | float | None = None,
) -> dict[str, Any]:
    """Verify a delivery authenticated by a bearer token. ``{ok}`` or ``{ok: False, reason}``.

    The host's own configuration is checked before the delivery is read, so a
    misconfigured trigger refuses every push rather than accepting any of them.
    The audience matters because the provider signs a token for EVERY push
    subscription; the principal matters more, because a stranger's
    subscription in their own project, aimed at your URL with your URL as its
    audience, carries a token the provider signed correctly.
    """
    if not keys:
        return _fail("no signing keys supplied for this trigger")
    if not audience:
        return _fail("no audience configured for this trigger")
    if not principal:
        return _fail("no principal configured for this trigger")

    match = _BEARER.match(_header(headers, str(scheme["header"])) or "")
    if not match:
        return _fail("delivery carried no bearer token")

    verified = verify_jwt(
        match.group(1),
        keys=keys,
        audience=audience,
        issuer=scheme["issuers"],
        now=now,
    )
    if not verified["ok"]:
        return _fail(str(verified["reason"]))

    claims = verified["claims"]
    if claims.get(str(scheme["principalClaim"])) != principal:
        return _fail("token principal is not accepted")
    verified_claim = scheme.get("verifiedClaim")
    if verified_claim is not None and claims.get(str(verified_claim)) is not True:
        return _fail("token principal is not verified")

    return {"ok": True}
