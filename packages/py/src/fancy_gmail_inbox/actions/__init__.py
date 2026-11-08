# GENERATED FILE — do not edit.
#
# Emitted from provider/actions/ by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/actions/ (or weaver's template/) and regenerate:
#
# npm run provider -- gmail_inbox

from .history_list import history_list
from .label_list import label_list
from .mailbox_stop import mailbox_stop
from .mailbox_watch import mailbox_watch
from .message_get import message_get
from .message_list import message_list
from .thread_get import thread_get

__all__ = [
    "history_list",
    "label_list",
    "mailbox_stop",
    "mailbox_watch",
    "message_get",
    "message_list",
    "thread_get",
]
