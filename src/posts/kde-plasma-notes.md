---
title: KDE Plasma Notes
excerpt: Ongoing list of tips and fixes with KDE Plasma on Manjaro
status: published
tags:
  - Tech
  - Linux
author: patrick-chong
date: 2021-09-04T12:03:14.260Z
updatedAt: 2021-10-01T13:21:52.041Z
image: /assets/images/uploads/kde-background.png
imageHero: true
---

Ongoing list of tips and fixes with KDE Plasma on Manjaro

[[toc]]

## Unzip/Unarchive files

Instead of the usual `unzip`/`tar` commands, KDE has the `ark` tool installed to manage archives. `ark` is usually accessed via the GUI but can be run in the command line as well. `ark` works on various formats such as tar, gzip, bzip2, zip, rar when the appropriate libraries are installed.

```shell
ark -b -a [archive(s)]
```

References:

1. https://metelliuscode.wordpress.com/2009/08/28/tip-of-the-day-quickly-extract-archive-from-command-line-using-ark/
2. https://www.systutorials.com/docs/linux/man/1-ark/

## Tiling window manager like experience (like i3)

1. Install [Kröhnkite](https://github.com/esjeon/krohnkite) (KWin Script, take note to follow the instructions in the Enabling User-Configuration and Tips)
2. Force windows to start not maximised (so that window borders will show)
   ![Force window not maximised](/assets/images/uploads/kde-force-not-maximised.png)
3. Install [Move Window and Focus to Desktop](https://www.opencode.net/nightreveller/kwin-move-window-and-focus-to-desktop/-/tree/master/) (KWin Script to move window and focus to new desktop in one keyboard shortcut)

There are other ways to do this which uses i3 directly (like [this Reddit post](https://www.reddit.com/r/unixporn/comments/64mihc/i3_kde_plasma_a_match_made_in_heaven/)), but I couldn't find a way minimise Zoom to show the mini window (see below) on i3 so I decided to use Kröhnkite instead.

![Zoom Mini Window](/assets/images/uploads/zoom-mini-window.jpeg)

Zoom mini window (image source: https://www.law.hawaii.edu/sites/www.law.hawaii.edu/files/Zoom%20Training%20Final.pdf)

## Open specific Settings screens directly

- Bluetooth: `systemsettings5 bluetooth`

## Remember folder structure per folder on dolphin

`Hamburger button` > `Configure` > `Configure Dolphin` > `General` > `Behaviour` > `View` > `Remember display style for each folder` (as at Dolphin 21.08.0)

Adapted from: https://askubuntu.com/questions/1195505/how-to-change-how-files-are-sorted-in-different-folders-in-dolphin

## Windows like Icon theme

- [PlasmaXLight](https://store.kde.org/p/1367155)

## xbacklight command not working

- Solution: https://askubuntu.com/a/1060843

## Launch .desktop files from command line

Helpful to debug/test .desktop files

```shell
kioclient5 exec <path of .desktop file>
```

## Update application list after creating .desktop file

Either of these commands would work depending on the use case

- `sudo update-desktop-database`
- `update-desktop-database ~/.local/share/applications`
- `kbuildsycoca5`

Source: https://forum.kde.org/viewtopic.php?f=14&t=167056

## Install WPS office and block internet

Most people find success with the [Snap package](https://snapcraft.io/wps-2019-snap) that already disables internet, but it seems to only suport Gnome DE ([Github issue](https://github.com/cyrpaut/wps-2019-snap/issues/5)). After trying many methods (including setting up [OpenSnitch](https://github.com/evilsocket/opensnitch)), I finally found an easy solution that works well: Install the [flatpak version of WPS Office](https://flathub.org/apps/details/com.wps.Office) and block internet access in the flatpak configuration.

```bash
# install flatpak
flatpak install flathub com.wps.Office
# revoke internet access
sudo flatpak override com.wps.Office --unshare=network


#########################################################
# if necessary, enable internet access
sudo flatpak override com.wps.Office --share=network
```

Notes:

- .desktop files can be found at `/var/lib/flatpak/exports/share/applications`
- I can't seem to get the flatpak apps to run in GTK+ UI (based on the steps provided at https://wiki.archlinux.org/title/WPS_Office#Use_GTK+_UI), running `env GTK2_RC_FILES=/usr/share/themes/Breath/gtk-2.0/gtkrc flatpak run com.wps.Office -style=gtk+` still opens WPS Office in Qt mode, suggestions on how to fix that are welcome!

Sources:

- https://flathub.org/apps/details/com.wps.Office
- https://askubuntu.com/a/1320083
