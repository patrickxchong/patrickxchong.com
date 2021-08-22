---
title: Why I rebuilt my blog with Eleventy
excerpt: Turns out I don't need a reactive framework, but a templating framework
status: published
tags:
  - tech
  - nuxt
  - 11ty
author: patrick-chong
date: 2021-08-15T02:31:10.530Z
image: /assets/images/uploads/eleventy.png
---

My first intro to Javascript frontend frameworks is through [Vue.js](https://github.com/vuejs/vue) in 2017. I really like Vue's [Single File Components](https://vuejs.org/v2/guide/single-file-components.html) and how similar the Vue syntax is to HTML. Naturally, I transitioned to the batteries loaded [Nuxt.js](https://github.com/nuxt/nuxt.js) that already sets up Vue Router, Vuex, SSR etc under the hood. In fact I built the first iteration of this blog with Nuxt's [static mode](https://nuxtjs.org/docs/2.x/concepts/static-site-generation) and the very helpful [Nuxt Content](https://github.com/nuxt/content) module.

As much as the status quo works, I've never been very happy with the long Javascript build process, the large Javascript bundles that are created (and have to be downloaded), and the Vue.js hydration process that needs to happen on the client-side. Given these limitations, I started looking for better alternatives. After all, the main reason why I like Vue is because I could create reusable components. For the most part, I was looking for **templating**, not **reactivity**.

There are already common templating languages such as [Pug](https://github.com/pugjs/pug), [Handlebars](https://github.com/handlebars-lang/handlebars.js) and [Mustache](https://www.npmjs.com/package/mustache), but they're often used with servers like [Express](https://github.com/expressjs/express), and there aren't a ton of places to host a server for free with no downtime/cold starts. I'm sure there's a way to prerender a site using Express with one of the template languages above and some Markdown files, it doesn't seem to be a very common solution.

Hence I began my SSG exploration! I tried [Hugo](https://github.com/gohugoio/hugo) and [Eleventy](https://github.com/11ty/eleventy). Hugo because it is touted as the [most performant solution](https://css-tricks.com/comparing-static-site-generator-build-times). Eleventy because it has gathered a lot of traction despite being quite new, and is currently powering [web.dev](https://web.dev), [A11y Project](https://www.a11yproject.com) and [eslint.org](https://eslint.org), organisations that care a lot about best practices (which I assume to mean that Eleventy does conform to their definition of best practices).

My limited experience with _Hugo_ was quite confusing. I tried and retried a couple of starter templates but felt stuck trying to understand Hugo's `config.toml` and templating syntax, as well as working out a development process with asset compilation in the theme folder and Hugo's own site generation process. Overall my takeaway was that **It's hard to customise a Hugo site, especially with limited Go experience**. Since I do want to be able to customise freely, and didn't want to spend too much time trying to figure out Go, I decided to not pursue Hugo for now (though I'm pretty sure I'll revisit it someday).

Which leads me to Eleventy, which was much easier to understand since it's all Javascript. I did run into some teething troubles, mostly with trying to recreate Vue Single File components in Eleventy (There's [eleventy-plugin-vue](https://github.com/11ty/eleventy-plugin-vue), but I wasn't too keen on trying that as it's pretty experimental). I ended up using the [Nunjucks](https://github.com/mozilla/nunjucks) template language because it's similar to Python's [Jinja2](https://github.com/pallets/jinja/) that I have experience with. Nunjuck's [Macros](https://mozilla.github.io/nunjucks/templating.html#macro) and Eleventy's [shortcodes + paired shortcodes](https://www.11ty.dev/docs/shortcodes/) provided a functional way to create components, although I definitely wish for a nicer syntax to create universal components/paired shortcodes in Eleventy instead of declaring them in Javascript strings. I was stuck with slow rebuilds in development with the starter template that I used, but that gave me an opportunity to peek under the hood of how Eleventy works, and it's really suprising how **easy** it was to create an [Eleventy plugin](https://github.com/patrickxchong/eleventy-plugin-svg-sprite) with the fix that I came up with (blog post coming soon on that).

And there we have it, why I ended up rebuilding this blog with Eleventy. Appreciate the very supportive Eleventy community on Discord who have helped me with my questions. Eleventy isn't perfect, but it's pretty good at its job right now and it's still improving. I look forward to how much more awesome it will be when V1 is launched! 😍

Edit 1:
I use [Alpine.js](https://github.com/alpinejs/alpine) as a replacement for Vue.js on this blog. I've not mixed Alpine components with Nunjucks macros yet, but I do foresee possible issues with code duplication when declaring Alpine components with the [Alpine Data](https://alpinejs.dev/globals/alpine-data) syntax. Will have to explore further on this.

P.S. It was pretty exciting to get a 100 Lighthouse score on mobile, not surprising since Eleventy itself doesn't inject any scripts, and [Eleventy Img](https://www.11ty.dev/docs/plugins/image/) handles image processing so well. Thankfully [Alpine.js](https://github.com/alpinejs/alpine) and the [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) (with PurgeCSS) have minimal impact on the site's load time.
![Patrick Chong blog lighthouse score](/assets/images/uploads/lighthouse-100.png)
