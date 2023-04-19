---
title: Rebrand - personal website edition
slug: rebrand-personal-website
external: false
excerpt: Rebranding - how and why I re-designed and built my blog.
date: 2023-04-19
tags:
    - show and tell
    - javascript
---

It has been a bit over 2 years since I last refreshed my website ( _and blog_ ). This refresh is a bit different, I've decided to play around with a few new tools, and try to make the experience of writing and publishing content frictionless. All of this so that I can focus on creating content rather than, hosting / deployment / CDNs etc.

The previous website was using the following stack:

-   [Webpack 5](https://webpack.js.org/) - Build tool
-   [PostCSS](https://postcss.org/) - Modern CSS
-   [Eleventy](https://www.11ty.dev/) - Static Site Generator
-   [AlpineJS](https://github.com/alpinejs/alpine) - Minimal JS Framework
-   [TailwindCSS](https://tailwindcss.com/) - CSS but fun
-   [Github Actions](https://github.com/features/actions) - CD Pipeline

Which was a pleasure to use, however there were a lot of moving peices, and I wanted to simplify the process. I've decided to go with a more minimal approach, and use the following stack:

- [Astro](https://astro.build/) - Static Site Generator
- [TailwindCSS](https://tailwindcss.com/) - I love Tailwind!
- [Cloudfare Pages](https://pages.cloudflare.com/) - Static Site Hosting
- [Nix Flakes](https://nixos.wiki/wiki/Flakes) - Seamless development environment

Astro is the new kid on the block, the API is a joy to use, however, for my usecase any SSG would probably be fine. The neat thing with Astro is that I can add React here and there to enhance the experience. I've been using Tailwind since launch, and I do not see myself going back to writing normal CSS, it's nice to not have to context switch when writing components. Cloudfare Pages is a the offering from Cloudflare for hosting static websites ( which can be enhanced with workers ), its biggest selling point is the _point to Github repository_ for deployment, and as I manage my DNS with Cloudflare everything **just works**. Nix Flakes is a feature in Nix, I use it to setup my development environment, and to manage my dependencies ( node / pnpm ). I've been using Nix package manager to manage all my dependencies for projects as well as my system for a while now, and I can't recommend it enough. It's a bit of a learning curve, but once you get the hang of it, it's a joy to use.

P.S the code is [open sourced on Github](https://github.com/robalaban/blog) ( fork it, modify it feel free to play around ) - I encourage you to take a look 👀

#### Typography

The typography is powered by [tailwind typogprahy](https://github.com/tailwindlabs/tailwindcss-typography) plugin which relies on fluid typography. I've also added a few custom styles to make the typography more readable.

### Authoring Content

The blog, is statically generated, and the content is written in markdown. Using Astro, the content is parsed and rendered as HTML, at build time. To achieve this, I'm utilising `astro:content`, this  looks under the `src/content` directory, and parses all the markdown files.

```js
// src/pages/blog.astro

import { getCollection } from "astro:content";
const posts = await getCollection("blog"); // src/content/blog

// Sort posts by date
const sortedPosts = posts
	.filter((p) => p.data.draft !== true)
	.sort(
		(a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
	);
```

The above code queries the `blog` collection, and sorts the posts by date. The `draft` property is used to hide posts from the blog page, and is used to write posts without publishing them. The frontmatter of the markdown file is used to define the metadata of the post, and can be accessed via the `data` property.

In order to render the post, with a custom layout, under `src/blog/[slug].astro`, similar to other Javascript frameworks, we can access the query params via the `Astro.props` object.

```js
// src/blog/[slug].astro
import { getEntryBySlug } from "astro:content";

const entry = await getEntryBySlug("blog", Astro.params.slug);
const { Content } = await entry.render();
```

The above code queries the `blog` collection, and renders the post with the `Content` component. The `Content` component is a React component, which is used to render the markdown content.

## Frontmatter Zod Schema

The frontmatter of the markdown file is validated using [Zod](https://zod.dev) schema. The schema is defined in `src/content/config.ts`, and is used to validate the frontmatter of the markdown file, as well as provide useful autocomplete in VSCode.

```ts
import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    title: z.string({
      required_error: "Required frontmatter missing: title",
      invalid_type_error: "title must be a string",
    }),
    excerpt: z.string({
      required_error: "Required frontmatter missing: excerpt",
      invalid_type_error: "excerpt must be a string",
    }),
    date: z.date({
      required_error: "Required frontmatter missing: date",
      invalid_type_error:
        "date must be written in yyyy-mm-dd format without quotes: For example, Jan 22, 2000 should be written as 2000-01-22.",
    }),
  }),
});

// This key should match your collection directory name in "src/content"
export const collections = {
  'blog': blogCollection,
};
```

Schemas can be different for multiple content types. For example, the above schema is a 1:1 match for the blog posts, however, adding new content types can have their own different schemas.



