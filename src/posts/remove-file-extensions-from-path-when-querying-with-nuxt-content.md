---
title: Remove file extensions from path when querying with @nuxt/content
excerpt: A lesson learnt from setting up @nuxt/content on patrickxchong.com
status: published
tags:
  - Tech
  - WebDev
  - Nuxt
  - Lessons
author: patrick-chong
date: 2020-09-09T08:13:52.254Z
image: /assets/images/uploads/nuxt_content_request_failed.png
imageCardPostPosition: left-top
---

[[toc]]

## Problem

I was migrating this blog from [`hmsk/frontmatter-markdown-loader`](https://github.com/hmsk/frontmatter-markdown-loader) to [`@nuxt/content`](https://github.com/nuxt/content) to make use of `@nuxt/content`'s powerful Markdown query features and faced a weird bug when I was setting things up. I adapted the code from https://content.nuxtjs.org/fetching but got:

![Nuxt content request failed](/assets/images/uploads/nuxt_content_request_failed.png)


But when I visited the url at `http://localhost:3000/_content/pages/home.md`, I see the Markdown file
![Nuxt content request successful](/assets/images/uploads/nuxt_content_request_successful.png)

## What happened?

After trying everything from disabling buildModules/modules/loaders to referring to the example at https://github.com/nuxt-company/demo-blog-nuxt-content to setting up a new Nuxt project with the content module enabled with yarn create nuxt-app. I finally realized what I did wrong.

`@nuxt/content`'s API is `$content(path, options?)`, and the properties of `path` listed on their [documentation](https://content.nuxtjs.org/fetching#contentpath-options) is:

```txt
Type: String
Default: /
```

Which I took to be the full path of the file (in this case `pages/home.md`). So I ended up doing

```js
// pages/index.vue
async asyncData({ $content, error }) {
  try {
    const page = await $content("pages/home.md").fetch();
    return {
      page,
    };
  } catch (err) {
    console.error(err);
    error({ statusCode: 404, message: 'Post not found' });
  }
  return {};
},
```

Which led to the weird situation where the markdown file wasn't fetched in asyncData, but somehow worked when I visited the request URL directly (this is likely a bug/not expected behaviour since the [documentation](https://content.nuxtjs.org/advanced#api-endpoint) also specifies that the API endpoint should be queried without the file extensions.

## Solution

The fix was simple. All I had to do was to remove the file extension from the page and everything worked beautifully!

```js
// pages/index.vue
const page = await $content('pages/home').fetch()
```

## Final Thoughts

Despite wasting more than half a day trying to figure out this lame if-only-I-understood-the-docs better/if-only-the-docs-had-better-examples bug, I was quite happy with how easily I can query, filter, sort through the markdown files with the `@nuxt/content` API. It's way better compared to the queries I wrote last time to power this blog. `@nuxt/content` plays very well with Netlify CMS as well, quite excited to add in features (like search) with the capabilities of `@nuxt/content`!
