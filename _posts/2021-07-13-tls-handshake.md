---
title: "What is TLS?"
excerpt: "Let's go over some basic knowledge about TLS and illustrate the evolution of the protocol to show how it has evolved into its modern state."
categories:
tags: TLS Https
---

TLS (Transport Layer Security), is a popular protocol for secure data transmission between server and client. It is derived from a deprecated protocol called SSL (Secure Socket Layer).

It provides **confidentiality, integrity, and authentication**, and we can interpret these 3 properties as the following:

- Confidentiality: conceals message content

- Integrity: checks whether message content has been modified by third party

- Authentication: ensures the identity of the party on the other side is genuine.

Let's go over these 3 attributes and see how TLS achieves them.

### Confidentiality

Confidentiality, or data hiding, is usually achieved through encryption, or converting your message from human-readable plaintext into an encoded format known as cipher text, which looks like a sequence of random characters in human eyes. Such Encryption is done by scrambling your message using mathematical functions based on a number called key. Decryption is done in a similar a way.

In symmetric key cryptography, we have one single key used for both encryption and decryption.

On the other hand, in public key cryptography, we have a key pair consists of a public key and a private key. The key pair is mathematically related so that whatever is encrypted with a public or private key can only be decrypted by its counterpart. We cannot use a public key to encrypt something and then decrypt it with the same key.

### Integrity

Integrity, is often accomplished by HMAC (hash-based message authentication code). Let's start from just using a hash function and see how it helps on data integrity.

First, the server and the client agree on a common hash function, for example SHA256. Then, whenever the server is gonna send out a message to the client, it first computes the hash of the message using SHA256, and then appends the hash to the message, forming a bundle. After then, the server sends this bundle to the client.

Once the client receives the bundle which contains both the message and the hash of the message, the client computes its own hash using the message such that it can compare the newly generated hash with the one inside the bundle. If the two match, then we are pretty much sure the message was not tampered along the way... are we?

If an attacker finds a way to intercept the bundle sent from the server, alter the message, and then forward the tampered bundle to the client. The client will immediately know the message was modified as the generated hash won't match the one inside the bundle.

What if the attacker didn't change the message and instead replaced the bundle with the attacker's own bundle, in which the hash was generated using SHA256 as well?

When the client receives the bundle and checks it, everything just looks good, however the entire bundle is not from the server but the attacker. This is a scenario which shows how important authentication is. No matter how much effort you put into data integrity or confidentiality, if the data itself is not authentic, it is just worthless.

So, how can we know the bundle came from the one we intend to communicate with?

To tackle this, HMAC employs not only a hash function but also a shared key. Before data transmission, a preliminary process called key exchange takes place between the server and the client. Only these two parties who participate in the key exchange know the shared key.

When the client verifies the hash, it runs the hash function, SHA256 in this case, with both the message and the shared key as the function input to produce its own hash. In this way, the two parties can verify whether the the message and the hash really came from the party they are supposed to be transacting with.

### Authentication

Finally we are here talking about authentication. We have discussed about it a little in the previous section, saying that using a shared key to ensure data authentication. But what if this the first time the client interacts with the server? The client doesn't know with whom it is doing those key exchange process. It may be the expected server, or it may be not.

Is there a way for the client to authenticate the server without exchanging credentials?

TLS certificate is the answer. Recall the public/private key pair we discussed in public key cryptography. TLS uses these keys to authenticate the server to the client. A certificates is basically a public key along with some metadata such as expiration date.

Now, here is a simple way to authenticate the server to the client.

#### Approach #1

1. The client sends a hello message to the server. The message contains which TLS version and which cipher suites the client supports, and a string of random bytes called the client random.

2. The server puts its public key together with some metadata to form a certificate. A hash of the certificate is generated, encrypted with its private key, and then appended to the certificate. The server sends this updated certificate along with the server's chosen cipher suite, and another string of random bytes known as the server random, to the client.

3. Once received the message, the client decrypts the encrypted certificate hash using the public key inside the message. Then the client calculates its own certificate hash to compare the newly-generated one with the one in the message. If they are equal the certificate is valid.

4. The client sends one more string of random bytes, known as the premaster secret, which is encrypted with the server's public key.

5. The server decrypts the premaster secret.

6. Both client and server generate the session key, which is a symmetric key, from the client random, the server random, and the premaster secret. The generated session keys should be the same.

7. The client sends a finished message encrypted with the session key.

8. The server responds with a finished message encrypted with the session key.

9. The handshake is completed and data transfer continues using the session key.

The encrypted certificate hash appended to the certificate is called a digital signature. In the above scenario, the server digitally signed its own certificate, and this is called a self-signed certificate.

Approach #1 has a flaw that we have seen before. If an attacker manages to replace the bundle with the attacker's, the client can't tell the difference.

This is when a third-party kicks in and provides a way to solve it.

A CA (Certification Authority) now claims it will help authenticate others to make sure nobody impersonates anyone. The CA first releases its own certificate which contains the public key to the crowd by bundling it with operating system and browser, and then has an agreement with the server. For every incoming client...

#### Approach #2

1. The client sends a hello message to the server. The message contains which TLS version and which cipher suites the client supports, and the client random.

2. The server puts its public key together with some metadata to form a certificate, then sends the certificate to the CA.

3. The CA receives the certificate. It generates a hash of the certificate, and then encrypts it with the CA's private key, forming a digital signature. It then appends the digital signature to the certificate and returns this updated certificate to the server.

4. The server sends the certificate along with the server's chosen cipher suite and the server random to the client.

5. Once received the message, the client decrypts the digital signature using the CA's public key to get the server's certificate hash. Then the client calculates the certificate hash by itself to compare the newly-generated one with the one obtained from the digital signature. If they are equal the certificate is valid.

6. The client sends the premaster secret, which is encrypted with the server's public key.

7. The server decrypts the premaster secret.

8. Both client and server generate the session key from the client random, the server random, and the premaster secret. The generated session keys should be the same.
9. The client sends a finished message encrypted with the session key.

10. The server responds with a finished message encrypted with the session key.

11. The handshake is completed and data transfer continues using the session key.

### Wrapping up

Congratulations! We have learned all 3 properties of TLS and how the TLS handshake is done. It is kind of exciting for me to get into how TLS works and the steps of handshake as I was thinking of possible security issues and ways to address them during the learning process. Network security is really a big topic nowadays and we have just scratched the surface of it, so keep on learning more!

### References

- [SSL/TLS beginner's tutorial](https://medium.com/talpor/ssl-tls-authentication-explained-86f00064280)
- [Public Keys and Private Keys in Public Key Cryptography](https://sectigo.com/resource-library/public-key-vs-private-key)
- [What happens in a TLS handshake?](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/)
