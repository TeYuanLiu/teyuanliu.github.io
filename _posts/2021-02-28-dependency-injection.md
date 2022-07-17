---
title: "Dependency injection"
excerpt: "What does it mean?"
categories:
tags: System-design
---

Dependency injection generally means passing a dependent object as a parameter to a class method, rather than having the class method create the dependent object.

This dependent object can often times be an abstract object so we can pass in a mock instance for unit test, for example, a database object.
