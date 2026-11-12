+++
title = "Git"
date = 2026-06-18
updated = 2026-11-12
+++

Git was created as a code version management tool.
<!-- more -->

## File state

-   Working directory
    -   Untracked files or tracked files that have uncommitted changes
-   Staging area
    -   Tracked files with uncommitted changes that are staged to be committed
-   Repository
    -   Tracked files with all changes committed and saved in the repository database (.git)

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

Git saves object in its object store. There are 3 types of object: blob, tree, and commit.

-   Key
    -   Generated from the value content with SHA-1 so it has 40 characters (160 bits with 0-9 and a-f).
    -   Keys are grouped into subdirectories based on the first two characters of the key to alleviate inode count burden of the objects directory (filesystem like FAT32 allows only 65536 files per directory). The last 38 characters are used to name the file that stores the value.
-   Value
    -   Blob
        -   File content compressed with Zlib
    -   Tree
        -   Represent a directory and contain a list of file entries. Each file entry can be an actual file or a directory (another tree).
        -   Each file entry contains the following.
            -   Blob object type
            -   Blob object key
            -   File name
    -   Commit
        -   Indicate a snapshot of the project.
        -   Contain the following.
            -   Tree object key
            -   Author with datetime
            -   Commit message
            -   Parent commit object key (absent for initial commit)

### Index

-   Contain a list of file entries.
-   Each file entry contains the following.
    -   File path
    -   Blob object key
    -   File size
    -   Created datetime
    -   Modified datetime

### Branch

-   Contain the following.
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

-   https://www.youtube.com/watch?v=cLBvn81naWY
-   https://www.youtube.com/watch?v=RxHJdapz2p0
