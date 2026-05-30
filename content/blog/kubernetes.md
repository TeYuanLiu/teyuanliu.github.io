+++
title = "Kubernetes"
date = 2025-05-01
updated = 2026-05-30
+++

Kubernetes is a [container](@/blog/container.md) orchestration engine for containerized application management and provides features like high availability, complex auto-scaling, automatic rollout and rollback, custom scheduling, and service mesh.
<!-- more -->

## Cluster

We need a group of machines to set up a Kubernetes cluster. Each machine has its own CPUs, memory, disk storage, OS, and network device.

## Node

A Kubernetes node usually has one cluster-internal IP and one cluster-external IP.

### Control-plane

#### API server

#### Etcd

See more about [etcd](@/blog/etcd.md).

#### Controller manager

The controller manager is a process that runs built-in Kubernetes controllers (node controller, namespace controller, etc) inside it. For high availability, multiple instances of the controller manager run on the cluster but only one of them is elected as the leader at any given time to avoid conflicting actions.

#### Scheduler

### Worker node

#### Kubelet

#### Kube-proxy

Kube-proxy is a Kubernetes network component running on each node as a pod under the `kube-system` namespace. It implements networking for services like ClusterIP, NodePort, and LoadBalancer. It configures each node's iptables to set up the mapping between a service’s ClusterIP to the service's backend pod IPs.

## Pod

A Pod is the smallest deployable unit in Kubernetes and contains a group of containers that share the same Linux namespaces. A pod contains the following:
-   Pause container
    -   Runs the `pause` command to sleep forever.
    -   Serves as a pod’s root container with Process ID (PID) 1 and owns the Linux namespaces such that the pod can persist even if other application containers have exit. Its lifecycle is bounded with the pod’s lifecycle.
    -   All other containers start with `–net=container:<PAUSE_CONTAINER_ID>` to share the network namespace.
-   Linux namespaces (PID, cgroup, mount, network, etc)
-   Container Network Interface (CNI) configuration
-   Persistent volume and mount-point

### Pod resource consumption

A pod can consume different kinds of resources.

-   CPU
    -   Represent CPU core time share so 0.5 CPU means a CPU core spends 50% of its time running commands of the pod.
-   Memory
    -   Indicate memory for CPU, where Gi for Gibi (2^30) and G for Giga (10^9).
-   GPU
    -   A Nvidia A100 GPU with 80 GB GPU memory can be divided into 7 compute slices and 8 memory slices through Multi-Instance GPU (MIG) technology, so we can split one GPU into `1g.10gb`, `2g.20gb`, `3g.40gb`, and `7g.80gb` instances.
-   Persistent volume
    -   Imply storage backed by storage classes. Its lifecycle is independent of pods.
    -   Have different access modes.
        -   ReadWriteOnce (RWO) for read-write by a single node
        -   ReadOnlyMany (ROX) for read-only by many nodes
        -   ReadWriteMany (RWX) for read-write by many nodes
        -   ReadWriteOncePod (RWOP) for read-write by a single pod

### Pod creation

1.  A user sends a pod creation request to the API server.
1.  The API server performs authentication, authorization, admission control (validation/mutating), writing a pod with empty `nodeName` into the etcd, and then updates the user about the pod creation.
1.  The scheduler watches the API server for any pod with empty `nodeName`, scheduling the pod to a node, and then updates the API server about the pod scheduling.
1.  The kubelet on the assigned node watches the API server for any assigned pod with the matching `nodeName`, working with the Container Runtime Interface (CRI) plugin to create the pod, and then updates the API server about the pod and container creation.

### Pod deletion

1.  A user sends a pod deletion request to the API server.
1.  The API server performs authentication, authorization, admission control (validation/mutating), updating the pod with its `deletionTimestamp` set to the current time in the etcd, and then updates the user about the pod deletion.
1.  The endpoint controller watches the API server for any pod with its `deletionTimestamp` set, removing the pod's IP address from any service endpoint that includes it, and then updates the API server about the pod's IP removal.
1.  The kubelet on the node where the pod is running watches the API server for any pod with its `deletionTimestamp` set, working with the CRI plugin to delete the pod (`SIGTERM` or `SIGKILL`), and then updates the API server about the pod and container deletion.
1.  The API server removes the pod object from the etcd.

### Container

See more about [container](@/blog/container.md).

#### Container command and arguments

The pod's `command` field replaces the container's `ENTRYPOINT` and `args` field replaces `CMD`.

#### Container resource request and limit

-   The resource request defines the guaranteed resource amount that will be given to a container. Kubernetes uses the resource request to determine which node to schedule the pod.
-   The resource limit defines the maximum amount of resource a container can use.
-   Having resource limit but no resource request makes Kubernetes copy the limit over as the request.
-   Missing resource request leads to potential scheduling of the pod on a node that is on the brink of node resource pressure. When the pod starts consuming resources, the node suffers from node resource pressure.
-   Missing resource limit lets a container consume all resource available on the node, leading to node resource pressure.
-   Having CPU limit possibly results in CPU throttling. However, CPU throttling does not crush a container so it's safer to not set the limit.
-   Having memory limit potentially causes Out-Of-Memory (OOM) kill. Because memory shortage does crush a container, we should set the limit to prevent one container from taking away all memory available on the node.
-   Here is the recommended setting.
    -   For CPU, set the request but don't set the limit.
    -   For memory, set the request to 2x of the container max usage and the limit to 2x of the request.

##### Quality of Service (QoS)

When a node resource pressure occurs, the kubelet begins the node-pressure eviction to resolve node resource pressure and protect the node's stability.

-   Best effort
    -   A pod lacking a resource limit is labeled with this QoS class.
    -   It is the first to be evicted during node-pressure eviction.
-   Burstable
    -   A pod that has both request and limit set, with the limit greater than the request, and is exceeding the requested amount is labeled with this QoS class.
    -   It is the next to be evicted during node-pressure eviction.
-   Guaranteed
    -   A pod that has request equal to limit or a burstable pod staying within the requested amount is labeled with this QoS class.
    -   It is the last to be evicted during node-pressure eviction.

#### Container liveness and readiness

Kubernetes relies on the liveness and readiness probe to know what to do with the container.

-   If the liveness probe fails, Kubernetes restarts the container. Therefore, we should keep the liveness logic simple and check nothing external to prevent a slow database call from restarting the entire container.
-   If the readiness probe fails, Kubernetes removes the pod from the service endpoints.

#### Sidecar container

A sidecar container is usually managed via a mutating webhook to run alongside the application container and provides various functionalities.

-   Networking
    -   Istio envoy proxy for routing
-   Observability
    -   Promtail agent/Fluent-Bit agent for logs forwarding
    -   Kube-state-metrics exporter for exposing Kubernetes object metrics in Prometheus format
    -   OpenTelemetry collector for collecting and forwarding telemetry data
    -   Datadog agent for collecting logs, metrics, and traces
-   Security
    -   Falcon sidecar for monitoring runtime security
    -   Cert-manager sidecar for periodic TLS certificate renewing
-   Storage
    -   Redis sidecar for local data caching and periodic write-back to the database

## Deployment

## ReplicaSet

## StatefulSet

## Networking

A Kubernetes cluster has the following:
-   A pod Classless Inter-Domain Routing (CIDR) allocated by the CNI. The CNI allocates each node's pod CIDR and assigns each pod's IP. It also creates a `cni` network device on each node to communicate with the `veth` network device inside a container. The pod CIDR to network device mapping on each node is stored inside the node's routing table.
-   A service CIDR allocated by a service mesh like kube-proxy or Istio. The service CIDR contains virtual IPs without the corresponding network devices.

Whenever a node joins the cluster, the CNI configures the node's:
-   Pod CIDR
-   Routing table
-   Iptables
    -   Filter table
        -   Serve as the firewall to drop packets.
        -   A CNI like Calico uses the filter table to implement NetworkPolicy and allow traffic from a pod to another.
    -   Name Address Translation (NAT) table
        -   Modify the source or destination IP addresses of packets according to pod CIDR and service CIDR mapping rules.
    -   Mangle table
        -   Modify a packet's TTL or TOS field.
-   Network device like `cni` for host-to-container communication and `veth` for host-to-host communication
-   Virtual eXtensible Local-Area Network (VXLAN) tunnels

Whenever a pod is created, the CNI sets up the pod's:
-   Network namespace
    -   Network device
        -   `veth` for container-host communication
    -   Routing table
    -   Iptables (usually empty)

### Service

#### ClusterIP

ClusterIP is the default Kubernetes service type for exposing applications. It provides a stable internal IP for cluster-only access.

#### NodePort

NodePort exposes the service on a static port on each node's IP, allowing external access through the port but not automatically load-balancing across nodes.

#### LoadBalancer

LoadBalancer relies on a cloud provider to create an external load balancer that directs traffic to the service and provides a single, stable external IP address.

#### Pod-to-service networking

##### kube-proxy networking

Here is what happens when a pod makes a request to a service:
1.  The application in a pod makes a request to `https://service.namespace.svc.cluster.local`.
1.  The pod needs to contact the Domain Name Service (DNS) first to get the service ClusterIP. It checks its DNS configuration file and finds the CoreDNS service ClusterIP.
1.  The pod creates a DNS packet inside its network namespace.
    ```
    Src IP = Pod IP (e.g., 10.244.1.5)
    Dst IP = CoreDNS service ClusterIP (e.g., 10.96.123.45)
    ```
1.  The pod sends the packet via its `veth` network device to the host's `cni` network device.
1.  The host's kernel intercepts the packet using NAT table rules configured by kube-proxy and rewrites the destination IP from the CoreDNS service ClusterIP to a CoreDNS pod IP (selected via random or round-robin).
    ```
    10.96.123.45:443 -> 10.244.2.7:443
    ```
1.  The host's kernel sends out the packet to the CoreDNS pod's host.
1.  The CoreDNS pod's host receives the packet and forwards it to the CoreDNS pod.
1.  The CoreDNS pod processes the packet and sends back a response containing the service ClusterIP.
1.  The pod receives the service ClusterIP and then sends a request to the service.

##### Istio service mesh networking

1.  The pod creates a packet inside its network namespace.
1.  The Istio proxy sidecar container running inside the same pod decides which service backend pod IP to use and rewrites the destination IP from the service ClusterIP to a backend pod IP.

#### External to service networking

Extended from the above, here is what happens when an external client makes a request to a service on the cluster.
1.  The external client sends the request packet to the ingress gateway.
1.  The ingress gateway forwards the packet to a virtual service.
1.  The virtual service sends the packet to the corresponding service.

## Storage

Kubernetes uses the Persistent Volume Claim (PVC) to manage storage.

### PVC creation

1.  A user sends a PVC creation request to the API server.
1.  The API server performs authentication, authorization, admission control (validation/mutating), writing an unbound PVC into the etcd, and then updates the user about the PVC creation.
1.  The Container Storage Interface (CSI) controller watches the API server for any unbound PVC, working with a storage system to create a directory as a volume on the storage system's filesystem, and then sends a Persistent Volume (PV) creation request to the API server. The request contains metadata like volume ID, driver details, and `claimRef` for PVC bound.
1.  The API server performs authentication, authorization, admission control (validation/mutating), writing a PV into the etcd, updating the PVC's bound status, and then updates the CSI controller about the PV creation.

### PVC deletion

1.  A user sends a PVC deletion request to the API server.
1.  The API server performs authentication, authorization, admission control (validation/mutating), setting the PVC's deletion status into the etcd, and then updates the user about the PVC deletion.
1.  The CSI controller watches the API server for any PVC deletion, working with the storage system to remove the directory from the filesystem, and then updates the API server about the PVC and PV deletion.
1.  The API server removes the PVC and PV from the etcd.

## Operation

Here is an example directory structure of applying GitOps via ArgoCD application and kustomization files.

```
-   bootstrap
    -   clusters
        -   base
            -   kustomization.yaml
            -   cluster-application.yaml // Watches bootstrap/clusters/base itself.
            -   argocd-application.yaml // Watches bootstrap/argocd/base.
            -   argocd-app-project.yaml
            -   root-application.yaml // Watches applications/clusters/<overlay>.
        -   overlays
            -   test
                -   kustomization.yaml
            -   production
    -   argocd
        -   base
            -   kustomization.yaml
            -   deployment.yaml
            -   service.yaml
        -   overlays
            -   test
                -   kustomization.yaml
            -   production
-   applications
    -   catalog
        -   app-1
            -   base
                -   kustomization.yaml
                -   application.yaml // Watches manifests/app-1/base
            -   overlays
                -   test
                    -   kustomization.yaml
                -   production
    -   clusters
        -   test
            -   kustomization.yaml // A tailored list of applications available at
                                    // applications/catalog/.
        -   production
-   manifests
    -   app-1
        -   base
            -   kustomization.yaml
            -   deployment.yaml
            -   service.yaml
        -   overlays
            -   test
                -   kustomization.yaml
            -   production
```

## Observability

### Prometheus

Prometheus is a metric processing framework that pulls metrics periodically from a service metric/exporter endpoint and stores them in its Time-Series DataBase (TSDB).

We can deploy the kube-prometheus-stack helm chart as a starting point. It includes Prometheus, Grafana, community-built Grafana dashboards, community-built Prometheus alerting rules, and Alertmanager.

To start using it, we may create a `ServiceMonitor` manifest and set its release label to `prometheus` to register the metric endpoint to Prometheus.

If an alerting rule is configured, Prometheus runs its PromQL query periodically to see if the alerting rule fires. If so, it pushes the alert event to a downstream service like Alertmanager.

### Grafana

Grafana is a dashboard framework that pulls data from Prometheus via GraphQL queries for data visualization according to JSON file configurations.

### Alertmanager

Alertmanager is an alerting framework which receives alert events from Prometheus, grouping, inhibiting, silencing alerts, and then propagates them to a downstream notification service like Slack or GoAlert.

## Auto-scaling

-   Vertical pod autoscaler (VPA)
    -   Adjusts the pod resource request/limit based on the resource usage. It recreates the pod without changing the replica count.
    -   Suits stateful workloads which might face synchronization issues if scaling horizontally.
-   Horizontal pod autoscaler (HPA)
    -   Scales the number of pod replicas based on CPU or memory utilization, or an object metric like queue length, or a custom metric.
    -   Suits stateless workloads.
-   Kubernetes event-driven autoscaler (KEDA)
    -   Scales the number of pod replicas based on an external event like the Kafka lag, message queue length, and HTTP request rate.
    -   Supports scale-to-zero.
    -   Uses HPA behind the scenes.
    -   Suits stateless/event-driven workloads.
-   Knative pod autoscaler (KPA)
    -   Scales the number of pod replicas based on concurrency and request-per-second (RPS).
    -   Supports rapid scale-out and scale-to-zero.
    -   Suits stateless workloads with spiky traffic.
-   Cluster Autoscaler (CA)
    -   Scales the number of nodes when a pod is pending as unschedulable due to insufficient cluster capacity.

## Security

-   Make root filesystem read only and run as non-root.
    ```yaml
    security_context:
        read_only_root_filesystem: true
        run_as_non_root: true
    ```

## Client

-   k8s.io/client-go module's clientset for Kubernetes standard resource CRUD operations
-   dynamic client for Kubernetes custom resource CRUD operations

## Controller

-   k8s.io/client-go/tools/cache package's informer for Kubernetes resource watching
-   sigs.k8s.io/controller-runtime module for building Kubernetes controllers

## References
