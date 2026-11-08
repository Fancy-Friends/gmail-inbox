<?php

declare(strict_types=1);

namespace ParticleAcademy\GmailInbox\Triggers;

use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\Connectors\CursorRead;
use ParticleAcademy\Connectors\DeliveryDecode;
use ParticleAcademy\Connectors\DeliveryMechanism;
use ParticleAcademy\Connectors\ExpiresAtUnit;
use ParticleAcademy\Connectors\LeaseDeclaration;
use ParticleAcademy\Connectors\OidcDelivery;
use ParticleAcademy\Connectors\Transport;
use ParticleAcademy\GmailInbox\GmailInbox;
use ParticleAcademy\GmailInbox\Actions\HistoryList;

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
 * Gmail Inbox's subscription trigger — the delivery contract.
 *
 * Kept beside the service descriptor rather than inside a node, because the
 * way a delivery is verified is a fact about GMAIL INBOX. The twin of the js
 * package's trigger module.
 *
 * A SUBSCRIPTION: Gmail Inbox stops delivering unless somebody renews it,
 * forever, and if nobody does the workflow stops firing with no error
 * anywhere. `lease()` says where the expiry is read from and how early to
 * renew; the host builds the value with `SubscriptionLease::fromResponse()`
 * and runs ONE renewal scheduler for every expiring trigger.
 */
final class MessageReceived
{
    public const OPERATION = 'message_received';
    public const DELIVERY = DeliveryMechanism::Subscription;

    public const SETUP = 'In YOUR app\'s Google Cloud project (the one owning the OAuth client): create a Pub/Sub topic, grant publish on it to gmail-api-push@system.gserviceaccount.com, and create a PUSH subscription to the route your host mounts for this trigger, with authentication on (a service account you choose; the endpoint URL as the audience). Put that audience and service account on the connection as pushAudience and pushServiceAccount, and fetch Google\'s signing keys for verification. Then call mailbox_watch with the topic for each mailbox and store its historyId as the trigger\'s cursor (startHistoryId); renew the watch daily. ONE topic serves every mailbox: route each push by its emailAddress, and only after the token verifies, to a mailbox you watched; drop an unmapped address with a 2xx. Persist cursor.next when a run succeeds. On cursor-expired or cursor-overflow, watch again for a fresh historyId FIRST, then list with message_list using the resyncQuery, and match it against the mail you already handled. This trigger never changes read state.';

    /** How long Gmail Inbox keeps a subscription alive at most, in seconds. */
    public const SUBSCRIPTION_TTL = 604800;

    /** Which of this package's actions create, renew and stop the subscription. */
    public const CREATE_OPERATION = 'mailbox_watch';

    /** The action the host calls when the lease is due. */
    public const RENEW_OPERATION = 'mailbox_watch';

    public const STOP_OPERATION = 'mailbox_stop';

    /**
     * The lease this subscription carries: where the provider's expiry sits in the
     * `mailbox_watch` response (`expiration`, epoch-ms), how early the host
     * renews, and what it calls when the lease is due.
     */
    public static function lease(): LeaseDeclaration
    {
        return new LeaseDeclaration(
            'expiration',
            ExpiresAtUnit::EpochMs,
            86400,
            'mailbox_watch',
        );
    }

    /** The header carrying `Bearer <token>`, which Gmail Inbox's push is authenticated by. */
    public const TOKEN_HEADER = 'Authorization';

    /** The accepted `iss` values. */
    public const ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

    /** The claim naming who the token was minted for; it must EQUAL the configured principal. */
    public const PRINCIPAL_CLAIM = 'email';

    /** A claim that must be the literal true beside it, or null. */
    public const VERIFIED_CLAIM = 'email_verified';

    /** The credential holding the audience the push subscription was created with. */
    public const AUDIENCE_CREDENTIAL = 'pushAudience';

    /** The credential holding the service account the subscription pushes as. */
    public const PRINCIPAL_CREDENTIAL = 'pushServiceAccount';

    /**
     * Verify one inbound Gmail Inbox delivery.
     *
     * The host calls this BEFORE starting a run. The body proves nothing here: the
     * delivery is authenticated by the bearer token in its header. `$keys` are the
     * provider's signing keys (its JWKS `keys`), fetched and cached by the HOST;
     * nothing in this package fetches them. The audience and principal are the
     * connection's `pushAudience` and `pushServiceAccount`, and both are REQUIRED:
     * an unchecked audience accepts every token the provider signs for anyone, and
     * an unchecked principal accepts a stranger's subscription aimed at your URL.
     * Any of the three missing refuses every delivery.
     *
     * @param array<string,string|list<string>> $headers
     * @param list<array<string,mixed>> $keys
     * @return array{ok: bool, reason: ?string}
     */
    public static function verifyDelivery(
        string $raw,
        array $headers,
        array $keys,
        ?string $pushAudience,
        ?string $pushServiceAccount,
        ?int $now = null,
    ): array {
        unset($raw);

        $scheme = [
            'kind' => 'oidc-jwt',
            'header' => self::TOKEN_HEADER,
            'issuers' => self::ISSUERS,
            'principalClaim' => self::PRINCIPAL_CLAIM,
        ];
        if (self::VERIFIED_CLAIM !== null) {
            $scheme['verifiedClaim'] = self::VERIFIED_CLAIM;
        }

        return OidcDelivery::verify(
            headers: $headers,
            scheme: $scheme,
            keys: $keys,
            audience: $pushAudience,
            principal: $pushServiceAccount,
            now: $now,
        );
    }

    /** Where the follow-up read's cursor goes and comes from: the HOST stores it, seeded from mailbox_watch's historyId. */
    public const CURSOR = ['param' => 'startHistoryId', 'advanceFrom' => 'historyId', 'page' => ['param' => 'pageToken', 'from' => 'nextPageToken', 'collect' => 'history', 'maxPages' => 20], 'expiredStatus' => 404];

    /**
     * Read what changed since the HOST's stored cursor: `history_list` from
     * `$config['startHistoryId']`, every page, `history` concatenated, published
     * under `history` with `cursor: {used, next}`. Persist `cursor.next` once the
     * run succeeds. A lapsed cursor (cursor-expired) or too many pages
     * (cursor-overflow) throws CursorReadException BY NAME with the bounded resync
     * query; a missing one (cursor-missing) calls nothing. In fake mode with no
     * stored cursor the read is faked from a placeholder.
     *
     * @param array<string,mixed> $config
     * @param array<string,string>|null $credentials
     * @return array<string,mixed>
     */
    public static function readAfter(
        mixed $event,
        array $config,
        ?array $credentials = null,
        ?Transport $transport = null,
        ?ConnectorClient $client = null,
    ): array {
        $service = GmailInbox::descriptor();
        $readConfig = ['userId' => 'me', 'maxResults' => 100];
        if (($config['connection'] ?? null) !== null) {
            $readConfig['connection'] = $config['connection'];
        }
        if (($config['mode'] ?? null) !== null) {
            $readConfig['mode'] = $config['mode'];
        }
        $readConfig['labelId'] = $config['labelId'] ?? 'INBOX';
        $readConfig['historyTypes'] = $config['historyTypes'] ?? 'messageAdded';
        $stored = $config['startHistoryId'] ?? (($config['mode'] ?? null) === 'fake' ? '1' : null);

        $read = CursorRead::read(
            self::CURSOR,
            $stored,
            static function (array $params) use ($service, $readConfig, $event, $credentials, $transport, $client): mixed {
                $c = array_merge($readConfig, $params);

                return ($client ?? new ConnectorClient)->call(
                    $service,
                    HistoryList::OPERATION,
                    $c,
                    [
                        'method' => HistoryList::METHOD,
                        'path' => HistoryList::path($c),
                        'query' => HistoryList::body($c),
                    ],
                    $event,
                    credentials: $credentials,
                    transport: $transport,
                )->data;
            },
            resyncQuery: 'newer_than:'.((string) ($config['resyncWindowDays'] ?? 7)).'d',
        );

        $value = is_array($event) ? $event : [];
        $value['history'] = $read['data'];
        $value['cursor'] = $read['cursor'];

        return $value;
    }

    /** The ONE key a host may route a delivery by: only after verification, only to a connection it minted; an unmapped key is dropped with a 2xx. */
    public const ROUTE = ['by' => 'emailAddress', 'path' => 'data.emailAddress'];

    /** How a VERIFIED delivery is read: its body is not plain JSON. */
    public const DECODE = ['kind' => 'pubsub-push'];

    /**
     * Read one VERIFIED Gmail Inbox delivery: pubsub-push, the provider's envelope
     * unwrapped to the message it carries. The host calls this AFTER
     * `verifyDelivery` has accepted it, with the SAME raw bytes, and starts the
     * run with what it returns. A body that cannot be read is refused by name
     * (PubSubPushException), never passed on.
     */
    public static function decodeDelivery(string $raw): mixed
    {
        return DeliveryDecode::apply(self::DECODE, $raw);
    }
}
