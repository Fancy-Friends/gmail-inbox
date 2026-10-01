<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox;

use ParticleAcademy\Connectors\FakeRequest;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/fixtures/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/fixtures/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */
/**
 * The Gmail Inbox faker — the PHP twin of the js package's `src/faker.ts`.
 *
 * Bit-for-bit identical: the same FNV-1a seed and the same xorshift32
 * sequence, so a golden fixture asserts the exact faked payload and BOTH
 * runtimes have to produce it. That turns the faker into a parity test rather
 * than a convenience.
 */
final class GmailInboxFaker
{
    /** @param array<string,mixed> $request */
    public static function respond(string $operation, array $request): mixed
    {
        /** @var array<string,mixed> $config */
        $config = $request['config'] ?? [];
        /** @var FakeValuesLike $fake */
        $fake = $request['fake'];

        return match ($operation) {
            'label_list' => self::LabelList($config, $fake),
            'message_get' => self::MessageGet($config, $fake),
            'message_list' => self::MessageList($config, $fake),
            'thread_get' => self::ThreadGet($config, $fake),
            default => throw new \InvalidArgumentException(
                // A faker asked for an operation it has no shape for must SAY so.
                // Making something up would produce a green run whose output
                // silently has none of the fields the author is about to reference.
                'gmail_inbox: no fake response is defined for "'.$operation.'". '
                    .'Add a fixture under provider/fixtures/ and regenerate — a connector without a faker '
                    .'cannot be developed against, tested, or demonstrated.'
            ),
        };
    }

    /** @param array<string,mixed> $config */
    private static function LabelList(array $config, mixed $fake): array|\stdClass
    {
        return [
        'labels' => [
            [
                'id' => 'INBOX',
                'name' => 'INBOX',
                'type' => 'system',
            ],
            [
                'id' => 'UNREAD',
                'name' => 'UNREAD',
                'type' => 'system',
            ],
            [
                'id' => 'IMPORTANT',
                'name' => 'IMPORTANT',
                'type' => 'system',
                'messagesTotal' => 412,
                'messagesUnread' => 18,
                'threadsTotal' => 203,
                'threadsUnread' => 11,
            ],
            [
                'id' => $fake->id('Label'),
                'name' => 'Design Reviews',
                'type' => 'user',
                'messageListVisibility' => 'show',
                'labelListVisibility' => 'labelShow',
                'messagesTotal' => 27,
                'messagesUnread' => 2,
                'threadsTotal' => 9,
                'threadsUnread' => 1,
            ],
        ],
    ];
    }

    /** @param array<string,mixed> $config */
    private static function MessageGet(array $config, mixed $fake): array|\stdClass
    {
        return [
        'id' => ((($v = $config['id'] ?? null) !== null && $v !== '') ? (string) $v : $fake->hex(16)),
        'threadId' => $fake->hex(16),
        'labelIds' => [
            'INBOX',
            'UNREAD',
            'IMPORTANT',
        ],
        'snippet' => 'Hi Ada, just confirming the design review is still on for Thursday at 2pm. Let me know if...',
        'internalDate' => '1790712000000',
        'payload' => [
            'mimeType' => 'text/plain',
            'headers' => [
                [
                    'name' => 'From',
                    'value' => 'Grace Hopper <grace@example.test>',
                ],
                [
                    'name' => 'To',
                    'value' => 'Ada Lovelace <ada@example.test>',
                ],
                [
                    'name' => 'Subject',
                    'value' => 'Re: Design review Thursday',
                ],
                [
                    'name' => 'Date',
                    'value' => 'Tue, 29 Sep 2026 14:03:00 -0400',
                ],
            ],
            'body' => [
                'size' => 612,
                'data' => $fake->id('base64url_body'),
            ],
        ],
    ];
    }

    /** @param array<string,mixed> $config */
    private static function MessageList(array $config, mixed $fake): array|\stdClass
    {
        return [
        'messages' => [
            [
                'id' => $fake->hex(16),
                'threadId' => $fake->hex(16),
            ],
            [
                'id' => $fake->hex(16),
                'threadId' => $fake->hex(16),
            ],
        ],
        'resultSizeEstimate' => 2,
    ];
    }

    /** @param array<string,mixed> $config */
    private static function ThreadGet(array $config, mixed $fake): array|\stdClass
    {
        return [
        'id' => ((($v = $config['id'] ?? null) !== null && $v !== '') ? (string) $v : $fake->hex(16)),
        'historyId' => implode('', array_map(static fn (): int => $fake->int(0, 9), range(1, 10))),
        'messages' => [
            [
                'id' => $fake->hex(16),
                'labelIds' => [
                    'INBOX',
                    'IMPORTANT',
                ],
                'snippet' => 'Hey team, scheduling the Q3 design review for Thursday at 2pm. Conference room B...',
                'internalDate' => '1790625600000',
                'payload' => [
                    'mimeType' => 'text/plain',
                    'headers' => [
                        [
                            'name' => 'From',
                            'value' => 'Ada Lovelace <ada@example.test>',
                        ],
                        [
                            'name' => 'To',
                            'value' => 'Grace Hopper <grace@example.test>',
                        ],
                        [
                            'name' => 'Subject',
                            'value' => 'Design review Thursday',
                        ],
                        [
                            'name' => 'Date',
                            'value' => 'Mon, 28 Sep 2026 09:00:00 -0400',
                        ],
                    ],
                    'body' => [
                        'size' => 540,
                        'data' => $fake->id('base64url_body'),
                    ],
                ],
            ],
            [
                'id' => $fake->hex(16),
                'labelIds' => [
                    'INBOX',
                    'UNREAD',
                    'IMPORTANT',
                ],
                'snippet' => 'Hi Ada, just confirming the design review is still on for Thursday at 2pm. Let me know if...',
                'internalDate' => '1790712000000',
                'payload' => [
                    'mimeType' => 'text/plain',
                    'headers' => [
                        [
                            'name' => 'From',
                            'value' => 'Grace Hopper <grace@example.test>',
                        ],
                        [
                            'name' => 'To',
                            'value' => 'Ada Lovelace <ada@example.test>',
                        ],
                        [
                            'name' => 'Subject',
                            'value' => 'Re: Design review Thursday',
                        ],
                        [
                            'name' => 'Date',
                            'value' => 'Tue, 29 Sep 2026 14:03:00 -0400',
                        ],
                    ],
                    'body' => [
                        'size' => 612,
                        'data' => $fake->id('base64url_body'),
                    ],
                ],
            ],
        ],
    ];
    }
}
