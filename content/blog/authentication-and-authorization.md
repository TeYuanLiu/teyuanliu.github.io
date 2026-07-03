+++
title = "Authentication and Authorization"
date = 2026-07-03
updated = 2026-07-03
+++

## Authentication

Authentication is about identity verification, and this is bidirectional.

### Server identity verification

A user performs the following steps to verify the server identity to which the user is talking.

-   Verify server address by checking whether the server URL is correct.
-   Ensure server identity via [transport layer security](@/blog/transport-layer-security.md#authentication).

### Client identity verification

A server uses the credentials provided by the user the identify the user.

## Authorization

## Authentication and authorization provider

### OAuth 2.0

-   OAuth 2.0 is an authorization framework that lets an application directs a user to a provider and receives an access token from the provider once the user logs into the provider.
-   The access token contains an opaque string or JSON Web Token (JWT) with custom scope like read, write, or admin, to grant the user with application resource access.

### OpenID Connect

-   OpenID Connect (OIDC) is an authentication extension built on top of OAuth 2.0 to receive an ID token from the provider once the user logs into the provider.
-   The ID token contains a JWT with pre-defined fields like openid and email.

## References
