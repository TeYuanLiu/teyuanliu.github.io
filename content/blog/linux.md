+++
title = "Linux"
date = 2025-04-17
updated = 2025-04-27
+++

Linux is a free and open source Operating System (OS). It is the dominating OS on servers nowadays.
<!-- more -->

## Origin

In 1970s, the Bell labs developed an OS named Unix, and it led to a standardization called Portable Operating System Interface (POSIX) to ensure compatibility among different systems.

In 1987, an OS named Minix was developed based on Unix and gained popularity in the academic field. However, the redistribution of its code was restricted. This motivated a Finnish software developer, Linus Torvalds, to developed his own OS kernel in C, Linux, in 1991.

Linux was advertised as a free and open source software under the GNU General Public License (GPL) 2.0 license. It was free to distribute, modify, and make money out of it.

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
    -   Use apt as the package manger.
-   Arch
    -   A lightweight distribution thrives on simplicity.
    -   Use pacman as the package manger.

## Bootup

The Linux kernel acts as a bridge between hardware and software. When we press the power button of a Linux machine:
-   The bootloader, usually GRUB, loads the kernel into Random Access Memory (RAM).
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
        -   Virtual file system
            -   The kernel utilizes virtual file system to interact with files on different systems.
            -   The kernel utilizes drivers to interact with different peripheral devices.
            -   Terminal
                -   Line discipline
                -   Character device drivers.
            -   File systems
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

## File system

Linux's ext4 file system follows the Filesystem Hierarchy Standard (FHS) 3 specification and has the following structure:
-   /: root
-   /bin: essential binaries like `ls`
-   /sbin: superuser's essential binaries like `mount`
-   /lib: shared code between binaries
-   /usr/bin: non-essential installed binaries
-   /usr/local/bin: locally compiled binaries separated from binaries installed by system package manager
-   /etc: editable text configurations
-   /home/user: user workspace
-   /boot: files needed to boot the system like the Linux kernel
-   /dev: external device like disks
-   /opt: optional binaries
-   /var: logs and cache files
-   /tmp: temporary files
-   /proc: file system created in memory to keep track of running processes

### Storage devices in file system

-   Storage devices are displayed with names like “sda”, “sdb” in Linux file system.
-   The “sd” stands for Small Computer System Interface (SCSI) Disk, which is a data transfer protocol succeeded by other protocols like Serial Advanced Technology Attachment (SATA) and Non-Volatile Memory Express (NVMe). Therefore, the "sd" includes SATA and NVMe disks as well nowadays.
-   The next letter indicates the device order, so “sda” means the first detected disk and “sdb” means the second one.
-   Each partition on the disk is given a number, so “sda1” is the first partition on the first disk.

### File permissions

-   We can list the permission setting of a file by running `ls -l <FILE_NAME>`, and see the symbolic permissions string which is similar to `-rw-r--r--`.
    -   The first character indicates whether the file is a file ("-") or a directory ("d").
    -   The second to fourth characters form the first triplet and it represents the owner.
        -   The owner is the user who created the file.
        -   The first character in the triplet means the read permission, which shows whether the owner can read the file's content.
        -   The second character in the triplet is the write permission, which shows whether the owner can edit the file's content.
        -   The third and last character in the triplet is the execute permission, which shows whether the owner can execute the file as a binary.
        -   If the "r", "w", and "x" letters are shown, it means those privileges are granted, but if there is a dash it means permission denied.
    -   The fifth to seventh characters make the second triplet and means the group.
        -   The group is a group of users sharing the same set of permissions on this file.
        -   The three characters, just like those in the owner's setting, represents read, write and execute permissions.
    -   The eighth to tenth characters shape the third and last triplet and indicates the others.
        -   The others means every user that is neither the owner nor a user in the group.
        -   The three characters, just like those in the owner's setting, represents read, write and execute permissions.
-   Permissions can be presented in other formats.
    -   Symbolic permissions `rwx` can be seen as `111` in binary because all the bits are set, and we can convert binary `111` to number  `7`. Therefore, a symbolic permissions string `-rwxr-xr-x` is `755`.
-   Setuid, Setgid, and sticky bit provide additional control over file and directory.
    -   Setuid
        -   Set the Setuid bit on an executable file allows the file to be run with the permission of the file owner instead of the user actually running it. A symbolic permissions string example is `-rwsr-xr-x`.
        -   One example is the `/usr/bin/passwd` file, which has `-rwsr-xr-x` permissions to let users edit sensitive system files to set their passwords.
    -   Setgid
        -   The Setgid bit works in the way similar to Setuid and allows the file to be run with the group’s permission rather than the user actually running it. A symbolic permissions string example is `drwxrwsr-x`.
        -   One example is setting the Setgid on a directory to ensure the files created within the directory have the same permission setting as the directory, allowing team members to work together on a project.
    -   Sticky bit
        -   The Sticky bit is set on a directory when we want to make sure only the directory owner and the root user can delete the directory. A symbolic permissions string example is `drwxrwxrwt`.

## Rings

Linux uses rings to administrate operation privileges.
-   The kernel is in ring 0, which has the highest level of privilege.
-   The user operates in ring 3, which has the lowest level of privilege.
-   The system call interface let a user to move from ring 3 to ring 0 and make System Call (SYSCALL) to do things like writing a file in the file system.
-   The GNU Library for C (GLIBC) provides SYSCALL wrappers called functions to C application such that applications can make function calls and run SYSCALLs under the hood.

## GNU and shell

In 1983, Richard Stallman started the GNU project to provide binaries that make the kernel useful.
-   A terminal is a graphical user interface, which lets us interact with a shell.
-   A shell is a command interpreter and serves as a layer of protection between the kernel and user space. It takes in commands but the real work is done by binaries in `/bin`.
-   A user can directly type and execute commands on a terminal or write a shell script to group commands together and then execute the script.
-   Nowadays we have different shell options like SH (the original one), BASH, RBASH, DASH, and ZSH. They all use the same binaries in `/bin` but each option varies in terms of command and script syntax, execution speed performance, auto-completion, syntax-highlighting, and customization flexibility. 
-   We can run `cat /etc/shells` to see what shell options are available on our machine. Below is an example output.
    ```
    /bin/sh
    /usr/bin/sh
    /bin/bash
    /user/bin/bash
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
    cat error.log | sort | uniq # sort and de-duplicate the lines in `error.log
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
-   Print the current working directory's path.
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
    chmod a+r <FILE_NAME>` # to grant everyone the read access
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
-   Compress a file.
    ```bash
    gzip
    ```
-   Archive a directory.
    ```bash
    tar
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
    -   Debian's package manager `apt` installs packages to `dist-packages` like `/usr/lib/python3.12/dist-packages/`.
    -   Third party tools like pip installs packages to `site-packages`.
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

## Ubuntu

### Dual boot

Assume we have a computer already installed with Windows, then we can install Ubuntu along side it. Below are the steps of installation.

1.  Make a bootable USB drive.
    1.  Download the latest LTS Ubuntu Desktop ISO image from the [official website](https://ubuntu.com/download/desktop).
    1.  Use software like [Rufus](https://rufus.ie/downloads/) to write the ISO image to an USB drive.
1.  Create a disk partition.
    1.  Use Windows built-in software disk management to create an unallocated partition.
1.  Reboot from the USB drive and install Ubuntu.
    1.  Restart the computer and select the USB drive for booting. Follow the prompted instructions to install the system.
    1.  After the installation, reboot the computer.
    1.  During the installation process, I connected it to the Internet and updated the installer when asked. I did not install any other third party software.
1.  Reconfigure boot order.
    1.  When booting up the computer, if we enter the GRUB rescue terminal instead of the GRUB boot menu (which lets us select between Ubuntu and Windows), this means the Unified Extensible Firmware Interface (UEFI)/BIOS has found the GRUB bootloader, but:
        -   The `grub.cfg` (typically `/boot/grub/grub.cfg` in the Ubuntu partition) was not found.
        -   The Ubuntu partition was not found probably because it was moved, or not mounted properly, or not installed completely.
    1.  Let's quickly recap what happens when we boot up the computer.
        1.  We press the power button.
        1.  The UEFI/BIOS initializes the hardware.
        1.  The UEFI/BIOS loads **the first bootloader** in the boot order (typically the GRUB bootloader at `/boot/efi/EFI/ubuntu/grubx64.efi` in the Ubuntu partition).
        1.  The GRUB bootloader prompts the user with the GRUB menu containing the Ubuntu and Windows boot option.
        1.  The user selects a boot option and it loads the OS kernel and starts system processes.
    1.  Now we can see that **the first bootloader** loaded is probably not the one we want.
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
    1.  After logging into the system, if we find the secondary display has issue like no signal or white screen, it's probably because we lack the Nvidia driver. We can fix it by installing the driver.
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

## See also

-   [How to dual boot Windows 10 and Ubuntu](https://www.freecodecamp.org/news/how-to-dual-boot-windows-10-and-ubuntu-linux-dual-booting-tutorial/)
