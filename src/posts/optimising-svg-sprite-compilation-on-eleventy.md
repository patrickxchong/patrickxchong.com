---
title: Optimising SVG Sprite compilation on Eleventy
excerpt: Draft excerpt
status: draft
tags:
  - Tech
  - 11ty
  - Tutorial
author: patrick-chong
date: 2020-05-21T02:31:10.530Z
image: /assets/images/uploads/FrontPage.jpg
---

[[toc]]

## Background

I started out my Eleventy journey by exploring starter templates that come with Alpine.js, Tailwind.css and good Lighthouse scores, and eventually settled with [Shane Robinson](https://github.com/shanerobinson)'s [11ta-template](https://github.com/11ta/11ta-template) as I liked how tags and pagination were already built in and the site structure was similar to my previous blog.

But when trying to modify the starter template, I got really frustrated with the slow rebuild times whenever I save (I spam CTRL-S fairly often). Each rebuild took about 5-10s. I was like, "Is this really how building something with Eleventy should feel like? I thought it's supposed to be fast?". Neither could I find much complaints about slow Eleventy rebuilds in development as well.

Things improved a little when I found out about Eleventy's `--incremental` flag, but I still had to wait about 3-5s after every save, which was still very annoying.

## Solution: Eleventy's beforeBuild hook

## Better Solution: Caching SVG paths
