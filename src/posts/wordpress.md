---
title: "Moving out of WordPress"
date: "2024-10-19"
---

![Eleventy logo](../../images/11ty.svg)

After using WordPress as my main blogging and site platform for the last 19+ years, my site is now using [Eleventy](https://github.com/11ty/eleventy/) (11ty). The change is unrelated to the [WordPress drama](https://www.theverge.com/2024/9/27/24256361/wordpress-wp-engine-drama-explained-matt-mullenweg) happening with Matt Mullenger, the WordPress creator and overlord, but it's also the reason I finally took the time to make the jump to a static site generator (SSG). I've been thinking about moving to a SSG for a while to primarily, be less dependable technology-wise and being able to easily write articles in Markdown with a Git workflow. 11ty was my primary choice because JavaScript is still my programming language and enough interesting plugins are available to make my life easier.

With this change, I decided to go back to a minimalist and basic UI for the site. In the following days, I'll continue to update it (need some UI tweaks and Markdown to fix), but what you see is mostly what you'll get. I converted all posts, thanks to [wordpress-export-to-markdown](https://github.com/lonekorean/wordpress-export-to-markdown) and also all the pages, which may not yet be exactly as they were (ex.: the [speaking page](../../speaking) is missing the map).

Moving to an SSG give me a couple of advantages:

- No database needed.
- No security concerns.
- No backup needed (the [source of my site is on Git](https://github.com/fharper/blog), and can be redeployed within three minutes with one click).
- No platform or plugins updates server side needed.
- Tremendous speed gain.
- Better writing flows for me.

And probably a lot more advantages, but in other words, simplicity is the key here. For my needs, there is no drawback I can think of right now. In the last years, I felt the pain of maintaining the site as I don't blog as much as I used to. I have the desire to start to write a bit more again on this personal blog, and I hope that the new process in place will make it easier and more fun.
