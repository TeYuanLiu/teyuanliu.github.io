+++
title = "Linux"
date = 2025-04-17
+++

Linux is a free open source operating system.

## Bash shell

The Bash shell is a command-line interpreter and scripting language used in Linux.

### Frequently-used Bash commands

- List contents in a directory

  - `ls`

- Change directory

  - `cd`
  - Shortcut to home
    - `cd ~`

- List locations where Linux finds binaries

  - `echo $PATH`

- List the location of a binary

  - `which`

- Get the IDs of the processes that are listening or talking to a port.

  - `sudo lsof -t -i:<PORT_NUMBER>`

- Kill the processes that are listening or talking to a port.

  - `sudo kill -9 $(sudo lsof -t -i:<PORT_NUMBER>)`

## Linux file system

Linux file system follow the Filesystem Hierarchy Standard (FHS) 3 specification and has the following structure:

- /: root
- /bin: OS essential binaries like `ls`
- /sbin: essential binaries for super user (root) like `mount`
- /lib: shared code between binaries
- /usr/bin: non-essential installed binaries
- /user/local/bin: locally compiled binaries separated from binaries installed by system package manager
- /etc: editable text configurations
- /home/user: user data
- /boot: files like the Linux kernel needed to boot the system
- /dev: device files
- /opt: optional binaries
- /var: logs and cache files
- /tmp: temporary files
- /proc: file system created in memory to keep track of running processes

## See also
