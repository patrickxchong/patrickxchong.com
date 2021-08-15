---
title: Hide Discord Sidebar
excerpt: Chrome extension that installs an unfolding sidebar for Discord
  channels and a button that hides/shows the Discord server list.
status: published
tags:
  - tech
  - webdev
author: patrick-chong
date: 2021-03-18T15:04:21.568Z
image: /assets/images/uploads/HideDiscordSidebar.png
imageCardPostPosition: left-top
---
[[toc]]

## What is Hide Discord Sidebar?

Hide Discord Sidebar is a Chrome extension for Discord users who find the Discord sidebar too huge and wish to minimize/hide it when they are not using it. This extension minimizes the channels list into a small left sidebar when it is not in use as well as installs a button on the top right corner that hides/shows the Discord server list.


## How did it come about?

Hide Discord Sidebar a little tool I built to solve a small problem I had. It started when my partner and I started using Discord to streamline the conversations we have on various topics (music/food/tech/travel etc) and we didn't like the space taken up by the server and channel sidebars. So I decided to give myself the opportunity to learn how to build a Chrome extension so that I can customize the Discord interface. The code itself is relatively simple. Just some CSS to minimize the channels sidebar initially and to expand it on hover, and a button that hides/shows the server sidebar with Javascript.

## Final Thoughts

Fast forward to two years, Hide Discord Sidebar currently has 5000+ users (as of Oct 2020). Although it would require fixing whenever a Discord update breaks it (which happened around 3 times so far), maintaining the extension is relatively painless since I would consider the functionality of the extension to be complete (and so there's no need to build new features).

## Links

Chrome extension: http://bit.ly/Hide-Discord-Bar

Source code: https://github.com/patrickxchong/hide-discord-sidebar (Give the repo a star if you like!)