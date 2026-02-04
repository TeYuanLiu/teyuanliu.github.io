+++
title = "Development Cycle"
date = 2025-04-30
updated = 2026-02-03
+++

Let's talk about software development prioritization as well as the development cycle.
<!-- more -->

## Development flow

When developing a software system, should we choose to build it in a bottom-up fashion, starting from low-level components, or should we follow a top-down style, starting from high-level features? Here is the comparison.

### Comparison

-   Bottom-up
    -   Focus on low-level components.
    -   Steps
        1.  Implement low-level components.
        1.  Assemble low-level components to build high-level features and then the entire system.
    -   Pros
        -   Higher modularity encourages code reuse.
        -   Testing and debugging are easier.
    -   Cons
        -   Spending time building components that turn out to be unnecessary or misaligned with the system goal.
        -   Integration complexity might arise if components have mismatched interfaces or assumptions.
    -   Use cases
        -   Reusable libraries or tools that will be integrated into multiple projects.
        -   Research-heavy projects where the feasibility of fundamental algorithms must be tested early.
        -   The system requires robust, well-tested components that will serve as the backbone of the system.
-   Top-down
    -   Focus on high-level features.
    -   Steps
        1.  Define system goal, user experience, high-level features, and system architecture.
        1.  Implement high-level features with fake low-level components.
        1.  Implement low-level components.
    -   Pros
        -   Focus on the big picture, ensuring all components align with the system goal.
        -   Faster prototyping.
    -   Cons
        -   Risk of over-engineering.
        -   Testing of high-level features relies on the assumption rather than the actual behavior of low-level components.
        -   Debugging of high-level feature is hard because the system is more complex.
        -   Issues of low-level component surface at the end of development. If a low-level component fails to satisfy the predefined requirements, it is cumbersome to modify the high-level design.
    -   Use cases
        -   The system has a well-defined set of requirements and a clear vision.
        -   Projects that need rapid prototypes to validate ideas or get early user feedback.
        -   System development involves multiple people and high-level design can guide the distribution of tasks.
-   Hybrid
    -   Focus on balancing between high-level features and low-level components.
    -   Steps
        1.  Define system goal, user experience, high-level features, and system architecture.
        1.  Implement low-level components.
        1.  Assemble low-level components to build high-level features and then the entire system.
    -   Pros
        -   Higher modularity encourages code reuse.
        -   Testing and debugging are easier.
        -   Focus on the big picture, ensuring all components align with the system goal.
    -   Cons
        -   Integration complexity might arise if components have mismatched interfaces or assumptions.
        -   Risk of over-engineering.
-   Use cases
    -   Complex systems requiring quick feedback.

No matter which way of prioritization we choose, here are some tips:
-   Implement things when we actually need them, never when we just foresee that we will need them. It is hard for less experienced developers to appreciate how rarely development for future requirements turns out net-positive.

Now we have figured out our priorities, and we are ready to talk about the development cycle.

## Development cycle

1.  Create development tasks based on requirements (plan).
1.  Prioritize development tasks based on impact to engineer hour cost ratio, achieving high Return-On-investment (ROI).
1.  Synchronize with customers on the tradeoff between time and feature quality/quantity, and delivery deadlines. Emphasize safety over delivery speed.
1.  Pick up development tasks from the backlog and put them into a two-week sprint.
1.  Develop and commit the source code into the code repository (code).
    -   Prefer many small Pull Requests (PR) over one large PR.
        -   Choose among feature addition, bug fix, and refactoring but not two or more.
        -   Colleagues are more willing to review many small PRs rather than one giant PR.
        -   Get feedback early to revise architecture design before spending too much time and energy on less impactful things.
        -   Smaller PR works well with Continuous Integration / Continuous Delivery (CI/CD) and testing.
1.  Build the binary (build).
1.  Conduct the unit test (test).
1.  If the build passes the unit test, store it into the artifactory and deploy it into the development environment, otherwise, go back to step 3.
1.  Conduct the integration test.
1.  If the build passes the integration test, deploy it into the Quality Assurance (QA) environment, otherwise, go back to step 3.
1.  Conduct the QA test which includes version-specific test, regression test, cross-version test and performance test.
1.  If the build passes the QA test, deploy it into the UAT environment, otherwise, go back to step 3.
1.  Conduct the User Acceptance Testing (UAT).
1.  If the build passes the UAT verification, promote it to a release candidate.
1.  Make the release and deploy the build into the production environment (deploy).
    -   Git branch management
    -   Semantic versioning
    -   Release schedule
    -   End-of-life schedule
1.  Monitor the production environment and watch for alerts. Escalate issues if needed (monitor).
    -   Error logging
    -   Performance metric monitoring
    -   Failure alerting
    -   User feedback collection
1.  Write documentation (document).
    -   Versioned documentation
    -   Migration guide

## References
