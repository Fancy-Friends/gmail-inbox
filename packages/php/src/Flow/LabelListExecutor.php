<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use FancyFlow\Runtime\RunEvent;
use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\GmailInbox\Actions\LabelList;
use ParticleAcademy\GmailInbox\GmailInbox;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/label-list.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/label-list.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */
/**
 * List Gmail labels, run on a fancy-flow-php host.
 *
 * The PHP twin of `gmailInboxLabelListExecutor` in
 * @particle-academy/gmail-inbox-js: the same request, built from the node's
 * config by the same `Actions\LabelList` a host would call directly, and the
 * same value on `out` — the client's `{data, mode, connection}`.
 *
 * The client resolves the connection and the estate from the config. With
 * nothing configured that is FAKE, so a node dropped on a canvas runs against
 * the faker rather than Gmail Inbox. To reach a real estate, pass a
 * `ConnectorClient` that knows the host's connections — or bind one in the
 * container, which resolves the constructor by type.
 */
#[FlowNode(
    name: '@particle-academy/gmail_inbox_label_list',
    aliases: [
        'gmail_inbox_label_list',
    ],
    category: 'io',
    label: 'List Gmail labels',
    description: 'List every label on the mailbox, system and user-created.',
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
            'path' => 'data.labels',
            'type' => 'array',
            'description' => 'Each with id, name and type (system or user). messagesTotal/messagesUnread/threadsTotal/threadsUnread are part of Label\'s schema but not confirmed present on every list row -- read one label with labels.get if a count comes back missing.',
        ],
    ],
)]
final class LabelListExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();

        $result = ($this->client ?? new ConnectorClient)->call(
            GmailInbox::descriptor(),
            LabelList::OPERATION,
            $config,
            [
                'method' => LabelList::METHOD,
                'path' => LabelList::path($config),
                'query' => LabelList::body($config),
            ],
            $ctx->input('in'),
        );

        $id = is_array($result->data) ? ($result->data['id'] ?? null) : null;
        $ctx->emit(RunEvent::log(
            'info',
            'gmail_inbox label_list'.(is_scalar($id) ? ' '.$id : '').' ('.$result->mode->value.')',
            $ctx->node->id,
        ));

        return Port::only('out', $result->toArray());
    }
}
