<?php

declare(strict_types=1);

use ParticleAcademy\GmailInbox\GmailInboxFaker;
use ParticleAcademy\Connectors\FakeValues;

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
 * The golden fixtures — the SAME values the TypeScript and Python packages
 * assert.
 *
 * Bit-for-bit identical is the claim, and this is what checks it.
 * Cross-runtime drift does not fail loudly on its own: it completes, down one
 * path, with no error.
 */

it('label_list fakes the shape Gmail Inbox publishes', function () {
    $config = [];
    $fake = new FakeValues(FakeValues::seedForCall('gmail_inbox', 'label_list', $config));

    $faked = GmailInboxFaker::respond('label_list', ['config' => $config, 'fake' => $fake]);

    // Through JSON and back, because a faked EMPTY object is a stdClass — the only
    // PHP value that spells `{}` on the wire — and `toBe` compares objects by
    // identity. This asserts the VALUES; the `{}`-versus-`[]` spelling is what
    // weaver's cross-runtime parity suite asserts, byte for byte.
    $faked = json_decode((string) json_encode($faked), true, 512, JSON_THROW_ON_ERROR);

    expect($faked)->toBe([
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
                'id' => 'Label_fake_807796d5270c',
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
    ]);
});

it('message_get fakes the shape Gmail Inbox publishes', function () {
    $config = [];
    $fake = new FakeValues(FakeValues::seedForCall('gmail_inbox', 'message_get', $config));

    $faked = GmailInboxFaker::respond('message_get', ['config' => $config, 'fake' => $fake]);

    // Through JSON and back, because a faked EMPTY object is a stdClass — the only
    // PHP value that spells `{}` on the wire — and `toBe` compares objects by
    // identity. This asserts the VALUES; the `{}`-versus-`[]` spelling is what
    // weaver's cross-runtime parity suite asserts, byte for byte.
    $faked = json_decode((string) json_encode($faked), true, 512, JSON_THROW_ON_ERROR);

    expect($faked)->toBe([
        'id' => '460c5b2c605e0e98',
        'threadId' => '9026959e103bee54',
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
                'data' => 'base64url_body_fake_d3da4d2cd58f',
            ],
        ],
    ]);
});

it('message_list fakes the shape Gmail Inbox publishes', function () {
    $config = [];
    $fake = new FakeValues(FakeValues::seedForCall('gmail_inbox', 'message_list', $config));

    $faked = GmailInboxFaker::respond('message_list', ['config' => $config, 'fake' => $fake]);

    // Through JSON and back, because a faked EMPTY object is a stdClass — the only
    // PHP value that spells `{}` on the wire — and `toBe` compares objects by
    // identity. This asserts the VALUES; the `{}`-versus-`[]` spelling is what
    // weaver's cross-runtime parity suite asserts, byte for byte.
    $faked = json_decode((string) json_encode($faked), true, 512, JSON_THROW_ON_ERROR);

    expect($faked)->toBe([
        'messages' => [
            [
                'id' => '77c068f12110c65e',
                'threadId' => '02b84cd36f670102',
            ],
            [
                'id' => '67a7d2812300333a',
                'threadId' => '898b50a9905e2da6',
            ],
        ],
        'resultSizeEstimate' => 2,
    ]);
});

it('thread_get fakes the shape Gmail Inbox publishes', function () {
    $config = [];
    $fake = new FakeValues(FakeValues::seedForCall('gmail_inbox', 'thread_get', $config));

    $faked = GmailInboxFaker::respond('thread_get', ['config' => $config, 'fake' => $fake]);

    // Through JSON and back, because a faked EMPTY object is a stdClass — the only
    // PHP value that spells `{}` on the wire — and `toBe` compares objects by
    // identity. This asserts the VALUES; the `{}`-versus-`[]` spelling is what
    // weaver's cross-runtime parity suite asserts, byte for byte.
    $faked = json_decode((string) json_encode($faked), true, 512, JSON_THROW_ON_ERROR);

    expect($faked)->toBe([
        'id' => 'c13ba48400c4b471',
        'historyId' => '2162600385',
        'messages' => [
            [
                'id' => '2589b47f73cde27c',
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
                        'data' => 'base64url_body_fake_3fc2b21d59a5',
                    ],
                ],
            ],
            [
                'id' => '274fe178b77115c8',
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
                        'data' => 'base64url_body_fake_2cc3baac2954',
                    ],
                ],
            ],
        ],
    ]);
});

it('throws for an operation with no fixture rather than inventing a shape', function () {
    $fake = new FakeValues(FakeValues::seedForCall('gmail_inbox', 'no_such_operation', []));

    expect(fn () => GmailInboxFaker::respond('no_such_operation', ['config' => [], 'fake' => $fake]))
        ->toThrow(InvalidArgumentException::class);
});
