---
title: KDE Plasma Notes
excerpt: Ongoing list of tips and fixes with KDE Plasma on Manjaro
status: published
tags:
  - tech
  - linux
author: patrick-chong
date: 2021-09-04T12:03:14.260Z
updatedAt: ""
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

There are other ways to do this which uses i3 directly (like [this Reddit post](https://www.reddit.com/r/unixporn/comments/64mihc/i3_kde_plasma_a_match_made_in_heaven/))

## Open specific Settings screens directly

- Bluetooth: `systemsettings5 bluetooth`

## Remember folder structure per folder on dolphin

`Hamburger button` > `Configure` > `Configure Dolphin` > `General` > `Behaviour` > `View` > `Remember display style for each folder` (as at Dolphin 21.08.0)

Adapted from: https://askubuntu.com/questions/1195505/how-to-change-how-files-are-sorted-in-different-folders-in-dolphin

## Windows like Icon theme

- [PlasmaXLight](https://store.kde.org/p/1367155)

## xbacklight command not working

- Solution: https://askubuntu.com/a/1060843