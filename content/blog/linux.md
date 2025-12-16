+++
title = "Linux"
date = 2025-04-17
updated = 2025-04-27
+++

Linux is a free and open source Operating System (OS). It is the dominating OS on servers nowadays.
<!-- more -->

## Origin

In 1970s, the Bell labs developed an OS named Unix, and it led to a standardization called Portable Operating System Interface (POSIX) to ensure compatibility among different systems.

In 1987, an OS named Minix was developed based on Unix and gained popularity in the academic field. However, the redistribution of its code was restricted. This motivated a Finnish software developer, Linus Torvalds, to developed his own OS kernel, Linux, in 1991, using the C programming language.

Linux was advertised as a free and open source software under the GNU (GNU's Not Unix) General Public License (GPL) 2.0 license. It was free to distribute, modify, and make money from it.

## Distribution

A Linux distribution is a complete operating system built on the Linux kernel and each distribution has its own highly opinionated set of default software. Here are some famous distributions.
-   Slackware
    -   The original gangster from the 1990s.
-   Debian
    -   The most popular distribution overall.
    -   Emphasize openness and ease of use.
    -   Use apt as the package manger.
    -   Use Gnome as the desktop environment.
-   Red Hat
    -   Enterprise-maintained distribution that supports long-term maintenance.
    -   Use Dandified YUM (DNF) as the package manger.
-   Arch
    -   A lightweight distribution thrives on simplicity.
    -   Use pacman as the package manger.

## Bootup

The Linux kernel acts as a bridge between hardware and software. When we press the power button of a Linux machine:
-   The bootloader, usually GRand Unified Bootloader (GRUB), loads the kernel into the Random Access Memory (RAM).
-   The kernel detects hardware devices like CPU, RAM, disk, network, etc, and executes the `init` system, which is often `systemd`, to start many subsystems.
    -   Process management subsystem
        -   Signal handling
        -   Process/thread creation and termination
        -   Process scheduler (Linux kernel)
    -   Memory management subsystem
        -   Virtual memory
            -   The kernel utilizes virtual memory to allocate and de-allocate memory in RAM or disk for every process.
        -   Paging page replacement
        -   Page cache
    -   I/O subsystem
        -   Virtual filesystem
            -   The kernel utilizes virtual filesystem to interact with files on different systems.
            -   The kernel utilizes drivers to interact with different peripheral devices.
            -   Terminal
                -   Line discipline
                -   Character device drivers.
            -   Filesystems
                -   Generic block layer
                -   I/O scheduler (Linux kernel)
                -   Block device drivers
            -   Sockets
                -   Netfilter / Nftables
                -   Network protocols
                -   Packet scheduler (Linux kernel)
                -   Network device drivers
    -   IPOs dispatcher
-   Once initialized, the kernel starts applications in the user space and lets the user to log in.

## Namespace

A Linux namespace is a kernel-defined logical box that holds a specific software resource for a process or a group of processes within the namespace. A namespace creates a lightweight and isolated environment.

### Namespace types

-   Process ID (PID)
    -   Isolate process IDs.
    -   Each namespace has its own PID 1 process.
-   Control group (cgroup)
    -   Isolate resource limits.
    -   Each namespace has its own cgroup for resources like CPU, memory and I/O.
-   Mount
    -   Isolate the filesystem.
    -   Each namespace has its own root filesystem mount-point.
-   Network
    -   Isolate the IP address (65536 ports), network devices, routing table, iptables (firewall, Network Address Translation (NAT), mangle table).
-   Inter-Process Communication (IPC)
    -   Isolate the shared memory, message queues, and semaphores (resource counter to prevent race condition).
-   User ID (UID)
    -   Isolate user and group IDs.
    -   Each namespace has its own UID 0 user (root) and it is mapped to a different UID on the system.
-   Environment variable
    -   Isolate environment variables.
-   UTS
    -   Isolate the hostname and domain name.
    -   Each namespace has its own hostname.
-   Time
    -   Isolate system clocks.

## Process

A process is a running instance of a program that consists of an isolated memory address space and the execution of some code. When we execute a command like `ls` or `python script.py`, the Linux kernel creates a process to execute the code.

Each process is given the following resources.
-   A unique identifier called a Process ID (PID)
-   A process view. It by default inherits the parent process's process view. If the parent process is the shell, it can see all the processes on the system.
-   A cgroup for CPU, memory, I/O access and limit. It by default inherits the parent process's cgroup. If the parent process is the shell, it can use as much CPU and memory as the system has available. Tools like Systemd or Docker creates a new cgroup, defining the CPU/memory limits, and assigns a process to it.
-   A filesystem view. It by default inherits the parent process's filesystem. If the parent process is the shell, it can see all the files on the system. Docker uses containerd, which uses runc, to run `chroot` to change the root directory of each container process for an isolated filesystem view. 
-   A network namespace for an IP address (65536 ports), network devices (loopback, eth0, wlan0), routing table, and iptables like filter table (firewall), Network Address Translation (NAT) table, and mangle table (for packet modification). It by default inherits the parent process's network namespace. If the parent process is the shell, it can use the system network namespace. Docker creates a new network namespace for each new container and assigns the container process to it.

Processes have a parent-child hierarchy as a parent process can start a child process.

## Rings

Linux uses rings to administer operation privileges.
-   The kernel is in ring 0, which has the highest level of privilege.
-   The user operates in ring 3, which has the lowest level of privilege.
-   The system call interface let a user to move from ring 3 to ring 0 and make System Call (SYSCALL) to do things like writing a file in the filesystem.
-   The GNU Library for C (GLIBC) provides SYSCALL wrappers, called functions, to C application such that applications can make function calls and run SYSCALLs under the hood.

## GNU and shell

In 1983, Richard Stallman started the GNU project to provide binaries that make the kernel useful.
-   A terminal is a graphical user interface, which lets us interact with a shell.
-   A shell is a command interpreter and serves as a layer of protection between the kernel and user space. It takes in a command and call the corresponding binary in `/bin` to start a process executing that binary, which is doing the real work.
-   A user can directly type and execute commands on a terminal or write a shell script to group commands together and then execute the script.
-   Nowadays we have different shell options like SH (the original one), BASH, RBASH, DASH, and ZSH. They all use the same binaries in `/bin` but each option varies in terms of command and script syntax, execution speed performance, auto-completion, syntax-highlighting, and customization flexibility. 
-   We can run `cat /etc/shells` to see what shell options are available on our machine. Below is an example output.
    ```
    /bin/sh
    /usr/bin/sh
    /bin/bash
    /use/bin/bash
    /bin/rbash
    /use/bin/rbash
    /usr/bin/dash
    ```
    We can also run `echo $SHELL` to see our current shell or `echo $0` to see the active shell process.

### Frequently-used Bash commands

-   Print a string to the standard output.
    ```bash
    echo "<STRING>"
    ```
-   Create a new file.
    ```bash
    touch <FILE_NAME>
    ```
-   See a binary's manual.
    ```bash
    man <COMMAND>
    ```
-   Print the location of a binary.
    ```bash
    which <BINARY>
    ```
-   List files in the current directory.
    ```bash
    ls
    ```
-   Print a file's content.
    ```bash
    cat <FILE_NAME>
    ```
-   Print a file's metadata.
    ```bash
    stat <FILE_NAME>
    ```
-   Remove a file.
    ```bash
    rm <FILE_NAME>
    ```
-   Redirect the standard output to a file.
    ```bash
    echo "Hello, world!" > <FILE_NAME>
    ```
-   Redirect a file's content to the standard output.
    ```bash
    echo "$(< <FILE_NAME>)"
    ```
-   Pass the output of a command as the input of another command with pipe.
    ```bash
    cat error.log | sort | uniq # Sort and de-duplicate the lines in `error.log.
    ```
-   Print the current user's name.
    ```bash
    whoami
    ```
-   Print the current user's User ID (UID).
    ```bash
    id -u
    ```
-   Switch to the superuser.
    ```bash
    su
    ```
-   Execute a command as the superuser.
    ```bash
    sudo <COMMAND>
    ```
-   List the current user's privilege.
    ```bash
    sudo -l
    ```
-   Print the current user's Group ID (GID).
    ```bash
    id -g
    ```
-   Make a new directory.
    ```bash
    mkdir <DIRECTORY_NAME>
    ```
-   Change directory to a directory.
    ```bash
    cd <DIRECTORY_PATH>
    ```
-   Print the working directory's path.
    ```bash
    pwd
    ```
-   List binaries' storage locations.
    ```bash
    echo $PATH
    ```
-   Set an environment variable's value.
    ```bash
    export <ENVIRONMENT_VARIABLE>=<VALUE>
    ```
-   Customize the bashrc file.
    ```bash
    nano ~/.bashrc
    ```
-   Change a file's permissions.
    ```bash
    chmod [u/g/o/a][+/-/=][r/w/x] <FILE_NAME>`
    chmod a+r <FILE_NAME>` # Grant everyone the read access.
    ```
-   Change a file's owner.
    ```bash
    chown <USER_NAME> <FILE_NAME>
    ```
-   Change a file's group.
    ```bash
    chgrp <GROUP_NAME> <FILE_NAME>
    ```
-   List processes.
    ```bash
    ps # or htop
    ```
-   Run a script in the background.
    ```bash
    <SCRIPT_NAME> &
    ```
-   Schedule script execution.
    ```bash
    crontab
    ```
-   Kill a process gracefully by sending a `SIGTERM` signal.
    ```bash
    kill <PROCESS_ID>
    ```
-   Kill a process forcefully by sending a `SIGKILL` signal.
    ```bash
    kill -9 <PROCESS_ID>
    ```
-   Search text.
    ```bash
    grep
    ```
-   Modify text.
    ```bash
    sed
    ```
-   Archive a directory of files into one single file.
    ```bash
    tar -cvf archive.tar /path/to/files
    ```
-   Compress a file.
    ```bash
    gzip file
    ```
-   Archive a directory of files into one single file and then compress it.
    ```bash
    tar -czvf archive.tar.gz /path/to/files
    or
    zip archive.zip /path/to/files
    ```
-   Get the IDs of the processes that are listening or talking to a port.
    ```bash
    sudo lsof -t -i:<PORT_NUMBER>
    ```
-   Kill the processes that are listening or talking to a port.
    ```bash
    sudo kill -9 $(sudo lsof -t -i:<PORT_NUMBER>)
    ```
-   Print a package's details from available repositories.
    ```bash
    apt show <PACKAGE>
    ```
-   Check if a package is installed.
    ```bash
    dpkg -s <PACKAGE>
    ```
-   Search for a filename from installed packages.
    ```bash
    dpkg -S <FILE_PATH>
    ```
-   List files installed from `<PACKAGE>`.
    ```bash
    dpkg -L <PACKAGE>
    ```
-   List package locations relevant to `Python3`.
    ```bash
    python3 -m site
    ```
    -   Debian's package manager `apt` installs packages to `dist-packages` like `/usr/local/lib/python3.12/dist-packages/`.
    -   Any third party tool like pip installs packages to `site-packages`.
-   Add the current user to a group.
    ```bash
    sudo usermod -aG <GROUP> $USER
    ```
-   Clean boot entries.
    ```bash
    sudo efibootmgr # List boot entries.
    sudo efibootmgr -b <BOOTNUM> -B
    lsblk # Or use `sudo fdisk -l` to find the EFI partition.
    sudo mount /dev/sdXY /mnt
    ls /mnt/EFI/
    sudo rm -r /mnt/EFI/<DIRECTORY_TO_BE_DELETED>
    sudo umount /mnt
    ```

## Filesystem

Linux's ext4 filesystem follows the Filesystem Hierarchy Standard (FHS) 3 specification and has the following structure:
-   `/`: Root
-   `/bin`: Essential binaries like `ls`
-   `/sbin`: Superuser's essential binaries like `mount`
-   `/lib`: Shared code between binaries
-   `/usr/bin`: Non-essential installed binaries
-   `/usr/local/bin`: Locally compiled binaries separated from binaries installed by a system package manager
-   `/etc`: Editable text configurations
-   `/home/user`: User workspace
-   `/boot`: Files needed to boot the system like the Linux kernel
-   `/dev`: External devices like disks
-   `/opt`: Optional binaries
-   `/var`: Logs and cache files
-   `/tmp`: Temporary files
-   `/proc`: A filesystem created in memory to keep track of running processes

### Storage devices in filesystem

-   A storage devices is displayed with a name like “sda” in Linux filesystem.
-   The “sd” stands for Small Computer System Interface (SCSI) Disk, which is a data transfer protocol succeeded by other protocols like Serial Advanced Technology Attachment (SATA) and Non-Volatile Memory express (NVMe). Therefore, a disk with name prefixed with "sd" may be either a SATA or a NVMe drive.
-   The next letter indicates the device order, so “sda” means the first detected disk and “sdb” means the second one.
-   Each partition on the disk is given a number, so “sda1” is the first partition on the first disk.

### File permissions

-   We can list the permission setting of a file by running `ls -l <FILE_NAME>`, and see the symbolic permission string like `-rw-r--r--`.
    -   The first character indicates whether the file is a file `-` or a directory `d`.
    -   The second to fourth characters form the first triplet and it represents the owner's permissions.
        -   The owner is the user who created the file.
        -   The first character in the triplet means the read permission, which shows whether the owner can read the file's content.
        -   The second character in the triplet is the write permission, which shows whether the owner can edit the file's content.
        -   The last character in the triplet is the execute permission, which shows whether the owner can execute the file as a binary.
        -   If the "r", "w", and "x" letters are shown, it means those privileges are granted, but if there is a dash it means the permission is not granted.
    -   The fifth to seventh characters make up the second triplet and represents the group's permission.
        -   The group is a group of users sharing the same set of permissions on this file.
        -   The three characters, just like those in the owner's setting, represent the read, write and execute permission.
    -   The eighth to tenth characters shape the and last triplet and indicate the permissions of others.
        -   This includes every user that is neither the owner nor a user in the group.
        -   The three characters, just like those in the owner's setting, represent the read, write and execute permission.
-   Permissions can be presented in other formats.
    -   Symbolic permissions `rwx` can be seen as `111` in binary because all the bits are set, and we can convert binary `111` to number  `7`. Therefore, a symbolic permission string `-rwxr-xr-x` can be converted to the number `755`.
-   Setuid, Setgid, and sticky bit provide additional control over a file or directory.
    -   Setuid
        -   Set the Setuid bit on an executable file allows the file to be run with the permission of the file owner instead of the user actually running it. A symbolic permission string example is `-rwsr-xr-x`.
        -   One example is the `/usr/bin/passwd` file, which has `-rwsr-xr-x` permissions to let users edit sensitive system files to set their passwords.
    -   Setgid
        -   The Setgid bit works in the way similar to Setuid and allows the file to be run with the group’s permission rather than the user actually running it. A symbolic permissions string example is `drwxrwsr-x`.
        -   One example is setting the Setgid on a directory to ensure the files created within the directory have the same permission setting as the directory, allowing team members to work together on a project.
    -   Sticky bit
        -   The Sticky bit is set on a directory when we want to make sure only the directory owner and the root user can delete the directory. A symbolic permissions string example is `drwxrwxrwt`.

## Networking

### Routing table

A routing table stores a list of route entries. Each route entry has the following information.
-   Destination Internet Protocol (IP) Classless Inter-Domain Routing (CIDR)
-   Next hop IP address
-   Network device

### Network device

A network device (network interface) is an abstract interface for data transmission. Its driver registers itself with the kernel and the kernel adds it to the network namespace. It acts as a bridge between the kernel and the physical hardware like an Ethernet port or Wi-Fi card, and provides a standardized way for the kernel to send and receive data. A network device is not a file, unlike many other Linux objects such as disks (/dev/sda) or serial ports (/dev/ttys0).

#### Network device type

-   Physical device (hardware + software)
    -   Each Ethernet device on a systemd machine has the name based on its physical location like `enp3s0f1` (Ethernet PCI bus 3 slot 0 function 1). Legacy naming looks like `eth0`.
    -   Each wireless device on a systemd machine has the name based on its physical location like `wlp2s0` (wireless Lan PCI bus 2 slot 0). Legacy naming looks like `wlan0`.
-   Virtual device (software-only)
    -   Loopback, `lo`, is the virtual device that allows the computer to connect to itself at `127.0.0.1` or `localhost`.
    -   Bridge, `br0`, acts like a virtual network switch that connects multiple network devices together.
    -   Tunnel, `tun0`, is used by VPNs to pass traffic from the kernel to a user-space application.
    -   Virtual ethernet, `veth`, is used by the Container Runtime Interface (CRI) to link a container to the host.

### Socket

A socket is a file in Linux that serves as a software endpoint for sending and receiving data. Its external address is defined by a combination of an IP address, a port number, and a protocol. 

### Traffic flow

When our application on Linux wants to send a request to a remote server.
1.  Application layer
    -   Our application sends the request to the kernel.
1.  Transport layer
    -   The kernel encapsulates the request into a segment by adding TCP headers to the request.
1.  Network layer
    -   The kernel builds a packet from the segment by wrapping it with IP headers. It then forwards the packet to the specific network device like `eth0`.
1.  Data link layer
    -   The network device driver packages the packet into a frame.
1.  Physical layer
    -   The network device driver converts the frame into electronic signals and hands over the signals to a physical Network Interface Card (NIC) for transmission and the NIC sends it out.

## Ubuntu

### Dual boot

Assume we have a computer already installed with Windows, then we can install Ubuntu alongside it. Below are the steps of installation.

1.  Make a bootable USB drive.
    1.  Download the latest LTS Ubuntu Desktop ISO image from the [official website](https://ubuntu.com/download/desktop).
    1.  Use a software like [Rufus](https://rufus.ie/downloads/) to write the ISO image to an USB drive.
1.  Create a disk partition.
    1.  Use the Windows built-in disk management software to create an unallocated partition.
1.  Reboot from the USB drive and install Ubuntu.
    1.  Restart the computer and select the USB drive for booting. Follow the prompted instructions to install the system.
    1.  After the installation, reboot the computer.
    1.  During the installation process, I connected it to the Internet and updated the installer when asked. I did not install any other third party software.
1.  Reconfigure boot order.
    1.  When booting up the computer, if we enter the GRUB rescue terminal instead of the GRUB boot menu (which lets us select between Ubuntu and Windows), this means the Unified Extensible Firmware Interface (UEFI)/BIOS has found a GRUB bootloader, but:
        -   either the bootloader's partition is not the Ubuntu partition we have installed,
        -   Or the `grub.cfg` file, which is typically at `/boot/grub/grub.cfg`, is missing due to various reasons like mount failure or incomplete installation.
    1.  Let's quickly recap what happens when we boot up the computer.
        1.  We press the power button.
        1.  The UEFI/BIOS initializes the hardware.
        1.  The UEFI/BIOS loads **the first bootloader** in the boot order (typically the GRUB bootloader at `/boot/efi/EFI/ubuntu/grubx64.efi` in the Ubuntu partition).
        1.  The GRUB bootloader prompts the user with the GRUB menu containing the Ubuntu and Windows boot option.
        1.  The user selects a boot option and it loads the OS kernel and starts system processes.
    1.  Now we can see that most likely **the first bootloader** is probably not the one we want.
    1.  A temporary fix we can do in the rescue terminal right away is to look for the Ubuntu partition and use it for current booting.
        ```bash
        ls (hd0,gpt1)/boot/grub # Iterate over every (hdx,gpty) until we find an existing (hdx,gpty)/boot/grub directory. Let's say (hd1,gpt4)/boot/grub is our target directory.
        set root=(hd1,gpt4)
        set prefix=(hd1,gpt4)/boot/grub
        insmod normal # insmod = insert module
        normal
        ```
    1.  A permanent fix is to reboot the computer, pressing the UEFI/BIOS key (F2 in Acer and Dell, F10 in HP) and rearrange the bootloader order to prioritize the one located in the Ubuntu partition.

1.  Fix secondary display issue.
    1.  After logging into the system, if we find the secondary display has problems like no signal or white screen, it's probably because the Nvidia driver is not installed. We can fix it by installing the driver.
        ```bash
        ubuntu-drivers devices # List recommended drivers.
        sudo apt install nvidia-driver-<DRIVER_VERSION> # Or use "sudo ubuntu-drivers autoinstall" to install recommended drivers. 
        reboot # Reboot to apply the changes.
        ```

1.  Fix root fs mount failure.
    1.  When we boot up the computer, if we see error message like "kernel panic - unable to mount root fs on unknown-block(0,0)", this means the current kernel's initramfs is broken. We can fix it by updating the initramfs.
        ```bash
         # Reboot. Choose "Advanced options for Ubuntu". Log into the system with another kernel.
        sudo update-initramfs -u -k <BROKEN_INITRAMFS_KERNEL_VERSION>
        sudo update-grub
        reboot
        ```

### Package manager

Ubuntu's maintainer, Canonical, has created its own package manager called `Snap` to live besides the Debian's `APT`. Below is a comparison.

Feature | APT | Snap
------- | --- | ----
Source | Debian repos | Snapcraft store
Format  | `.deb` | `.snap`
Size | Small | Large
Install method | `apt install` | `snap install`
Install location | `/usr` | `/snap` (mounted via loop devices)
Isolation | No (shared system libs) | Yes (sandboxed with own libs)
Dependency conflict | Probable | No
Security | Community  | Canonical
Speed | Fast install & launch | Slower install & launch (due to sandboxing)
Debug | Easy | Hard
Customize | Easy | Hard
Latest version | No | Yes
Auto updates | No | Yes (in background)

To sum up, use APT unless we need sandboxing, auto-updates, or the latest version of a software.

### Set up development environment

Here are the steps I take to set up my development environment.

1.  Install Google Chrome.
    ```bash
    sudo apt install ./google-chrome-stable_current_amd64.deb
    ```
1.  Install LibreOffice.
    ```bash
    sudo apt install libreoffice
    ```
1.  Install Visual Studio Code.
    ```bash
    sudo apt install ./code_x.x.x_amd64.deb
    ```
1.  Install cURL.
    ```bash
    sudo apt install curl
    ```
1.  Install Rust.
    ```bash
    curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
    ```
1.  Install Git and configure identity and SSH keys.
    ```bash
    sudo apt install git
    git config –global user.email <EMAIL>
    ssh-keygen -t ed25519 -C “<COMMENT>”
    eval “$(ssh-agent -s)”
    ssh-add ~/.ssh/id_ed25519
    ```
1.  Install Zola.
    -   Compile from source
        ```bash
        git clone git@github.com:getzola/zola.git
        cd zola
        cargo install –path . –locked
        ```
    -   Or use snap package manager
        ```bash
        snap install --edge zola
        ```
1.  Install Docker.
    ```bash
    sudo apt install docker.io
    ```
1.  Install FFmpeg.
    ```bash
    sudo apt install ffmpeg
    ```
1.  Install MuseScore3.
    ```bash
    sudo apt install musescore3
    ```
1.  Install nvidia-container-toolkit.
    ```bash
    curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
    && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
        sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
        sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

    sudo apt update
    sudo apt install -y nvidia-container-toolkit
    sudo systemctl restart docker
    sudo docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu22.04 nvidia-smi # Verify nvidia-container-toolkit installation.
    ```
1.  Install python3.12-venv.
    ```bash
    sudo apt install python3.12-venv`
    ```
1.  Install Go
    1.  Download the latest archive from the [Go official website](https://go.dev/doc/install).
    1.  Extract the files at `/user/local`.
        ```bash
        sudo tar -C /usr/local -xzf go<MAJOR>.<MINOR>.<PATCH>.linux-amd64.tar.gz
        ```
    1.  Add this to the `.bashrc` file.
        ```bash
        PATH="$PATH:/usr/local/go/bin"
        ```
    1.  Open a new terminal and verify the installation.
        ```bash
        go version
        ```
1.  Install pre-commit
    ```bash
    sudo apt install pre-commit`
    ``` 

## See also

-   [How to dual boot Windows 10 and Ubuntu](https://www.freecodecamp.org/news/how-to-dual-boot-windows-10-and-ubuntu-linux-dual-booting-tutorial/)
