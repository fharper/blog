---
title: "Ginger & WYSIWYG, not playing well together"
date: "2013-08-01"
image: "2013-08-01_0953.png"
slug: "ginger-wysiwyg-not-playing-well-together"
---

![2013-08-01_0953](images/2013-08-01_0953.png)

If you are using [Ginger](https://www.gingersoftware.com), the grammar corrector, with a WYSIWYG (What You See Is What You Get) editor, like the one in Wordpress, be aware that Ginger may add spaghetti to your code. I'm trusting TinyMCE inside of Wordpress for years as the code it generates is valid, and is far better than it was before, but one week ago I noticed something in my code: Ginger was adding HTML elements to it, his way to manage the correction in my text. What a surprise to see that sometimes, this code was saved in my post. The result? An HTML code stuffed of span that shouldn't be there after I finished the correction. Here is an example:

More concretely, it means going to conferences, user groups, startup incubators, universities…. **<span class="GINGER\_SOFATWARE\_correct">**to**</span>** present about your technology, to talk with, and meet people. This is where you will build strong relationships, and where you'll find **<span class="GINGER\_SOFATWARE\_correct">**influencers**</span>** to help you achieve your goal, and scale. It's not just about conferences, think about **<span class="GINGER\_SOFATWARE\_noSuggestion GINGER\_SOFATWARE\_correct">**hackathons**</span>**, and workshops: they are good places to help people learn your API, or start to use your product. You can also leverage what you are doing offline, online, by doing video interviews, recording your talk or doing recapitulation blog posts.

Maybe it was a bug for a specific version, perhaps it was a problem with Wordpress, but it was enough to remove Ginger, and clean my code (I still need to look in older posts to see if there is still improper code). At the end, I don't want any plugin or application to miss with the code from my posts. If Ginger screw your code too, use an editor like [Sublime Text](https://www.sublimetext.com/) who can find & replace with regular expression, and use the number 1 to find, and number 2 to replace:

1.     (GINGER(\[^<\]\*))</span>
2.     1

It will find all the _</span>_, and replace them with everything in the first parenthesis (the code/text we want to keep for now). After this one, we can now remove the first part of the Ginger <span> by using the next string to find, and replace it with nothing:

1.     <span class="GINGER(\[^>\]\*)>

It should leave you with a clean code, at least without any Ginger specific elements. I tried it on many posts with success. Hope it will help you too.

_P.S.: I wonder if the class GINGER\_SOFATWARE is a typo by developers or not._
