# GENERATED FILE — do not edit.
#
# Emitted from provider/manifest.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/manifest.json (or weaver's template/) and regenerate:
#
# npm run provider -- gmail_inbox

"""Gmail Inbox for Python.

The service descriptor, its faker, its delivery contract, and one function
per operation — plain HTTP on the stdlib, no vendor SDK and no runtime
dependency.
"""

from __future__ import annotations

from ._fake import FakeValues
from .actions.history_list import history_list
from .actions.label_list import label_list
from .actions.mailbox_stop import mailbox_stop
from .actions.mailbox_watch import mailbox_watch
from .actions.message_get import message_get
from .actions.message_list import message_list
from .actions.thread_get import thread_get
from .faker import respond
from .service import BASE_URLS, CONNECTOR_API_VERSION, REQUIRES, SANDBOX, SERVICE, TITLE, descriptor
from .triggers import message_received

__version__ = "0.2.0"

__all__ = [
    "BASE_URLS",
    "CONNECTOR_API_VERSION",
    "REQUIRES",
    "SANDBOX",
    "SERVICE",
    "TITLE",
    "FakeValues",
    "descriptor",
    "history_list",
    "label_list",
    "mailbox_stop",
    "mailbox_watch",
    "message_get",
    "message_list",
    "message_received",
    "respond",
    "thread_get",
]
