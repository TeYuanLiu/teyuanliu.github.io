+++
title = "AI Agent"
date = 2026-06-29
updated = 2026-06-29
+++

AI agents are good at repetitive tasks that have huge amount of documentation and data. These tasks usually have a converged solution pattern and can be handled by an AI agent.

## Development loop

{% mermaid() %}
flowchart TB
    clarify-requirements --> design-system
    design-system --> implement-system
    implement-system --> verify-requirement-fulfillment
    verify-requirement-fulfillment -- failure --> debug-implementation
    debug-implementation --> verify-requirement-fulfillment
    verify-requirement-fulfillment -- success --> write-tests
    write-tests --> verify-tests
    verify-tests -- failure --> debug-tests
    debug-tests --> verify-tests
    verify-tests -- success --> complete
{% end %}

## Claude

### Agent setting

-   Use `CLAUDE.md` for essential context, e.g., configuring Claude to ask followup questions if a request is unclear.

### Chat

-   Use `@<FILE_NAME>` to include the content of a file in the context.
-   Use `/compact` to compress conversation history.
-   Use `/account` to view token quota.
-   Use `/model` to switch the backend LLM.
-   Use `/plugins` to find and install plugins.

### Skills

-   Use skills for context injection and let Claude decide to load or not.
-   Pick and use only well-tested skills from the public repository as many skills are ineffective and even malicious.
-   Use Anthropic skill-creator skill to build our own skills.

### Hooks

-   Use hooks for event-driven context injection.

### Subagent

-   Use `/agents` to create new agents.

### MCP

-   Use Model Context Protocol (MCP) to let Claude make API calls to web services.

## References
