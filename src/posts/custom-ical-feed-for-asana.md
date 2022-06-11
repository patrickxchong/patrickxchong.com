---
title: Custom Asana ICal Sync to Google Calendar
excerpt: Improved event sync from Asana to Google Calendar with configurable ICal feed
status: published
tags:
  - Tech
  - Automation
  - Google Apps Script
author: patrick-chong
date: 2022-06-11T13:07:17.485Z
image: /assets/images/uploads/asana-gcal.png
imageHero: true
imageHeroObjectFit: object-cover
---

[toc]

## Asana to ICal

Script below fetches events from Asana and returns formatted ICal Feed. I deployed the function as a lambda on [Vercel](https://vercel.com/).

<script src="https://gist.github.com/patrickxchong/9dbae2f68ad31313c8c824f359dea6e7.js"></script>

## Sync ICal feed with Google Calendar

The existing Google Calendar ICal sync updates very slow (between 12-24 hours). So I used the script from https://github.com/derekantrican/GAS-ICS-Sync to sync events from Asana (through the Vercel lambda API endpoint) to Google Calendar more frequently.
