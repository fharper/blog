---
title: "Working your magic with Firefox OS - Playing mp4"
date: "2013-07-30"
categories: 
  - "brainer"
  - "en"
  - "fixtxt"
  - "fiximg"
  - "fixlang"
  - "fixtags"
  - "fixurl"
tags: 
  - "working-your-magic-with-firefox-os"
image: "FFxOS_Devs_twitterHeader_1252x626_1.png"
slug: "working-your-magic-with-firefox-os-playing-mp4"
---

![FFxOS_Devs_twitterHeader_1252x626_1](images/FFxOS_Devs_twitterHeader_1252x626_1.png)Everything you are looking for, about Firefox OS development, is either on the [Firefox MarketPlace Developer Hub](https://marketplace.firefox.com/developers/) or on the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS?menu). We are also publishing blog posts on our blog, [Mozilla Hacks](https://hacks.mozilla.org/), and I will do it also. Once in a while, I come with questions or code examples I want to share that doesn't really fit in the hacks blog for different reasons. In that situation, I'll use my own blog to share with you some of this stuff. Because I like posts series, this one will be named "[Working your magic with Firefox OS](http://fred.dev/tag/working-your-magic-with-firefox-os/)".

For the first one, I got an interesting question from a developer last week. He was asking if it's possible to play mp4 in a Firefox OS application. The answer is yes, and no. You cannot play a mp4 in the <video> tag for security reason, but there is another way to do it: Web Activity. By using this sample code below, you will be able to play a mp4 file.

https://gist.github.com/fharper/6091404

Keep in mind that for now, it's not working in the simulator, and it also depends on the codecs on a real device. As an example, it wasn't working with a file using isom, but it worked well with one using mp42 codec.
