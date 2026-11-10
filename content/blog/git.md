+++
title = "Git"
date = 2026-06-18
updated = 2026-11-09
+++

Git was created as a code version management tool.
<!-- more -->

## File change state

-   Untracked/Uncommitted
    -   Untracked files or tracked files that have uncommitted changes.
-   Staged
    -   Tracked files with uncommitted changes that are staged to be committed.
-   Committed
    -   Tracked files with all changes committed and saved in the repository database (.git).

## Repository database

-   .git
    -   objects
        -   a1
            -   b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
    -   index
    -   refs
        -   heads
            -   main
            -   feature
            -   hotfix
    -   HEAD
    -   config

### Object

-   Key
    -   Have 40 characters (160 bits with 0-9 and a-f) hashed with SHA-1.
    -   Keys are grouped into subdirectories based on the first two characters of the key to alleviate inode count burden of the objects directory. The last 38 characters are used to name the file that stores the value.
-   Value
    -   Commit
        -   Contain the following for each commit.
            -   Tree object key
            -   Parent commit object key (absent for initial commit)
            -   Author with datetime
            -   Committer with datetime
            -   Commit message
    -   Tree
        -   Contain a list of file entries.
        -   Each file entry contains the following.
            -   Blob object type
            -   Blob object key
            -   File path relative to repository root
    -   Blob
        -   File content compressed with Zlib

### Index

-   Contain the following for each file.
    -   File path
    -   Blob object key
    -   File size
    -   Created datetime
    -   Modified datetime

### Branch

-   Contain the following for each branch.
    -   Commit object key

### HEAD

-   Contain the current branch file path or commit object key in detached HEAD state.
    -   Any new commit made in detached HEAD state is not persistent and will be garbage-collected after a set interval so we need to create a branch that points to the new commit to preserve it.

## Merge

The 3-way merge looks at the branch1 commit, the branch2 commit, and their nearest common ancestor commit to perform the merge.

## Rebase

A rebase recreates the branch1 commits on branch2 by replaying the branch1 commits' changes. This makes the history linear.

## Common commands

-   Rewind to the last commit but keep the file changes in the staged area.
    ```bash
    git reset HEAD~1
    ```
-   Untrack a file from Git but keep it.
    ```bash
    git rm --cached <FILE>
    ```

## References
