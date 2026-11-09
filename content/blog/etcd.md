+++
title = "Etcd"
date = 2025-11-28
updated = 2026-11-09
+++

Etcd is a distributed key-value store. It is best known for its state storage role in [Kubernetes](@/blog/kubernetes.md) that keeps the single source of truth for all configuration data and cluster states. All Kubernetes objects like pods, deployments, and services, are stored in etcd.
<!-- more -->

## Data model

Etcd stores data in the key-value pair format.

The key is a unique, hierarchical string that serves as the object's address. It is structured like a file path to enable efficient querying and range lookups. It generally follows the format of `/registry/<OBJECT_TYPE>/<OBJECT_NAMESPACE>/<OBJECT_NAME>`, for example, `/registry/pods/default/my-pod`.

The value is the complete YAML/JSON representation of the Kubernetes object, including the `apiVersion`, `kind`, `metadata`, `spec`, and `status`. It is usually stored as a serialized YAML/JSON data blob.

## Data consistency

Etcd uses the [Raft](@/blog/raft.md) consensus algorithm to ensure that all etcd nodes in a cluster agree on a single, ordered sequence of operation.

## Write request

1.  It appends a new entry to its log.
1.  It sends out a heartbeat.
1.  If it gets acknowledgements from the majority, it commits and applies the log entry to its BoltDB (single-instance file-based key-value store).
1.  The leader updates its key-value cache and key-disk-location index.
1.  The leader replies to the client with a success message.

## Read request

1.  It checks the key-value cache. If the key is in the cache, it replies to the client.
1.  Otherwise, it checks the key-disk-location index. If the key is in the index, it reads the value from the BoltDB and replies to the client. It also updates the key-value cache.
1.  Otherwise, it searches in the BoltDB. If the key is in the BoltDB, it reads the value from the BoltDB, and replies to the client. It also updates the key-value cache and key-disk-location index.
1.  Otherwise, it fails the client's read request.

## References
