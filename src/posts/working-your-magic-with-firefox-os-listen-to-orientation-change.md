---
title: "Working your magic with Firefox OS – Listen to orientation change"
date: "2013-08-05"
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
coverImage: "FFxOS_Devs_twitterHeader_1252x626_1.png"
slug: "working-your-magic-with-firefox-os-listen-to-orientation-change"
---

![FFxOS_Devs_twitterHeader_1252x626_1](images/FFxOS_Devs_twitterHeader_1252x626_1.png)One of the things I tried to do in the Firefox OS application I'm building is to manage the screen orientation. I want my application to know when the user changed the orientation of the phone, so I can take action accordingly. To do this, you need to listen to _onmozorientationchange_, and once it's called, you are able to know which orientation the phone is now: _portrait-primary_, _portrait-secondary_, _landscape-primary_, and _landscape-secondary_.

https://gist.github.com/fharper/6147153

It's now time for you to add this feature to your application.
