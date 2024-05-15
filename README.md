# Farcaster Auth Monorepo

> This repository is a fork of https://github.com/farcasterxyz/auth-monorepo and continuation of PR https://github.com/farcasterxyz/auth-monorepo/pull/147.
The software is provided AS IS, meaning that it's not guaranteed to be maintained unless the opposite is stated.

This monorepo contains packages and applications related to [Farcaster Auth](https://www.notion.so/warpcast/Farcaster-Connect-Public-9b3e9fb7a4b74f158369796f3e77c1d3).

## Packages

| Package Name                                     | Description                | Use if…                                                                |
| ------------------------------------------------ | -------------------------- | ---------------------------------------------------------------------- |
| [@fc-auth/react](./packages/react) | React components and hooks | You're building a React app and want to authenticate Farcaster users.  |
| [@fc-auth/core](./packages/core)         | Client library             | You're building a Typescript or JS app and want to authenticate users. |
| [@fc-auth/relay](./apps/relay)         | HTTP relay server          | You want to relay connection requests. (You probably don't need this). |
