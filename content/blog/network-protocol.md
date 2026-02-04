+++
title = "Network protocol"
date = 2025-05-01
updated = 2026-02-03
+++

Network protocols define how data moves.
<!-- more -->

## TCP

Transmission Control Protocol (TCP) is a transport layer protocol that ensures reliable delivery.

## UDP

User Datagram Protocol (UDP) is a transport layer protocol that sacrifices reliability for speed.

## QUIC

QUIC is a transport layer protocol based on UDP that provides reliable delivery with speed.

## HTTP

HyperText Transfer Protocol (HTTP) is a communication protocol that defines a set of rules for transferring hypertext data between a client and a server.

### HTTP/1.1

HTTP/1.1 brought in persistent TCP connections and methods like PUT and DELETE.

### HTTP/2

HTTP/2 introduced multiplexing, which enables multiple requests to share one connection.

### HTTP/3

HTTP/3 utilizes QUIC, which is based on UDP instead of TCP, this reduces latency while guarantees delivery reliability.

## HTTPS

HyperText Transfer Protocol Secure (HTTPS) is HTTP with [Transport Layer Security (TLS)](@/blog/transport-layer-security.md).

## REST

Representational State Transfer (REST) is a set of design constraints shown below that ensures a decoupled, efficient, and scalable system.

-   Client-server
    -   Separate the user interface from data storage and processing.
-   Uniform interface
    -   Use consistent resource naming format across the API to give each resource a unique address.
-   Stateless
    -   Each request contains all the information needed to process it.

REST can utilize any communication protocol to satisfy the constraints but most systems use HTTP under the hood.

## Protocol tree

-   TCP
    -   HTTP/1.1 and HTTP/2
        -   REST
        -   GraphQL
        -   gRPC
    -   WebSocket
-   UDP
    -   HTTP/3 (QUIC)
        -   gRPC

## Large data transmission

1.  Fragment large data into multiple packets and send them separately.
1.  Develop a streaming protocol for large data.
1.  Use different data transmission type for metadata and objects.
1.  Develop a cadence to send large data during low-volume time.

## References
