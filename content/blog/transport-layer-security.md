+++
title = "Transport Layer Security"
date = 2025-11-29
updated = 2026-01-02
+++

Transport Layer Security (TLS), is a popular protocol for secure data transmission between client and server. It is derived from a deprecated protocol called Secure Socket Layer (SSL).
<!-- more -->

## Features

It provides features like confidentiality, integrity, and authentication. We can interpret these 3 properties as the following:
-   Confidentiality
    -   Conceals the message content.
-   Integrity
    -   Checks whether the message content has been modified by a third party.
-   Authentication
    -   Ensures the identity of the party on the other side is genuine.

Let's go over these 3 attributes and see how TLS achieves them.

### Confidentiality

Confidentiality, or data hiding, is usually achieved through encryption. An encryption operation converts your message from human-readable plaintext into an encoded format known as cipher text, which looks like a sequence of random characters in human eyes. Such Encryption is done by scrambling your message using mathematical functions based on a key, which is usually a number. Decryption is done in a similar a way.

In symmetric key cryptography, we have one single key used for both encryption and decryption.

On the other hand, in public key cryptography, we have a key pair consists of a public key and a private key. The key pair is mathematically related so that whatever is encrypted with a public or private key can only be decrypted by its counterpart. We cannot use a public key to encrypt something and then decrypt it with the same public key.

### Integrity

Integrity, is often accomplished by Hash-based Message Authentication Code (HMAC). Let's start from just using a hash function and see how it helps on data integrity.

First, the server and the client agree on a common hash function, for example SHA256. Then, whenever the server is gonna send out a message to the client, it first computes the hash of the message using SHA256, and then appends the hash to the message, forming a bundle. After then, the server sends this bundle to the client.

Once the client receives the bundle which contains both the message and the hash of the message, the client computes its own hash using the message such that it can compare the newly-generated hash with the one inside the bundle. If the two match, then we are pretty sure the message was not tampered along the way... are we?

If an attacker finds a way to intercept the bundle sent from the server, alter the message, and then forward the tampered bundle to the client. The client will immediately know the message was modified as the generated hash won't match the one inside the bundle.

But what if the attacker didn't change the message and instead replaced the bundle with the attacker's own bundle, in which the hash was generated using SHA256 as well?

When the client receives the bundle and checks it, everything just looks good, however the entire bundle is not from the server but the attacker. This is a scenario which shows how important authentication is. No matter how much effort you put into data confidentiality or integrity, if the data itself is not authentic, it is just worthless.

### Authentication

So, how can we know whether the bundle is coming from the one we intend to communicate with?

To tackle this, HMAC employs not only a hash function but also a shared key. Before data transmission, a preliminary process called key exchange takes place between the server and the client. Only these two parties who participate in the key exchange know the shared key. This shared key is then used for message encryption and decryption during the communication.

Using a shared key does ensure data authentication to some extent. But what if this is the first time the client interacts with the server? The client doesn't know with whom it is doing the key exchange process. It may be the expected server, or it may be someone else.

Is there a way for the client to authenticate the server without exchanging credentials?

TLS certificate is the answer. Recall the public/private key pair we discussed in public key cryptography. TLS uses these keys to authenticate a server to a client. A certificate is basically a public key with some metadata such as expiration date.

Now, here is a simple way to authenticate the server to the client.

#### Approach #1

1.  The client sends a hello message to the server. The message contains which TLS version and which cipher suites the client supports, and a sequence of random bytes called the client random.
1.  The server puts its public key together with some metadata to form a certificate. A hash of the certificate is generated, encrypted with its private key, and then appended to the certificate. The server sends a packet containing the certificate, the cipher suite chosen by the server, and another sequence of random bytes known as the server random, to the client.
1.  The client decrypts the encrypted certificate hash using the public key inside the certificate. Then the client calculates its own certificate hash to compare the newly-generated one with the one in the message. If they are equal the certificate is valid and the server public key is authentic.
1.  The client sends one more sequence of random bytes, known as the premaster secret, which is encrypted with the server public key, to the server.
1.  The server decrypts and gets the premaster secret.
1.  Both the client and server generate the session key, which is a symmetric key, based on the client random, the server random, and the premaster secret. The generated session keys should be the same.
1.  The client sends a finished message encrypted with the session key.
1.  The server responds with a finished message encrypted with the session key.
1.  The handshake is completed and the data transfer continues using the session key.

The encrypted certificate hash appended to the certificate is called a digital signature. In the above scenario, the server digitally signed its own certificate, and this is called a self-signed certificate.

Approach #1 has a flaw that we have seen before. If an attacker manages to replace the bundle with the attacker's, the client can't tell the difference.

This is when a third-party kicks in and provides a way to solve it.

A Certification Authority (CA) now claims it can help authenticate others to make sure nobody impersonates anyone. The CA first releases a certificate which contains its public key to the crowd by bundling it with operating systems and browsers. The CA then makes an agreement with the server to help sign the server certificate, and this brings us to the second approach.

#### Approach #2

1.  The client sends a hello message to the server. The message contains which TLS version and which cipher suites the client supports, and the client random.
1.  The server puts its public key together with some metadata to form a certificate, then sends the certificate to the CA.
1.  The CA generates a hash of the received certificate, and then encrypts it with the CA private key, forming a digital signature. It then appends the digital signature to the certificate and returns it to the server.
1.  The server sends the certificate along with the cipher suite chosen by the server and the server random to the client.
1.  The client decrypts the digital signature using the CA public key to get the server certificate hash. Then the client calculates the certificate hash and compare the newly-generated one with the one obtained from the digital signature. If they are equal the certificate is valid and the server public key is authentic.
1.  The client sends the premaster secret, which is encrypted with the server public key, to the server.
1.  The server decrypts and gets the premaster secret.
1.  Both the client and server generate the session key based on the client random, the server random, and the premaster secret. The generated session keys should be the same.
1.  The client sends a finished message encrypted with the session key.
1.  The server responds with a finished message encrypted with the session key.
1.  The handshake is completed and the data transfer continues using the session key.

### Summary

Congratulations! We have learned all 3 properties of TLS and how the TLS handshake is done. It is kind of exciting for me to get into how TLS works and the steps of handshake as I was thinking of possible security issues of web apps and the ways to address them. Network security is really a big topic nowadays and we have just scratched the surface of it, so keep on learning more!

### References

-   [SSL/TLS beginner's tutorial](https://medium.com/talpor/ssl-tls-authentication-explained-86f00064280)
-   [Public Keys and Private Keys in Public Key Cryptography](https://sectigo.com/resource-library/public-key-vs-private-key)
-   [What happens in a TLS handshake?](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/)
