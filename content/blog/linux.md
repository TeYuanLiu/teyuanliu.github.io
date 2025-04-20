+++
title = "Linux"
date = 2025-04-17
+++

Linux is a free open source operating system.

## Dual boot

Assume we have a computer already installed with Windows, then we can install Linux along side it. Here we select the Ubuntu distro and below are the steps of installation.

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
    1.  When booting the computer, if we enter the GRUB rescue terminal instead of the GRUB boot menu (which lets us select between Ubuntu and Windows), this means the Unified Extensible Firmware Interface (UEFI) firmware or BIOS cannot load the correct GRUB bootloader.
    1.  Let's quickly recap what happens when we boot the computer.
        1.  We press the power button.
        1.  The UEFI firmware or BIOS checks boot order and tries to load the first bootloader entry, which should be the correct GRUB bootloader.
        1.  The GRUB bootloader prompts the user with the GRUB menu containing the Ubuntu and Windows boot option.
        1.  The user selects a bootloader and it loads the OS kernel and starts system processes.
    1.  Now we can see that it is the first bootloader entry causing the problem.
    1.  A permanent fix is to reboot the computer, and go to the BIOS, and rearrange the bootloader order to prioritize the correct one located in the Ubuntu partition.
    1.  A temporary fix is to look for the Ubuntu partition in the rescue terminal and use it for booting.
        ```shell
        ls (hd0,gpt1)/boot/grub # Iterate over every (hdx,gpty) until we find an existing (hdx,gpty)/boot/grub directory. Let's say (hd1,gpt4)/boot/grub is our target directory.
        set root=(hd1,gpt4)
        set prefix=(hd1,gpt4)/boot/grub
        insmod normal # insmod = insert module
        normal
        ```
1.  Fix secondary display white screen issue.
    1.  After logging into the system, if we find the secondary display shows a white screen, it's probably because we lack the Nvidia driver. We can fix it by installing the driver.
        ```shell
        ubuntu-drivers devices # List recommended drivers.
        sudo apt install nvidia-driver-550
        sudo reboot # Reboot to apply the changes.
        ```

## Set up development environment

Here are the steps I take to set up my development environment.

1.  Install Google Chrome.
    `sudo apt install ./google-chrome-stable_current_amd64.deb`
1.  Install LibreOffice.
    `sudo apt install libreoffice`
1.  Install Visual Studio Code.
    `sudo apt install ./code_x.xx.x_amd64.deb`
1.  Install cURL.
    `sudo apt install curl`
1.  Install Rust.
    `curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`
1.  Install Git.
    ```shell
    sudo apt install git
    git config –global user.email <EMAIL>
    ssh-keygen -t ed25519 -C “<COMMENT>”
    eval “$(ssh-agent -s)”
    ssh-add ~/.ssh/id_ed25519
    ```
1.  Install Zola.
    -   Compile from source

        ```shell
        git clone git@github.com:getzola/zola.git
        cd zola
        cargo install –path . –locked
        ```
    -   Use snap package manager
        `snap install --edge zola`
1.  Install Docker.
    `sudo apt install docker.io`
1.  Install FFmpeg.
    `sudo apt install ffmpeg`
1.  Install MuseScore3.
    `sudo apt install musescore3`

---

1.  Install nvidia-container-toolkit.
    `sudo apt install nvidia-container-toolkit`
1.  Install python3.12-venv.
    `sudo apt install python3.12-venv`

## Bash shell

The Bash shell is a command-line interpreter and scripting language used in Linux.

### Frequently-used Bash commands

-   List contents in a directory.
    -   `ls`
-   Change directory.
    -   `cd`
    - Shortcut to home
        -   `cd ~`
-   List locations where Linux finds binaries.
    -   `echo $PATH`
-   List the location of a binary.
    -   `which`
-   Get the IDs of the processes that are listening or talking to a port.
    -   `sudo lsof -t -i:<PORT_NUMBER>`
-   Kill the processes that are listening or talking to a port.
    -   `sudo kill -9 $(sudo lsof -t -i:<PORT_NUMBER>)`
-   List package details from available repositories.
    -   apt show <package>
-   Check if a package is installed.
    -   dpkg -s <package>

## Linux file system

Linux file system follow the Filesystem Hierarchy Standard (FHS) 3 specification and has the following structure:

-   /: root
-   /bin: OS essential binaries like `ls`
-   /sbin: essential binaries for super user (root) like `mount`
-   /lib: shared code between binaries
-   /usr/bin: non-essential installed binaries
-   /user/local/bin: locally compiled binaries separated from binaries installed by system package manager
-   /etc: editable text configurations
-   /home/user: user data
-   /boot: files like the Linux kernel needed to boot the system
-   /dev: device files
-   /opt: optional binaries
-   /var: logs and cache files
-   /tmp: temporary files
-   /proc: file system created in memory to keep track of running processes

## See also

-   [How to dual boot Windows 10 and Ubuntu](https://www.freecodecamp.org/news/how-to-dual-boot-windows-10-and-ubuntu-linux-dual-booting-tutorial/)