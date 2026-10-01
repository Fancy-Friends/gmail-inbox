<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use FancyFlow\Runtime\RunEvent;
use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\GmailInbox\Actions\ThreadGet;
use ParticleAcademy\GmailInbox\GmailInbox;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/thread-get.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/thread-get.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */
/**
 * Gmail thread, run on a fancy-flow-php host.
 *
 * The PHP twin of `gmailInboxThreadGetExecutor` in
 * @particle-academy/gmail-inbox-js: the same request, built from the node's
 * config by the same `Actions\ThreadGet` a host would call directly, and the
 * same value on `out` — the client's `{data, mode, connection}`.
 *
 * The client resolves the connection and the estate from the config. With
 * nothing configured that is FAKE, so a node dropped on a canvas runs against
 * the faker rather than Gmail Inbox. To reach a real estate, pass a
 * `ConnectorClient` that knows the host's connections — or bind one in the
 * container, which resolves the constructor by type.
 */
#[FlowNode(
    name: '@particle-academy/gmail_inbox_thread_get',
    aliases: [
        'gmail_inbox_thread_get',
    ],
    category: 'io',
    label: 'Gmail thread',
    description: 'Read every message in a conversation thread, oldest first.',
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
    sideEffects: 'none',
    outputShape: [
        [
            'path' => 'data.id',
            'type' => 'string',
            'description' => 'The thread id.',
        ],
        [
            'path' => 'data.historyId',
            'type' => 'string',
            'description' => 'Gmail\'s change-tracking cursor as of this read.',
        ],
        [
            'path' => 'data.messages',
            'type' => 'array',
            'description' => 'Every message in the thread, oldest first, each shaped like message_get\'s output.',
        ],
        [
            'path' => 'mode',
            'type' => 'string',
            'description' => 'Which estate this ran against. Google has no sandbox, so: fake or live.',
        ],
    ],
)]
final class ThreadGetExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();

        $result = ($this->client ?? new ConnectorClient)->call(
            GmailInbox::descriptor(),
            ThreadGet::OPERATION,
            $config,
            [
                'method' => ThreadGet::METHOD,
                'path' => ThreadGet::path($config),
                'query' => ThreadGet::body($config),
            ],
            $ctx->input('in'),
        );

        $id = is_array($result->data) ? ($result->data['id'] ?? null) : null;
        $ctx->emit(RunEvent::log(
            'info',
            'gmail_inbox thread_get'.(is_scalar($id) ? ' '.$id : '').' ('.$result->mode->value.')',
            $ctx->node->id,
        ));

        return Port::only('out', $result->toArray());
    }
}
