+++
title = "Ubuntu"
date = 2025-04-17
+++

Ubuntu is a Linux distribution that is free and open source.

## Dual boot

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
    1.  When booting the computer, if we enter the GRUB rescue terminal instead of the GRUB boot menu (which lets us select between Ubuntu and Windows), this means the Unified Extensible Firmware Interface (UEFI)/BIOS has found the GRUB bootloader, but:
        -   The `grub.cfg` (typically `/boot/grub/grub.cfg` in the Ubuntu partition) was not found.
        -   The Ubuntu partition was not found probably because it was moved, or not mounted properly, or not installed completely.
    1.  Let's quickly recap what happens when we boot the computer.
        1.  We press the power button.
        1.  The UEFI/BIOS initializes the hardware.
        1.  The UEFI/BIOS loads the first bootloader in the boot order (typically the GRUB bootloader at `/boot/efi/EFI/ubuntu/grubx64.efi` in the Ubuntu partition).
        1.  The GRUB bootloader prompts the user with the GRUB menu containing the Ubuntu and Windows boot option.
        1.  The user selects a boot option and it loads the OS kernel and starts system processes.
    1.  Now we can see that the first bootloader loaded is probably not the one we want.
    1.  A temporary fix we can do in the rescue terminal right away is to look for the Ubuntu partition and use it for current booting.
        ```bash
        ls (hd0,gpt1)/boot/grub # Iterate over every (hdx,gpty) until we find an existing (hdx,gpty)/boot/grub directory. Let's say (hd1,gpt4)/boot/grub is our target directory.
        set root=(hd1,gpt4)
        set prefix=(hd1,gpt4)/boot/grub
        insmod normal # insmod = insert module
        normal
        ```
    1.  A permanent fix is to reboot the computer, pressing the UEFI/BIOS key (F2 in Acer and Dell, F10 in HP) and rearrange the bootloader order to prioritize the one located in the Ubuntu partition.

1.  Fix secondary display white screen issue.
    1.  After logging into the system, if we find the secondary display shows a white screen, it's probably because we lack the Nvidia driver. We can fix it by installing the driver.
        ```bash
        ubuntu-drivers devices # List recommended drivers.
        sudo apt install nvidia-driver-550
        sudo reboot # Reboot to apply the changes.
        ```

## File system

Ubuntu's file system follow the Filesystem Hierarchy Standard (FHS) 3 specification and has the following structure:

-   /: root
-   /bin: essential binaries like `ls`
-   /sbin: essential binaries for super user (root) like `mount`
-   /lib: shared code between binaries
-   /usr/bin: non-essential installed binaries
-   /usr/local/bin: locally compiled binaries separated from binaries installed by system package manager
-   /etc: editable text configurations
-   /home/user: user data
-   /boot: files like the OS kernel needed to boot the system
-   /dev: device files
-   /opt: optional binaries
-   /var: logs and cache files
-   /tmp: temporary files
-   /proc: file system created in memory to keep track of running processes

## Package manager

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

### TLDR

Use APT unless you need sandboxing, auto-updates, or the latest software version.

## Set up development environment

Here are the steps I take to set up my development environment.

1.  Install Google Chrome.
    `sudo apt install ./google-chrome-stable_current_amd64.deb`
1.  Install LibreOffice.
    `sudo apt install libreoffice`
1.  Install Visual Studio Code.
    `sudo apt install ./code_x.x.x_amd64.deb`
1.  Install cURL.
    `sudo apt install curl`
1.  Install Rust.
    `curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`
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
    -   Use snap package manager
        `snap install --edge zola`
1.  Install Docker.
    `sudo apt install docker.io`
1.  Install FFmpeg.
    `sudo apt install ffmpeg`
1.  Install MuseScore3.
    `sudo apt install musescore3`
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
    `sudo apt install python3.12-venv`

## Bash shell

The Bash shell is a command-line interpreter and scripting language used in Ubuntu.

### Frequently-used Bash commands

-   List contents in a directory.
    -   `ls`
-   Change directory.
    -   `cd`
    - Shortcut to home
        -   `cd ~`
-   List locations recorded to search for binaries.
    -   `echo $PATH`
-   List the location of a binary.
    -   `which`
-   Get the IDs of the processes that are listening or talking to a port.
    -   `sudo lsof -t -i:<PORT_NUMBER>`
-   Kill the processes that are listening or talking to a port.
    -   `sudo kill -9 $(sudo lsof -t -i:<PORT_NUMBER>)`
-   List package details from available repositories.
    -   `apt show <PACKAGE>`
-   Check if a package is installed.
    -   `dpkg -s <PACKAGE>`
-   Search for a filename from installed packages.
    -   `dpkg -S <FILEPATH>`
-   List files installed from `<PACKAGE>`.
    -   `dpkg -L <PACKAGE>`
-   List package locations relevant to `Python3`.
    -   `python3 -m site`
    -   Debian's package manager `apt` installs packages to `dist-packages` like `/usr/lib/python3.12/dist-packages/`.
    -   Third party tools like pip installs packages to `site-packages`.
-   Add the current user to a group.
    -   `sudo usermod -aG <GROUP> $USER`
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

## See also

-   [How to dual boot Windows 10 and Ubuntu](https://www.freecodecamp.org/news/how-to-dual-boot-windows-10-and-ubuntu-linux-dual-booting-tutorial/)