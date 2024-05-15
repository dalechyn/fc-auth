# `@fc-auth/relay`

Farcaster Auth HTTP relay server.

## Getting started

Install dependencies:

```sh
pnpm install
```

Start a Redis container:

```sh
docker compose up
```

Run the server:

```sh
pnpm start
```

## About

The Farcaster Auth relay server connects apps and wallets over a temporary stateful channel. Channel sessions are stored in Redis and expire after 1 hour.

Anyone can run their own relay server and connect to it using the `@fc-auth/core` client. Merkle operates and maintains the `relay.farcaster.xyz` server used by Warpcast and available to the public.

You don't need to run a relay server to use Farcaster Auth. If you just want to sign in a user to your app, look at the [`@fc-auth/react`](../../packages/react/) and [`@fc-auth/core`](../../packages/core/) packages.
