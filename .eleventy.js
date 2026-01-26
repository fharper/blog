const { DateTime } = require('luxon');
const readingTime = require('eleventy-plugin-reading-time');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require('fs');
const path = require('path');
const htmlmin = require("html-minifier");

const isDev = process.env.ELEVENTY_ENV === 'development';
const isProd = process.env.ELEVENTY_ENV === 'production'

const manifestPath = path.resolve(
  __dirname,
  'public',
  'assets',
  'manifest.json'
);

const manifest = isDev
  ? {
      'main.js': '/assets/main.js',
      'main.css': '/assets/main.css',
    }
  : JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }));

const { execSync } = require('child_process')
const embedYouTube = require("eleventy-plugin-youtube-embed");
const brokenLinksPlugin = require("eleventy-plugin-broken-links");

// Anchor links
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const slugify = require("slugify");

//Eleventy Configurations
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  //Replace Markdown with custom configurations
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true
  }).use(markdownItAnchor, {
    level: [2, 3, 4, 5, 6],
    slugify: (str) =>
      slugify(str, {
        lower: true,
        strict: true,
        remove: /["]/g,
      }),
    permalink: markdownItAnchor.permalink.linkInsideHeader({
      symbol: ' #',
      placement: 'after',
      ariaHidden: true,
      class: 'header-anchor',
    }),
  });

  eleventyConfig.setLibrary("md", md);

  //Search: pageFind
  eleventyConfig.on('eleventy.after', () => {
    execSync(`npx pagefind --site public --glob \"**/*.html\"`, { encoding: 'utf-8' })
  })

  //YouTube embedded plugin
  eleventyConfig.addPlugin(embedYouTube);

  //Broken links plugins
  eleventyConfig.addPlugin(brokenLinksPlugin, {
    forbidden: "error",
    exclude: [
      "https://vivo-us.com*"
    ]
  });

  // setup mermaid markdown highlighter
  const highlighter = eleventyConfig.markdownHighlighter;
  eleventyConfig.addMarkdownHighlighter((str, language) => {
    if (language === 'mermaid') {
      return `<pre class="mermaid">${str}</pre>`;
    }
    return highlighter(str, language);
  });

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });
  eleventyConfig.setBrowserSyncConfig({ files: [manifestPath] });

  eleventyConfig.addShortcode('bundledcss', function () {
    return manifest['main.css']
      ? `<link href="${manifest['main.css']}" rel="stylesheet" />`
      : '';
  });

  eleventyConfig.addShortcode('bundledjs', function () {
    return manifest['main.js']
      ? `<script src="${manifest['main.js']}"></script>`
      : '';
  });

  eleventyConfig.addFilter('excerpt', (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, '');
    return content.substr(0, content.lastIndexOf(' ', 200)) + '...';
  });

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('dateToIso', (dateString) => {
    return new Date(dateString).toISOString()
  });

  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addCollection('tagList', function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ('tags' in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function (item) {
          switch (item) {
            case 'all':
            case 'nav':
            case 'post':
            case 'posts':
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    return [...tagSet];
  });

  eleventyConfig.addFilter('pageTags', (tags) => {
    const generalTags = ['all', 'nav', 'post', 'posts'];

    return tags
      .toString()
      .split(',')
      .filter((tag) => {
        return !generalTags.includes(tag);
      });
  });

  // Add .htaccess
  eleventyConfig.addPassthroughCopy({ 'src/.htaccess': '.htaccess' });

  // Add slides
  eleventyConfig.addPassthroughCopy({ 'src/slides/': 'slides/' });

  // Add docs
  eleventyConfig.addPassthroughCopy({ 'src/docs/': 'docs/' });

  //Pinned posts
  //Usage:
  //
  //pinned: true
  //
  eleventyConfig.addCollection("postsSorted", function(collectionApi) {
    const allPosts = collectionApi.getFilteredByTag("posts").slice().reverse(); // newest first

    const pinned = allPosts.filter(post => post.data.pinned === true);
    const unpinned = allPosts.filter(post => !post.data.pinned);

    return [...pinned, ...unpinned];
  });

  // Add custom filter to group talks
  eleventyConfig.addFilter("groupTalksByYear", function(talks) {
    if (!talks || !Array.isArray(talks)) {
      return {
        upcoming: [],
        past: {},
        upcomingLivestreams: [],
        pastLivestreams: {},
        upcomingPodcasts: [],
        pastPodcasts: {},
        upcomingWebinars: [],
        pastWebinars: {},
        upcomingInterviews: [],
        pastInterviews: {},
        stats: { total: 0, past: 0, upcoming: 0, cities: 0, countries: 0, keynotes: 0, panels: 0 },
        livestreamStats: { total: 0, past: 0, upcoming: 0 },
        podcastStats: { total: 0, past: 0, upcoming: 0 },
        webinarStats: { total: 0, past: 0, upcoming: 0 },
        interviewStats: { total: 0, past: 0, upcoming: 0 }
      };
    }

    const now = new Date();
    const result = {
      upcoming: [],
      past: {},
      upcomingLivestreams: [],
      pastLivestreams: {},
      upcomingPodcasts: [],
      pastPodcasts: {},
      upcomingWebinars: [],
      pastWebinars: {},
      upcomingInterviews: [],
      pastInterviews: {},
      stats: {
        total: 0,
        past: 0,
        upcoming: 0,
        cities: new Set(),
        countries: new Set(),
        keynotes: 0,
        panels: 0
      },
      livestreamStats: {
        total: 0,
        past: 0,
        upcoming: 0
      },
      podcastStats: {
        total: 0,
        past: 0,
        upcoming: 0
      },
      webinarStats: {
        total: 0,
        past: 0,
        upcoming: 0
      },
      interviewStats: {
        total: 0,
        past: 0,
        upcoming: 0
      }
    };

    talks.forEach(talk => {
      if (!talk.date) return;

      const talkDate = new Date(talk.date + 'T23:59:59Z');
      const isLivestream = talk.type && talk.type.toLowerCase() === 'livestream';
      const isPodcast = talk.type && talk.type.toLowerCase() === 'podcast';
      const isWebinar = talk.type && talk.type.toLowerCase() === 'webinar';
      const isInterview = talk.type && talk.type.toLowerCase() === 'interview';

      if (isLivestream) {
        result.livestreamStats.total++;

        if (talkDate.getTime() > now.getTime()) {
          result.upcomingLivestreams.push(talk);
          result.livestreamStats.upcoming++;
        } else {
          const year = talkDate.getFullYear();
          if (!result.pastLivestreams[year]) {
            result.pastLivestreams[year] = [];
          }
          result.pastLivestreams[year].push(talk);
          result.livestreamStats.past++;
        }
      } else if (isPodcast) {
        result.podcastStats.total++;

        if (talkDate.getTime() > now.getTime()) {
          result.upcomingPodcasts.push(talk);
          result.podcastStats.upcoming++;
        } else {
          const year = talkDate.getFullYear();
          if (!result.pastPodcasts[year]) {
            result.pastPodcasts[year] = [];
          }
          result.pastPodcasts[year].push(talk);
          result.podcastStats.past++;
        }
      } else if (isWebinar) {
        result.webinarStats.total++;

        if (talkDate.getTime() > now.getTime()) {
          result.upcomingWebinars.push(talk);
          result.webinarStats.upcoming++;
        } else {
          const year = talkDate.getFullYear();
          if (!result.pastWebinars[year]) {
            result.pastWebinars[year] = [];
          }
          result.pastWebinars[year].push(talk);
          result.webinarStats.past++;
        }
      } else if (isInterview) {
        result.interviewStats.total++;

        if (talkDate.getTime() > now.getTime()) {
          result.upcomingInterviews.push(talk);
          result.interviewStats.upcoming++;
        } else {
          const year = talkDate.getFullYear();
          if (!result.pastInterviews[year]) {
            result.pastInterviews[year] = [];
          }
          result.pastInterviews[year].push(talk);
          result.interviewStats.past++;
        }
      } else {
        result.stats.total++;

        if (talkDate.getTime() > now.getTime()) {
          result.upcoming.push(talk);
          result.stats.upcoming++;
        } else {
          const year = talkDate.getFullYear();
          if (!result.past[year]) {
            result.past[year] = [];
          }
          result.past[year].push(talk);
          result.stats.past++;

          const talkType = talk.type ? talk.type.toLowerCase() : '';

          if (talkType === 'keynote') {
            result.stats.keynotes++;
          }

          if (talkType === 'panel') {
            result.stats.panels++;
          }

          result.stats.cities.add(talk.city);
          result.stats.countries.add(talk.country);
        }
      }
    });

    result.stats.cities = result.stats.cities.size;
    result.stats.countries = result.stats.countries.size;

    result.pastYears = Object.keys(result.past).sort((a, b) => b - a);
    result.pastLivestreamYears = Object.keys(result.pastLivestreams).sort((a, b) => b - a);
    result.pastPodcastYears = Object.keys(result.pastPodcasts).sort((a, b) => b - a);
    result.pastWebinarYears = Object.keys(result.pastWebinars).sort((a, b) => b - a);
    result.pastInterviewYears = Object.keys(result.pastInterviews).sort((a, b) => b - a);

    return result;
  });

  // Add date formatting filter
  eleventyConfig.addFilter("formatTalkDate", function(dateString) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const day = date.getUTCDate();
    const year = date.getFullYear();

    return `${day} ${month} ${year}`.toUpperCase();
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Social media image
  eleventyConfig.addFilter("getFirstImage", function(content) {
    if (!content) return null;

    // Match img tags and extract src
    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i;
    const match = content.match(imgRegex);

    return match ? match[1] : null;
  });

  return {
    dir: {
      input: 'src',
      output: 'public',
      includes: 'includes',
      data: 'data',
      layouts: 'layouts'
    },
    passthroughFileCopy: true,
    templateFormats: ['html', 'njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
