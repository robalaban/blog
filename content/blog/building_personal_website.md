---
title: Building my personal website
external: false
excerpt: Detailed view on building a modern, statically generated website with 11ty, Webpack deployed to Github Pages with the help of Github Actions
date: 2021-01-19
tags:
    - note
    - javascript
    - tutorials
---

I've been putting off building a personal website for such a long time. I couldn't find a good enough reason to spend time creating one. Questions like the following kept coming up:

-   Are personal website _even_ useful in the era of Twitter / Github?
-   Is my content worth sharing?

However, I still found myself thinking of what my _"corner"_ of the web would look like. I had to change perspective, I had to make the project interesting enough. Luckily turns out that making a personal website is the perfect opportunity to pick-up and learn some new technologies / methodologies. After spending a good few hours seaching - I stumbled upon a few really interesting projects that I had to give a try. The culprits composing the stack for my webiste are the following:

-   [Webpack 5](https://webpack.js.org/) - Build tool
-   [PostCSS](https://postcss.org/) - Modern CSS
-   [Eleventy](https://www.11ty.dev/) - Static Site Generator
-   [AlpineJS](https://github.com/alpinejs/alpine) - Minimal JS Framework
-   [TailwindCSS](https://tailwindcss.com/) - CSS but fun
-   [Github Actions](https://github.com/features/actions) - CD Pipeline

Now that I have chosen and am pretty happy with the stack, I had to find out why build something from the ground up. Why not just use an existing framework / starter template? The answer was quite simple: _I want to make the website as user friendly as possible._ Things that are important to me:

-   Accessability ( typography, colors, navigation )
-   Fast development environment ( Quick turnaround time )
-   Serverless ( I don't want to have any overhead )

P.S the code is [open sourced on Github](https://github.com/robalaban/notes) ( fork it, modify it feel free to play around ) - I encourage you to take a look 👀

### Accessability

Eleventy comes with some very cool features catered towards accessability. However, some of the things that I've added in are: Dark mode, fluid typography.

#### Typography

I haven't perfected this, but I am quite happy where the website is at. As this is a blog I focused a lot on the typography, for this I used the awesome (official) [tailwind typogprahy](https://github.com/tailwindlabs/tailwindcss-typography) plugin, which relies on fluid typography

#### Dark Mode

### Setting up the environment

Great! Now that we have the basic building blocks we can look at creating our directories and files that will populate our website. But before we get into that we need to set up snowpack and tell it where to look for our files to build. If like me you haven't tried Snowpack, I suggest you skim through the official docs [here](https://www.snowpack.dev/#config-files) or just follow along.

```js
// .eleventy.js

module.exports = (eleventyConfig) => {
    // Layout aliases
    eleventyConfig.addLayoutAlias("default", "layouts/default.njk");

    return {
        templateFormats: ["md", "njk"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        passthroughFileCopy: true,

        dir: {
            input: "site",
            output: "_output",
            includes: "includes",
        },
    };
};
```

The above is a _very_ minimal setup for 11ty it basically says to look into the `site` directory and watch the file formats `md & njk`. The resulting output after parsing will go into the `_output` folder. However, in order to make this work we need some sort of bundler to aid in the process - for this I have chosen to go with [Snowpack](https://www.snowpack.dev/). Snowpack uses `snowpack.config.json` for its configuration, lets quickly take a look at it.

```json
// snowpack.config.json

{
    "mount": {
        "_output": "/",
        "src": "/_dist_"
    },
    "plugins": [
        [
            "@snowpack/plugin-run-script",
            {
                "cmd": "eleventy", // production build
                "watch": "$1 --watch" // dev
            }
        ],
        "@snowpack/plugin-postcss"
    ]
}
```

First we can see some plugins you can go ahead and install them using npm: `npm i @snowpack/plugin-run-script @snowpack/plugin-postcss` these plugins further extend snowpacks configuration and allow us to use postcss for our css. The run script plugin pipes down information on `dev` and `production` builds. With that being said, lets also quickly look at the PostCSS config.

```js
//postcss.config.js

module.exports = {
    plugins: [
        require("postcss-easy-import"),
        require("postcss-preset-env")({ stage: 3 }),
    ],
};
```

PostCSS API is rather simple - but I do suggest you head over the official docs and take a look at what is possible (hint a lot). Now that we have the 3 main config files up and running we can simply start our dev server using: `npm run snowpack dev` or alternatively create a `start` script in `package.json`. This will open a HTTP server on port 80, Snowpack is doing this for us, as well as watch and hot-reload from the site folder.

### Eleventy goodies - templates, plugins, filters

Now that the configuration is out of the way. Lets explore some of the features 11ty has to offer.

#### Templates

One of the reason I chose to go with 11ty is that it allowed me to make a choice on what templting engine I could use. Each individual blog post or "note" as I call them are written in Markdown, however all the other pages use Nunjucks templating from Mozilla. This gives the developer the opportunity to separate logic in `layouts` and `partials`.

#### Plugins

Nobody loves a well maintained pluging eco-system more than me, and have to say after using 11ty for my blog - it not only delivered but it did so above expectations. Plugins are maintained on their official website [here](https://www.11ty.dev/docs/plugins/). And adding plugins to the config is really simple. For my website I'm using the official [Navigation](https://www.11ty.dev/docs/plugins/navigation/) plugin to use font-matter to generate the navigation menu. I won't go into implementation details as their readme does a fantastic job to get everyone up and running.

#### Filters

Not going to lie, I absolutley love this feature and can't wait to explore and come up with some crazy implementations. In short, filters are functions which can be applied to variables in Nunjucks templates the current usecase I have found for them is to parse the datestring in my posts and convert it to an easier to read format. The documentation for filters can be found [here](https://www.11ty.dev/docs/filters/).
