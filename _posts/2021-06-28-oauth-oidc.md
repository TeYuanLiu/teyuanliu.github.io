---
title: "Authorization and authentication: OAuth 2.0 and OpenID Connect"
date: 2021-06-28
excerpt: "A common way for applications to know who you are and what can you do."
categories:
tags: OAuth2 OpenID
---

OAuth 2.0 redirects user from an application to an identity provider (IdP). After user logs into the IdP, IdP passes an access token to the application such that the application can take actions or access resources in IdP on behalf of the user.

OpenID Connect is based on OAuth 2.0 and uses an additional JSON Web Token (JWT) called an ID token to pass user information like name and email from the IdP to the application so it can complete authentication process for the user.
