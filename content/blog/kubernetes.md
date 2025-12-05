+++
title = "Kubernetes"
date = 2025-05-01
updated = 2025-11-30
+++

Kubernetes is a [container](@/blog/container.md) orchestration engine for containerized application management and provides features like high availability, complex auto-scaling, automatic rollout and rollback, custom scheduling, and service mesh.
<!-- more -->

## Cluster

We need a groups of machines to set up a Kubernetes cluster. Each machine has its own CPUs, memory, disk storage, OS, and network device.

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

Kube-proxy is a Kubernetes network component running on each node as a pod under the `kube-system` namespace. It implements networking for services like ClusterIP, NodePort, and LoadBalancer. It configures the iptables of a node to a service’s ClusterIP to the IP of one of the service backend pods.

## Pod

A Pod is the smallest deployable unit in Kubernetes and contains a group of containers that share the same Linux namespaces. A pod contains the following:
-   Pause container
    -   Runs the `pause` command to sleep forever.
    -   Serves as the pod’s root container with Process ID (PID) 1 and owns the Linux namespaces so even if the application container exits the pod still persists. Its lifecycle is bounded with the pod’s lifecycle.
    -   All other containers start with `–net=container:<PAUSE_CONTAINER_ID>`.
-   Linux namespaces (PID, IPC, cgroup, mount, UID, network)
-   Container Network Interface (CNI) configuration
-   Persistent volume and mount-point

### Pod creation

1.  A user sends a pod creation request to the API server.
1.  The API server performs authentication, authorization, admission control (validation/mutating), writing the desired pod object with empty `nodeName` into etcd, and then notifies the user that the pod is created.
1.  The scheduler watches the API server for empty `nodeName`, scheduling the pod to a node, and then updates the API server.
1.  The kubelet on the assigned node watches the API server for `nodeName` matching objects, working with a Container Runtime Interface (CRI) to create the pod, and then updates the API server.

### Pod deletion

1.  A user sends a pod deletion request to the API server.
1.  The API server performs authentication, authorization, admission control (validation/mutating), setting the the pod object's `deletionTimestamp` to the current time in etcd, and then notifies the user that the pod is deleted.
1.  The endpoint controller watches the API server for `deletionTimestamp`, removing the pod's IP address from any service endpoint that includes it.
1.  The kubelet on the node where the pod is running watches the API server for `deletionTimestamp`, working with a Container Runtime Interface (CRI) to delete the pod (`SIGTERM` or `SIGKILL`), and then updates the API server.
1.  The API server removes the pod object from etcd.

### Container

See more about [container](@/blog/container.md).

#### Container command and arguments

The pod's `command` field replaces the container's `ENTRYPOINT` and `args` field replaces `CMD`.

#### Container resource request and limit

The resource request defines the guaranteed resource amount that will be given to the container. The scheduler uses resource request to determine which node to schedule for a pod.

The resource limit defines the maximum amount of resource a container can use. A container hitting the limits can cause CPU throttling or OOM kill.

Setting both request and limit to 2x of the average resource usage is a good starting point. If the average usage is unknown, cloud providers like GCP recommends 1 CPU and 4Gi memory.

If a resource's request is missing but its limit is set, the Kubernetes API server will copy the limit to the request.

Missing both request and limit configurations may cause that too many pods are scheduled on the same node, throttling the CPUs and using up memory. If cluster autoscaler is enabled, this may result in unnecessary scale-out and lead to a waste of resource/money.

#### Container liveness and readiness

Kubernetes relies on a liveness probe to know if a container is alive or needs a restart, and readiness probe to know if a container is ready to serve requests or stop sending requests to the container’s pod.

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
    -   Falco sidecar for monitoring runtime security
    -   Cert-manager sidecar for periodic TLS certificate renewing
-   Storage
    -   Redis sidecar for local data caching and periodic write-back to the database

## Deployment

## ReplicaSet

## StatefulSet

## Networking

A Kubernetes cluster has the following:
-   One pod Classless Inter-Domain Routing (CIDR) allocated by the CNI plugin that is distributed across nodes and each pod gets its own IP.
-   One service CIDR allocated by the Kubernetes API server via kube-proxy that contains virtual IPs, which do not have the corresponding network devices, so it is different from the pod CIDR.

Whenever a node joins the cluster, the Container Networking Interface (CNI) configures the node's:
-   Pod CIDR
-   Routing table
-   Network device like virtual ethernet `veth`
-   Virtual eXtensible Local-Area Network (VXLAN) tunnels

Whenever a pod is created, CNI sets up the pod's:
-   Network namespace
    -   Network device
    -   Routing table
    -   Iptables
        -   Filter table (firewall)
            -   CNIs like Calico uses the filter table to implement NetworkPolicy and allow traffic from a pod to another.
        -   Name Address Translation (NAT) table
        -   Mangle table (packet modification)

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
1.  The application in a pod makes a request to `https://servie.namespace.svc.cluster.local`.
1.  The pod needs to contact the Domain Name Service (DNS) server first to get the service's ClusterIP. It checks its DNS configuration file and finds the CoreDNS service ClusterIP.
1.  The pod creates a DNS packet inside its network namespace.
    ```
    Src IP = Pod IP (e.g., 10.244.1.5)
    Dst IP = CoreDNS service ClusterIP (e.g., 10.96.123.45)
    ```
1.  The pod sends the packet to the host's network namespace via `veth`.
1.  The host's kernel intercepts the packet using iptables rules configured by kube-proxy and rewrites the destination IP from the CoreDNS service ClusterIP to a CoreDNS pod IP (selected via random or round-robin).
    ```
    10.96.123.45:443 -> 10.244.2.7:443
    ```
1.  The host's kernel sends out the packet to the CoreDNS pod's host.
1.  The CoreDNS pod's host receives the packet and forwards it to the CoreDNS pod's network namespace via `veth`.
1.  The CoreDNS pod processes the packet and sends back a response containing the service's ClusterIP.
1.  The pod receives the service's ClusterIP and then goes through the same process as before to send the request to the service.

##### Istio service mesh networking

1.  The pod creates a packet inside its network namespace.
1.  The Istio proxy sidecar container running inside the same pod decides which service backend pod IP to use and rewrites the destination IP from the service ClusterIP to a backend pod IP.

#### External to service networking

Extended from the above, here is what happens when an external client makes a request to a service on the cluster.
1.  The external client sends the request packet to the ingress gateway.
1.  The ingress gateway forwards the packet to a virtual service.
1.  The virtual service sends the packet to the corresponding service.

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

We can deploy the kube-prometheus-stack helm chart as a starting point. It includes Prometheus, community-built Prometheus alerting rules, Grafana, and community-built Grafana dashboards.

To start using it, we may create a ServiceMonitor manifest and set its release label to `prometheus` to register the metric endpoint to Prometheus.

If an alerting rule is configured, Prometheus runs its PromQL query periodically to see if the alerting rule fires. If so, it pushes the alert event to downstream services like Alertmanager.

### Grafana

Grafana is a dashboard framework that pulls data from Prometheus via GraphQL queries for data visualization according to JSON file configurations.

### Alertmanager

Alertmanager is an alerting framework which receives alert events from Prometheus, grouping, inhibiting, silencing alerts, and then propagates them to downstream notification services like Slack or GoAlert.

### Auto-scaling

-   Vertical pod autoscaler (VPA)
    -   Adjusts the pod resource request/limit based on the resource usage It recreates the pod without changing the replica count.
    -   Suits stateful workloads which might face synchronization issues if scaling horizontally.
-   Horizontal pod autoscaler (HPA)
    -   Scales the number of pod replicas based on CPU or memory utilization, object metrics like queue length, or custom metrics.
    -   Suits stateless workloads.
-   Kubernetes event-driven autoscaler (KEDA)
    -   Scales the number of pod replicas based on external events like Kafka lag, message queue length, and HTTP request rate.
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

## See also
