+++
title = "Authentication and Authorization"
date = 2026-07-03
updated = 2026-11-10
+++

## Authentication

Authentication is about identity verification, and this is bidirectional.

### Server identity verification

A client performs the following steps to verify the server identity to which the client is talking.

-   Verify server address by checking whether the server URL is correct.
-   Ensure server identity via [transport layer security](@/blog/transport-layer-security.md#authentication).

### Client identity verification

A server uses the credentials provided by the client to identify the client.

## Authorization

Authorization is about permission verification, which determines if a client is allowed to access or modify a specific resource.

### Client permission verification

A server uses the client identity to verify the client permission.

## Authentication and authorization provider

### Active Directory (AD)

-   AD is a directory-based service which uses the Kerberos protocol to verify the credentials provided by the client against its database for authentication.
-   Once authenticated, AD verifies whether the client is in a security group on the Access Control List (ACL) of the directory the client is trying to access.

### OAuth 2.0

-   OAuth 2.0 is an authorization framework that lets an application directs a client to a provider and receives an access token from the provider once the client logs into the provider.
-   The access token contains an opaque string or JSON Web Token (JWT) with custom scope like read, write, or admin, to grant the client with application resource access.

### OpenID Connect (OIDC)

-   OIDC is an authentication extension built on top of OAuth 2.0 to receive an ID token from the provider once the client logs into the provider.
-   The ID token contains a JWT with pre-defined fields like openid and email.

### Identity and Access Management (IAM)

-   IAM can be built upon OIDC and use the credentials provided by the client to identify the client.
-   IAM can use Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC) or JSON policies to check the client operation for authorization.

## References
