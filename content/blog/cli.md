+++
title = "Command Line Interface (CLI)"
date = 2025-04-13
+++

Bash commands
- Get the IDs of the processes that are listening or talking to a port.
  - `sudo lsof -t -i:<PORT_NUMBER>`

- Kill the processes that are listening or talking to a port.
  - `sudo kill -9 $(sudo lsof -t -i:<PORT_NUMBER>)`
