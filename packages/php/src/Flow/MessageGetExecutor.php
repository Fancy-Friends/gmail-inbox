<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use FancyFlow\Runtime\RunEvent;
use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\GmailInbox\Actions\MessageGet;
use ParticleAcademy\GmailInbox\GmailInbox;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/message-get.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/message-get.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */
/**
 * Gmail message, run on a fancy-flow-php host.
 *
 * The PHP twin of `gmailInboxMessageGetExecutor` in
 * @particle-academy/gmail-inbox-js: the same request, built from the node's
 * config by the same `Actions\MessageGet` a host would call directly, and the
 * same value on `out` — the client's `{data, mode, connection}`.
 *
 * The client resolves the connection and the estate from the config. With
 * nothing configured that is FAKE, so a node dropped on a canvas runs against
 * the faker rather than Gmail Inbox. To reach a real estate, pass a
 * `ConnectorClient` that knows the host's connections — or bind one in the
 * container, which resolves the constructor by type.
 */
#[FlowNode(
    name: '@particle-academy/gmail_inbox_message_get',
    aliases: [
        'gmail_inbox_message_get',
    ],
    category: 'io',
    label: 'Gmail message',
    description: 'Read one message\'s headers and preview. The body\'s plain/HTML text is NOT decoded -- see the raw payload for that.',
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
            'description' => 'The message id.',
        ],
        [
            'path' => 'data.threadId',
            'type' => 'string',
            'description' => 'The thread this message belongs to.',
        ],
        [
            'path' => 'data.labelIds',
            'type' => 'array',
            'description' => 'System and user label ids currently on this message.',
        ],
        [
            'path' => 'data.snippet',
            'type' => 'string',
            'description' => 'Gmail\'s own short plain-text preview of the body -- a few hundred characters, not the whole message.',
        ],
        [
            'path' => 'data.internalDate',
            'type' => 'string',
            'description' => 'Unix epoch MILLISECONDS, as a string -- when Gmail received it, which can differ from the Date header.',
        ],
        [
            'path' => 'data.payload.headers',
            'type' => 'array',
            'description' => 'Every RFC 2822 header as { name, value }, unparsed. From/To/Subject/Date live here.',
        ],
        [
            'path' => 'data.payload',
            'type' => 'unknown',
            'description' => 'The full MIME tree, raw -- mimeType, body (base64url in body.data for a leaf part), and nested parts for a multipart message. Decode it yourself for plain-text or HTML content; this connector does not flatten it.',
        ],
        [
            'path' => 'mode',
            'type' => 'string',
            'description' => 'Which estate this ran against. Google has no sandbox, so: fake or live.',
        ],
    ],
)]
final class MessageGetExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();

        $result = ($this->client ?? new ConnectorClient)->call(
            GmailInbox::descriptor(),
            MessageGet::OPERATION,
            $config,
            [
                'method' => MessageGet::METHOD,
                'path' => MessageGet::path($config),
                'query' => MessageGet::body($config),
            ],
            $ctx->input('in'),
        );

        $id = is_array($result->data) ? ($result->data['id'] ?? null) : null;
        $ctx->emit(RunEvent::log(
            'info',
            'gmail_inbox message_get'.(is_scalar($id) ? ' '.$id : '').' ('.$result->mode->value.')',
            $ctx->node->id,
        ));

        return Port::only('out', $result->toArray());
    }
}
