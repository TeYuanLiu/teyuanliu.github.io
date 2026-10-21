+++
title = "Etcd"
date = 2025-11-28
updated = 2026-10-20
+++

Etcd is a distributed key-value store. It is best known for its state storage role in [Kubernetes](@/blog/kubernetes.md) that keeps the single source of truth for all configuration data and cluster states. All Kubernetes objects like pods, deployments, and services, are stored in etcd.
<!-- more -->

## Data model

Etcd stores data in the key-value pair format.

The key is a unique, hierarchical string that serves as the object's address. It is structured like a file path to enable efficient querying and range lookups. It generally follows the format of `/registry/<OBJECT_TYPE>/<OBJECT_NAMESPACE>/<OBJECT_NAME>`, for example, `/registry/pods/default/my-pod`.

The value is the complete YAML/JSON representation of the Kubernetes object, including the `apiVersion`, `kind`, `metadata`, `spec`, and `status`. It is usually stored as a serialized YAML/JSON data blob.

## Data consistency

Etcd uses the [Raft](@/blog/raft.md) consensus algorithm to ensure that all etcd nodes in a cluster agree on a single, ordered sequence of operation.

## References
