<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Actions;

use ParticleAcademy\GmailInbox\GmailInbox;
use ParticleAcademy\Connectors\ConnectorConfigException;

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
 * List what changed in a mailbox since a history id: messages added or
 * deleted, labels added or removed.
 *
 * GET /gmail/v1/users/{userId}/history —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list
 *
 * This describes the request. The connector client resolves the connection,
 * picks the estate, and either calls Gmail Inbox or calls the faker.
 */
final class HistoryList
{
    public const OPERATION = 'history_list';
    public const METHOD = 'GET';
    public const PATH = '/gmail/v1/users/{userId}/history';
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
            throw new ConnectorConfigException('history_list: "userId" is required (Mailbox).');
        }

        if (($config['startHistoryId'] ?? null) === null || ($config['startHistoryId'] ?? null) === '') {
            throw new ConnectorConfigException('history_list: "startHistoryId" is required (Start history id).');
        }

        $maxResults = $config['maxResults'] ?? null;
        if (($maxResults !== null && $maxResults !== '') && ! (is_numeric($maxResults) && (float) $maxResults === floor((float) $maxResults) && (float) $maxResults >= 1 && (float) $maxResults <= 500)) {
            throw new ConnectorConfigException(
                'history_list: "maxResults" must be a integer, got '.json_encode($maxResults).'.'
            );
        }

        $body = [];

        $value = $config['startHistoryId'] ?? null;
        $body['startHistoryId'] = (string) $value;

        $value = $config['historyTypes'] ?? null;
        if ($value !== null && $value !== '') {
            $body['historyTypes'] = (string) $value;
        }

        $value = $config['labelId'] ?? null;
        if ($value !== null && $value !== '') {
            $body['labelId'] = (string) $value;
        }

        $value = $config['maxResults'] ?? null;
        $body['maxResults'] = ($value !== null && $value !== '') ? (int) $value : 100;

        $value = $config['pageToken'] ?? null;
        if ($value !== null && $value !== '') {
            $body['pageToken'] = (string) $value;
        }

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
        return '/gmail/v1/users/'.rawurlencode((string) ($config['userId'] ?? '')).'/history';
    }
}
