<?php

declare(strict_types=1);

/*
 * Gmail Inbox — the published Composer package.
 *
 * GENERATED — do not edit. Fix weaver's template/ and regenerate.
 *
 * This runs against the PUBLISHED package, installed by name from the
 * registry into a project that has never seen this repo. Every other test
 * here imports from ../src and therefore cannot see the packaging.
 */

$autoload = getcwd().'/vendor/autoload.php';

if (! is_file($autoload)) {
    fwrite(STDERR, 'No vendor/autoload.php in '.getcwd().PHP_EOL);
    fwrite(STDERR, 'Run this from a project that has composer-required the published package:'.PHP_EOL);
    fwrite(STDERR, '    composer require particle-academy/gmail-inbox-php'.PHP_EOL);
    exit(2);
}

require $autoload;

use ParticleAcademy\Connectors\FakeValues;
use ParticleAcademy\GmailInbox\GmailInboxFaker;

$goldens = [
    [
        'operation' => 'label_list',
        'config' => [],
        'expected' => [
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
        ],
    ],
    [
        'operation' => 'message_get',
        'config' => [],
        'expected' => [
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
        ],
    ],
    [
        'operation' => 'message_list',
        'config' => [],
        'expected' => [
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
        ],
    ],
    [
        'operation' => 'thread_get',
        'config' => [],
        'expected' => [
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
        ],
    ],
];

foreach ($goldens as $golden) {
    $operation = $golden['operation'];
    $config = $golden['config'];

    $fake = new FakeValues(FakeValues::seedForCall('gmail_inbox', $operation, $config));
    $faked = GmailInboxFaker::respond($operation, ['config' => $config, 'fake' => $fake]);

    if ($faked !== $golden['expected']) {
        fwrite(STDERR, "the PUBLISHED package produced different bytes for {$operation}\n");
        fwrite(STDERR, '  got:      '.json_encode($faked)."\n");
        fwrite(STDERR, '  expected: '.json_encode($golden['expected'])."\n");
        exit(1);
    }

    echo "  ok   {$operation}\n";
}

echo "\n  ".count($goldens)." operations verified against the published package.\n";
