<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use FancyFlow\Runtime\RunEvent;
use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\GmailInbox\Actions\MailboxWatch;
use ParticleAcademy\GmailInbox\GmailInbox;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/mailbox-watch.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/mailbox-watch.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */
/**
 * Watch a Gmail mailbox, run on a fancy-flow-php host.
 *
 * The PHP twin of `gmailInboxMailboxWatchExecutor` in
 * @particle-academy/gmail-inbox-js: the same request, built from the node's
 * config by the same `Actions\MailboxWatch` a host would call directly, and
 * the same value on `out` — the client's `{data, mode, connection}`.
 *
 * The client resolves the connection and the estate from the config. With
 * nothing configured that is FAKE, so a node dropped on a canvas runs against
 * the faker rather than Gmail Inbox. To reach a real estate, pass a
 * `ConnectorClient` that knows the host's connections — or bind one in the
 * container, which resolves the constructor by type.
 */
#[FlowNode(
    name: '@particle-academy/gmail_inbox_mailbox_watch',
    aliases: [
        'gmail_inbox_mailbox_watch',
    ],
    category: 'io',
    label: 'Watch a Gmail mailbox',
    description: 'Start (or renew) push notifications for a mailbox to a Cloud Pub/Sub topic.',
    inputs: [
        [
            'id' => 'in',
        ],
    ],
    outputs: [
        [
            'id' => 'out',
        ],
    ],
    sideEffects: 'idempotent',
    outputShape: [
        [
            'path' => 'data.historyId',
            'type' => 'string',
            'description' => 'The mailbox\'s CURRENT history id: seed the trigger\'s stored cursor from it.',
        ],
        [
            'path' => 'data.expiration',
            'type' => 'string',
            'description' => 'When Gmail stops pushing, in epoch MILLISECONDS. Renew before it; Google recommends daily.',
        ],
        [
            'path' => 'mode',
            'type' => 'string',
            'description' => 'Which estate this ran against. Google has no sandbox, so: fake or live.',
        ],
    ],
)]
final class MailboxWatchExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();

        $result = ($this->client ?? new ConnectorClient)->call(
            GmailInbox::descriptor(),
            MailboxWatch::OPERATION,
            $config,
            [
                'method' => MailboxWatch::METHOD,
                'path' => MailboxWatch::path($config),
                'json' => MailboxWatch::body($config),
            ],
            $ctx->input('in'),
        );

        $id = is_array($result->data) ? ($result->data['id'] ?? null) : null;
        $ctx->emit(RunEvent::log(
            'info',
            'gmail_inbox mailbox_watch'.(is_scalar($id) ? ' '.$id : '').' ('.$result->mode->value.')',
            $ctx->node->id,
        ));

        return Port::only('out', $result->toArray());
    }
}
