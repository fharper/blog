---
title: "devrelshow"
date: "2020-08-26"
slug: "devrelshow"
layout: base.njk
---

![devrelshow logo](../images/Twitter-logo.jpg)

Most Thursdays at 3PM ET, Fred sits down with a guest for a friendly conversation about their devrel journey and the industry, then hands the floor over for a technical demo on a topic the guest is passionate about. Join us live for the next #devrelshow and ask your questions, leave us a comment or just say hi!

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

My goal with the livestream is to give visibility to other developer advocates and foster a better understanding of developer relations. I want this show to help demystify our role, which isn't always clear, while helping people to find some inspiration and start their devrel journey. It's also an opportunity to learn from the guest about whatever they will share during the demo part of the show, and for the guest, to share about their product, if they want. Anyone in the tech industry, or even outside, can attend and hopefully, find value and have fun with us while listening to the devrelshow.

## Want to be a guest

Are you a Developer Advocate? If so, I want YOU to participate to the devrelshow: just [send me an email](mailto:hi@fred.dev?subject=devrelshow) mentioning your interest. You'll be added to the waitlist, and I'll reach out to you once we are ready to schedule your episode.

Now.

Go.

Come on.

I'm waiting!

![Gif of Fred saying you got this](../images/you-got-it.gif)

Here are some [guidelines](../recording-guidelines/) to review before the show, and please check the following [F.A.Q.](#faq), or [ping me](mailto:hi@fred.dev) if you have any other questions.

## F.A.Q.

### I want to be a guest

#### I don't have a lot of experience as a Developer Advocate, can I be a guest?

Of course! Everyone has something interesting to share about developer relations, no matter their official title or years of experience. The show would be boring if I only had dinosaurs like me!

#### My title isn't Developer Advocate, can I be a guest?

For the better or worse, there are as many titles (i.e., Developer Advocate, Technical Evangelist, VP of DevRel, Developer Relations Manager...) as there are definitions of the roles. As long as you are doing developer relations in a fashion or another, you are welcome to be a guest on the show. In the future, I may open the guest list to anyone working in tech, but for now, I keep the premise of the show, which is to talk developer relations with active practitioners.

#### I'm a manager, can I be a guest?

Individual contributors or managers can be guests, as long as you are still technical enough to manage the demonstration part of the show. After all, the audience is a technical one.

#### I don't want to demo anything, can I be a guest?

Unfortunately, no! The [demonstration](#what-is-the-demo-exactly) part of the show is quite important: it's not just about discussing developer relations, it's also about learning new things that can be useful in our daily work.

#### How can I participate?

[Send me an email](mailto:hi@fred.dev?subject=devrelshow) mentioning your interest to be a guest on the show.

#### Why should I participate?

If for nothing else, it will be fun, I promise! Think of it as two old (or new) friends having a laid-back discussion about developer relations. Also, you can totally demonstrate your product or service, which means it count toward your day job.

#### What happened once I mention my interest?

Once I receive your email, you'll be added to the waitlist. Once it's the time to schedule your episode, I'll reach out to you. We will try to find a date and time that works for both of us. Once we confirm those, I'll send you two meeting invites. One is for the livestream itself. The other is 15 minutes before we go live: useful to check your setup, last-minute questions and some directives. I'll update the invites with the livestream platform URL specific for our episode once I'm ready to start the promotion, which is usually a week or two before our scheduled date. I will tag you and your employers on [LinkedIn](https://www.linkedin.com/in/fredericharper/), [Twitter](https://x.com/fharper), and [Bluesky](https://bsky.app/profile/fharper.bsky.social), if you have accounts there. To help promote the events, a simple share from yours and your employer accounts would be highly appreciated.

### I am a guest

#### When is the show?

The show is usually every Thursday, depending on my schedule, at 3 PM ET/EDT/EST, with some exceptions depending on the guest's time zone and availability.

#### What is the show formula

Firstly, the livestream is pretty laid back! I can't emphasize enough the fact that one shouldn't stress about being on my show. I don't mind you swearing or that you decided to join the show in your pajamas or from your pool, but I will not tolerate any form of hate speech. Outside of that, we will do blunders, mispronounced things, and maybe have the demo God againsts us, but nobody will die and we will still have fun.

As for the structure of the show, the duration is usually around 45 to 60 minutes long, split in two parts. The first one is about you, your career, the role you have now and developer relations in general. I try to keep that part around 30 minutes. There is nothing to prepare, and no topics to define in advance as this should be a natural discussion between two friends. The second part is a demo from you ([more information](#what-is-the-demo-exactly)), which is usually around 15 minutes. Those are guidelines I'm trying to follow without being too intense as a time cop. If we do less, fine. If you do more, as long as we have fun, fine also.

#### What is the demo exactly?

It can be anything technical or targeted to a technical audience. It's all about learning something new, something useful and interesting for an audience of developer advocates, developers, DevOps and GitOps people. The demo should be more or less 15 minutes long and product pitches are welcomed. The only restriction is that whatever you are demoing, the viewers should be able to try it for free, even if it's for a limited period.

#### Can I do an audio-only episode?

Unfortunately, no, as it will make it harder for the demonstration part of the show. I will also not release audio-only versions of the episodes for the same reason. I understand that it's preventing guests who don't want to use a webcam or be seen publicly, nor make the listeners accessible to visual impair people. I'll try to think about something, but for now, it's video only, sorry.

#### What streaming platform are you using?

I use [StreamYard](https://streamyard.com), which I highly recommend. It's easy to use, and working in the browser, so the only thing you will have to do is give permission to access your microphone, webcam and screen sharing. You also have the option to [stream the episode on your or your employer's platforms](https://support.streamyard.com/hc/en-us/articles/14593948644756-How-do-I-Connect-Destinations-as-a-Guest) if you want, which would give more visibility to your episode. A week or two before our scheduled episode, I'll send you the link to the platform.

#### Where will it be streamed?

It will go live on my [YouTube](https://www.youtube.com/@fharper), [LinkedIn](https://www.linkedin.com/in/fredericharper/), [Twitter](https://x.com/fharper), [Twitch](https://www.twitch.tv/fredericharper), [Kick](https://kick.com/fredericharper) and [Facebook](https://www.facebook.com/harper.frederic) accounts. Once the livestream ends, the video will be available on YouTube as it is, with no editing.
