<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Actions;

use ParticleAcademy\GmailInbox\GmailInbox;
use ParticleAcademy\Connectors\ConnectorConfigException;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/mailbox-stop.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/mailbox-stop.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail_inbox
 */
/**
 * Turn off push notifications for a mailbox.
 *
 * POST /gmail/v1/users/{userId}/stop —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users/stop
 *
 * This describes the request. The connector client resolves the connection,
 * picks the estate, and either calls Gmail Inbox or calls the faker.
 */
final class MailboxStop
{
    public const OPERATION = 'mailbox_stop';
    public const METHOD = 'POST';
    public const PATH = '/gmail/v1/users/{userId}/stop';
    public const SIDE_EFFECTS = 'idempotent';

    /**
     * Build the JSON body for one call.
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
            throw new ConnectorConfigException('mailbox_stop: "userId" is required (Mailbox).');
        }

        $body = [];

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
        return '/gmail/v1/users/'.rawurlencode((string) ($config['userId'] ?? '')).'/stop';
    }
}
