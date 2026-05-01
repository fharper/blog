---
title: "devrelshow"
date: "2020-08-26"
slug: "devrelshow"
layout: base.njk
---

![devrelshow logo](../images/Twitter-logo.jpg)

Every other week on Thursday 3PM EDT/ET (with some exceptions), Fred and his guests discuss #devrel (developer relations) and learn about new things with the guests' demos. Join us live for the next #devrelshow and ask your questions or just say hi!

Here are some of the latest episodes. To watch any of the {{ devrelPlaylist.totalCount }} episodes, check the [playlist on YouTube](https://www.youtube.com/playlist?list=PLjMw8c44mBQuNaqruua27_oX9lQeUwrgO).

<div class="playlist-grid">
{% for video in devrelPlaylist %}
<div class="video-card">
  <a href="https://www.youtube.com/watch?v={{ video.id }}" target="_blank">
    <img src="{{ video.thumbnail }}" alt="{{ video.title }}">
    <h3>{{ video.title }}</h3>
  </a>
</div>
{% endfor %}
</div>

## Want to be a guest?

Are you a Developer Advocate? If so, I want YOU to participate to the devrelshow by filling this [form](https://docs.google.com/forms/d/e/1FAIpQLSc742r8gmMDciNXNa9NwlEoLyhzlXopLjVYVeogUxTFut0iUg/viewform).

Now.

Go.

Come on.

I'm waiting!

![Gif of Fred saying you got this](../images/you-got-it.gif)

The idea is simple, **we will have a discussion about developer relations**, who you are, what you do, tips you want to share, how you became one of us, your employer and anything that naturally sprung out of our discussion. Lastly, **you will give [a technical demo](#what-is-the-demo-exactly)**: it can be anything, really.

My goal is to give visibility to other developer advocates and foster a better understanding of developer relations. I want this show to help demystify our role which isn't always clear, while helping people to find some inspiration and start their devrel journey. Lastly, let's use this opportunity to learn from the guest about whatever useful they will share during the demo!

Outside of the demonstration part of the show (even that), no need to prepare anything: it will be a casual discussion between two (old or new) friends. It will go live on YouTube, LinkedIn, Twitter, Twitch, and Facebook: so no video editing, even after, but no worries, shit happens and nobody dies. I don't mind people swearing or that you decided to join the show in your pyjama, but I will not tolerate any form of hate speech.

Lastly, here are some [guidelines](../recording-guidelines/) to review before the show, and please check the following [F.A.Q.](#faq), or [ping me](../contact) if you have any other questions.

## F.A.Q.

### I don't have a lot of experience as a Developer Advocate, can I be a guest?

Of course! Everyone has something interesting to share about developer relations, no matter their official title or years of experience. The show would be boring if I only had dinosaurs like me!

### I don't want to demo anything, can I be a guest?

Unfortunately, no! The [demonstration](#what-is-the-demo-exactly) part of the show is quite important: it's not just about discussing developer relations, it's also about learning new things that can be useful in our daily work.

### I'm a manager, can I be a guest?

Individual contributors or managers can be guests, as long as you are still technical enough to manage the demonstration part of the show. After all, the audience is a technical one.

### My title isn't Developer Advocate, can I be a guest?

For the better or worse, there are as many titles (i.e., Developer Advocate, Technical Evangelist, VP of DevRel, Developer Relations Manager...) as there are definitions of the roles. As long as you are doing developer relations in a fashion or another, you are welcome to be a guest on the show. In the future, I may open the guest list to anyone working in tech, but for now, I keep the premise of the show, which is to talk developer relations with active practitioners.

### What is the demo exactly?

It can be anything technical or targeted to a technical audience. It's all about learning something new, something useful and interesting for an audience of developer advocates, developers, DevOps and GitOps people. The demo should be more or less 15 minutes long and product pitches are welcomed. The only restriction is that whatever you are demoing, the viewers should be able to try it for free, even if it's for a limited period.

### When is the show?

The show is usually every other Thursday, depending on my traveling schedule, at 3 PM ET/EDT, with some exceptions for the time-wise depending on the guest's location.

### Would there be audio-only episodes?

Unfortunately, no, as it will make it harder for the demonstration part of the show. I will also not release audio-only versions of the episodes for the same reason. I understand that it's preventing guests who don't want to use a webcam or be seen publicly, nor make the listeners accessible to visual impair people. I'll try to think about something, but for now, it's video only, sorry.
