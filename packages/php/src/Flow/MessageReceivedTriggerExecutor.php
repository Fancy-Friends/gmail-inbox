<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use ParticleAcademy\Connectors\ConnectionHost;
use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\Connectors\TriggerEvent;
use ParticleAcademy\GmailInbox\Actions\HistoryList;
use ParticleAcademy\GmailInbox\GmailInbox;
use ParticleAcademy\GmailInbox\Triggers\MessageReceived;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/triggers/message-received.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/triggers/message-received.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */
/**
 * Gmail message received, run on a fancy-flow-php host.
 *
 * The PHP twin of `gmailInboxMessageReceivedTriggerExecutor` in
 * @particle-academy/gmail-inbox-js. The delivery the HOST received and
 * verified at its own route only NAMES what arrived, so this executor reads it
 * — `history_list` — before anything downstream runs, and publishes the
 * delivery with the read under `history`. A failed read fails the run. With
 * nothing delivered, fake mode composes the faker's sample event with the
 * faked read, so a flow can be designed before the endpoint exists; any other
 * mode refuses, and says how to deliver one.
 */
#[FlowNode(
    name: '@particle-academy/gmail_inbox_message_received_trigger',
    aliases: [
        'gmail_inbox_message_received_trigger',
    ],
    category: 'trigger',
    label: 'Gmail message received',
    description: 'Start when new mail arrives in a watched mailbox, with every new message since the last run.',
    inputs: [],
    outputs: [
        [
            'id' => 'out',
        ],
    ],
    sideEffects: 'none',
    outputShape: [
        [
            'path' => 'messageId',
            'type' => 'string',
            'description' => 'Pub/Sub\'s id for this push. The same push may be delivered more than once.',
        ],
        [
            'path' => 'publishTime',
            'type' => 'string',
            'description' => 'When Pub/Sub published it.',
        ],
        [
            'path' => 'data.emailAddress',
            'type' => 'string',
            'description' => 'The mailbox. The ONLY routing key, and only after verification.',
        ],
        [
            'path' => 'data.historyId',
            'type' => 'number',
            'description' => 'The mailbox\'s new position, as Gmail pushed it. The read below starts from the STORED cursor, not this.',
        ],
        [
            'path' => 'history.history',
            'type' => 'array',
            'description' => 'Every change since the stored cursor, all pages, oldest first. New mail is history[].messagesAdded[].message {id, threadId}: read each with message_get.',
        ],
        [
            'path' => 'history.historyId',
            'type' => 'string',
            'description' => 'The mailbox\'s position after the read.',
        ],
        [
            'path' => 'history.nextPageToken',
            'type' => 'string',
            'description' => 'Always absent here: every page was read.',
        ],
        [
            'path' => 'cursor.used',
            'type' => 'string',
            'description' => 'The stored cursor this read started from.',
        ],
        [
            'path' => 'cursor.next',
            'type' => 'string',
            'description' => 'The cursor to store once this run succeeds (null: keep the one used).',
        ],
    ],
)]
final class MessageReceivedTriggerExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectionHost $host = null, private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();
        $service = GmailInbox::descriptor();

        $connection = ($this->host ?? new ConnectionHost)->resolve(
            $service->service,
            MessageReceived::OPERATION,
            $config,
            $service->sandbox,
            $service->requires,
            $service->baseUrls,
        );

        $event = TriggerEvent::resolve(
            $service->service,
            MessageReceived::OPERATION,
            MessageReceived::DELIVERY,
            MessageReceived::SETUP,
            $service->faker,
            $connection,
            $ctx->input('in'),
            $config,
        );

        // The run's FIRST step: `history_list` from the cursor the HOST stored,
        // every page, published with the cursor the host persists once the run
        // succeeds. A lapsed or overflowing cursor fails the run BY NAME
        // (CursorReadException), carrying the bounded resync.
        return Port::only('out', MessageReceived::readAfter($event, $config, client: $this->client));
    }
}
