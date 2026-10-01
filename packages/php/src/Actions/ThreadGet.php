<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Actions;

use ParticleAcademy\GmailInbox\GmailInbox;
use ParticleAcademy\Connectors\ConnectorConfigException;

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
 * Read every message in a conversation thread, oldest first.
 *
 * GET /gmail/v1/users/{userId}/threads/{id} —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/get
 *
 * This describes the request. The connector client resolves the connection,
 * picks the estate, and either calls Gmail Inbox or calls the faker.
 */
final class ThreadGet
{
    public const OPERATION = 'thread_get';
    public const METHOD = 'GET';
    public const PATH = '/gmail/v1/users/{userId}/threads/{id}';
    public const SIDE_EFFECTS = 'none';

    /**
     * Build the form body for one call.
     *
     * Validation fails loudly and specifically here, rather than three frames
     * later as an "invalid request" from Gmail Inbox.
     *
     * @param array<string,mixed> $config
     * An EMPTY body is `{}`, not `[]` — and PHP cannot tell those apart, because
     * both are `array()` and `json_encode` picks the list. So an empty one is
     * returned as an object. TypeScript and Python have no such ambiguity, which
     * is why this is a difference only the byte-parity suite can see.
     *
     * @return array<string,mixed>|\stdClass
     */
    public static function body(array $config): array|\stdClass
    {
        if (($config['userId'] ?? null) === null || ($config['userId'] ?? null) === '') {
            throw new ConnectorConfigException('thread_get: "userId" is required (Mailbox).');
        }

        if (($config['id'] ?? null) === null || ($config['id'] ?? null) === '') {
            throw new ConnectorConfigException('thread_get: "id" is required (Thread ID).');
        }

        $body = [];

        $body['format'] = 'full';
        $body = $body === [] ? new \stdClass() : $body;
        return $body;
    }

    /**
     * The request path, with each config value URL-ENCODED into it.
     *
     * `PATH` above is the TEMPLATE, which is what the descriptor advertises;
     * this is what a caller sends. A value interpolated raw changes which URL
     * is called — a range like `Sheet1!A:B` or a sheet named `Q1/Q2` — and the
     * provider answers 404 about the document rather than about the encoding.
     *
     * @param array<string,mixed> $config
     */
    public static function path(array $config): string
    {
        return '/gmail/v1/users/'.rawurlencode((string) ($config['userId'] ?? '')).'/threads/'.rawurlencode((string) ($config['id'] ?? ''));
    }
}
