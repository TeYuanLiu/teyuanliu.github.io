---
title: "How does Istio support canary deployment?"
excerpt: "Istio provides canary deployment by its nature."
categories:
tags: Istio Canary-Deployment
---

Istio is a service mesh, or networking layer, that provides multiple benefits and canary deployment control is one of them. The idea behind canary deployment is to introduce a new version of a service by first testing it using a small percentage of user traffic, and then gradually increase the percentage if things go well and eventually replace the old version with the new one.

Some container orchestration platforms like Docker or Kubernetes (K8s) provide basic canary deployment functionality, but they have a fundamental problem: the use of instance scaling to indirectly manage the traffic. For example in K8s, all replica pods, regardless of version, are treated the same in the kube-proxy round-robin pool, where pods take turns to handle incoming traffic. Therefore, the only way to manage the amount of traffic that a particular version receives is by controlling the replica ratio. Maintaining canary traffic at small percentages requires many replicas (e.g., 1% would require a minium of 100 replicas). Besides this problem, limited extensibility such as routing traffic based on specific user groups is also a reason why we need another solution.

On the other hand, Istio controls the traffic directly and decides which application version or user group a request should go to. This addresses the issues described above and provide more extensibility.
