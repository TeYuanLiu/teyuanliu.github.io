+++
title = "Model Inference"
date = 2026-06-09
updated = 2026-06-29
+++

-   backend
    -   vllm
        -   text-generation-model-1
            -   pvc
            -   deployment
                -   command
                    -   api key
                -   env
                    -   api key
                    -   vllm-text-generation-model-1 parameters dir path
                    -   hf token
                -   ports
            -   service
    -   tei
        -   text-embedding-model-1
            -   pvc
            -   deployment
                -   args
                    -   api key
                    -   port
                -   env
                    -   api key
                    -   tei-text-embedding-model-1 parameters dir path
                -   ports
            -   service
-   hf token external secret
-   litellm
    -   database creds external secret
    -   stateful set
        -   env
            -   database username
            -   database password
        -   ports
    -   litellm key external secret
    -   api key external secret
    -   config
        -   litellm key
        -   database url
        -   models
            -   vllm-text-generation-model-1
                -   vllm-text-generation-model-1 api url
                -   api key
            -   tei-text-embedding-model-1
                -   tei-text-embedding-model-1 api url
                -   api key
        -   metric
    -   deployment
        -   args
            -   config
        -   env
            -   litellm key
            -   database url
            -   database username
            -   database password
            -   api key
        -   ports
    -   service
        -   database
        -   litellm
-   istio
    -   certificate
    -   gateway
    -   virtual service
-   service monitor
    -   litellm

## References
