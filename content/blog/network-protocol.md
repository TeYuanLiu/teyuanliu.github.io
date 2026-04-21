+++
title = "Network protocol"
date = 2025-05-01
updated = 2026-04-20
+++

Since the creation of computer network, people have gradually developed different set of rules for communication, and these are the network protocols.
<!-- more -->

## Network layer

Network has 5 layers, starting from the base of all, the physical layer, all the way to the application layer.

-   Physical
-   Data link
-   Network
-   Transport
-   Application

### Physical

### Data link

The data link layer handles communication between computers on the same network using MAC addresses.

### Network

The network layer handles communication between different networks using IP addresses. It is responsible for getting data to the correct computer.

### Transport

The transport layer ensures the data is properly delivered to the correct application on the computer through port numbers.

#### Protocol tree

-   TCP
    -   HTTP/1.1 and HTTP/2
        -   REST
        -   GraphQL
        -   gRPC
    -   Web socket
-   UDP
    -   HTTP/3 (QUIC)
        -   gRPC

#### TCP

Transmission Control Protocol (TCP) is a transport layer protocol that ensures reliable delivery.

#### UDP

User Datagram Protocol (UDP) is a transport layer protocol that sacrifices reliability for speed.

##### QUIC

QUIC is a transport layer protocol based on UDP that provides reliable delivery with speed.

### Application

#### HTTP

HyperText Transfer Protocol (HTTP) is a communication protocol that defines a set of rules for transferring hypertext data between a client and a server.

##### HTTP/1.1

HTTP/1.1 brought in persistent TCP connections and methods like PUT and DELETE.

##### HTTP/2

HTTP/2 introduced multiplexing, which enables multiple requests to share one connection.

##### HTTP/3

HTTP/3 utilizes QUIC, which is based on UDP instead of TCP, this reduces latency while guarantees delivery reliability.

##### HTTPS

HyperText Transfer Protocol Secure (HTTPS) is HTTP with [Transport Layer Security (TLS)](@/blog/transport-layer-security.md).

##### REST

Representational State Transfer (REST) is a set of design constraints shown below that ensures a decoupled, efficient, and scalable system.

-   Client-server
    -   Separate the user interface from data storage and processing.
-   Uniform interface
    -   Use consistent resource naming format across the API to give each resource a unique address.
-   Stateless
    -   Each request contains all the information needed to process it.

REST can utilize any communication protocol to satisfy the constraints but most systems use HTTP under the hood.

REST benefits from its simplicity and well-developed convention. At the same time, it has its own limitations. Under-fetching and over-fetching are 2 of them.

-   Under-fetching
    -   If an endpoint does not provide enough data, the client has to make multiple requests, creating the N+1 request problem, causing high latency due to multiple network round trips.
-   Over-fetching
    -   If an endpoint, returns more data than the client actually needs, both the client and server waste resource processing useless data.

Of course we can create more endpoints as a workaround, but this practice can lead to endpoint management difficulty. Every time the frontend needs a new kind of data combination, the backend has to make a new endpoint and soon there will be hundreds of endpoints to maintain.

These drawbacks are the reasons why GraphQL was invented.

##### GraphQL

GraphQL resolves under-fetching and over-fetching with its precise-fetching capability.

Instead of having multiple fixed endpoints, we have one endpoint where the client describes exactly what it wants. The client sends the data spec inside a single query to the endpoint and GraphQL uses resolvers, small functions that fetch data for each field, to gather data and form the response.

To avoid the N+1 problem, GraphQL uses batching. During batching, it fires a query to collect all the requested IDs, deduplicating the list, and fire another query gather the rest of the data needed.

The precise-fetching power comes with costs like heavy dependency requirement and caching difficulty.

#### Web socket

#### FTP

#### SMTP

#### SSH

#### DNS

#### DHCP

#### NTP

## Case study

### Large data transmission

1.  Fragment large data into multiple packets and send them separately.
1.  Develop a streaming protocol for large data.
1.  Use different data transmission type for metadata and objects.
1.  Develop a cadence to send large data during low-volume time.

## References
