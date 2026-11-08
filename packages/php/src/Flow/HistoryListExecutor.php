<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use FancyFlow\Runtime\RunEvent;
use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\GmailInbox\Actions\HistoryList;
use ParticleAcademy\GmailInbox\GmailInbox;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/history-list.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/history-list.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */
/**
 * List Gmail mailbox history, run on a fancy-flow-php host.
 *
 * The PHP twin of `gmailInboxHistoryListExecutor` in
 * @particle-academy/gmail-inbox-js: the same request, built from the node's
 * config by the same `Actions\HistoryList` a host would call directly, and the
 * same value on `out` — the client's `{data, mode, connection}`.
 *
 * The client resolves the connection and the estate from the config. With
 * nothing configured that is FAKE, so a node dropped on a canvas runs against
 * the faker rather than Gmail Inbox. To reach a real estate, pass a
 * `ConnectorClient` that knows the host's connections — or bind one in the
 * container, which resolves the constructor by type.
 */
#[FlowNode(
    name: '@particle-academy/gmail_inbox_history_list',
    aliases: [
        'gmail_inbox_history_list',
    ],
    category: 'io',
    label: 'List Gmail mailbox history',
    description: 'List what changed in a mailbox since a history id: messages added or deleted, labels added or removed.',
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
            'path' => 'data.history',
            'type' => 'array',
            'description' => 'History records, oldest first. Each has an id and messagesAdded / messagesDeleted / labelsAdded / labelsRemoved; a message there carries only id and threadId: read its content with message_get.',
        ],
        [
            'path' => 'data.historyId',
            'type' => 'string',
            'description' => 'The mailbox\'s CURRENT history id. Store it as the next start ONLY when there is no nextPageToken.',
        ],
        [
            'path' => 'data.nextPageToken',
            'type' => 'string',
            'description' => 'Present when there is another page.',
        ],
        [
            'path' => 'mode',
            'type' => 'string',
            'description' => 'Which estate this ran against. Google has no sandbox, so: fake or live.',
        ],
    ],
)]
final class HistoryListExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();

        $result = ($this->client ?? new ConnectorClient)->call(
            GmailInbox::descriptor(),
            HistoryList::OPERATION,
            $config,
            [
                'method' => HistoryList::METHOD,
                'path' => HistoryList::path($config),
                'query' => HistoryList::body($config),
            ],
            $ctx->input('in'),
        );

        $id = is_array($result->data) ? ($result->data['id'] ?? null) : null;
        $ctx->emit(RunEvent::log(
            'info',
            'gmail_inbox history_list'.(is_scalar($id) ? ' '.$id : '').' ('.$result->mode->value.')',
            $ctx->node->id,
        ));

        return Port::only('out', $result->toArray());
    }
}
