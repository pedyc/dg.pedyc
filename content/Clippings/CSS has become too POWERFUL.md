---
title: CSS has become too POWERFUL
author: ["[[Andreas Møller]]"]
description: "Modern CSS is amazing. It empowers us to build incredible experiences on the web, but as CSS becomes more powerful, we are beginning to see a new weak point."
tags: ["clippings"]
date-created: 2025-11-22
date-modified: 2025-12-01
created: 2025-11-22
published: 2025-11-19
source: "https://blog.nordcraft.com/css-has-become-too-powerful?ref=dailydev"
---

[v.1.0.66](https://github.com/nordcraftengine/nordcraft)

[The Nordcraft Blog](https://blog.nordcraft.com/)

Modern CSS is amazing. It empowers us to build incredible experiences on the web, but as CSS becomes more powerful, we are beginning to see a new weak point.

![[c28774ea69ab125c23b1dc799789b12f_MD5.jpg]] ![[ac133da025bc4a7746c42a89cb59a06a_MD5.jpg]]

November 19, 2025

When I got my first job as a web developer, it was common to have to come up with different hacks to work around the limitations of CSS. Those times are long gone. Modern CSS is amazing. It has powerful layout algorithms, 3D transforms and an incredibly capable set of animation primitives.

Most of the limitations of modern CSS don't actually have anything to do with its capabilities. Instead, it has to do with how we write it. For this reason, the future of CSS might not be text files, but visual editors.

You might be ready to call blasphemy and close the tab in anger, but if you stick around i'll do my best to make the case.

## Colors

A great example is [OKLCH](https://css-tricks.com/almanac/functions/o/oklch/). The OKLCH color space was added as part of the CSS Color Level 4 Specification. OKLCH has a lot of benefits over previous color spaces but you might have discovered that it can be tricky to wrap your head around if you are used to HEX or RGB.

Many web developers have built up an intuition for HEX and RGB over the years, but OKLCH is new way of thinking about colors that requires you to relearn much of that intuition. You can probably tell me what color #FF00FF is but likely not oklch(0.7017 0.3225 328.36).

In the recent 2025 State of CSS survey only 12% of participants reported that they had tried Any of the new level 4 wide gamut color spaces and had a positive experience.

Using an OKLCH color picker (like the one below by [Adam Argyle](https://nerdy.dev/)) completely changes this experience. The UI makes working with OKLCH intuitive and makes it trivial to e.g. create different shades of the same base color.

## Gradients

When working with gradients, the benefit of visual tooling becomes even more clear.

Without a visual editor like [https://gradient.style](https://gradient.style/), working with gradients can be a very frustrating experience. Our brains are just not wired to visualize something like linear‑gradient(in srgb, 37deg, #8dea81 0%, #92d3d2 100%) This is even more true with the support for different interpolation color spaces which can have a big impact on how a gradient looks on screen.

## Animations

N owhere in CSS is this concept more clear than when working with timing functions for transitions and keyframe animations.

Our brains just aren't wired to translate coordinates into a bezier curve, let alone allow us to visualize the resulting movement pattern. For tasks like this, a visual editor like the one below is all but required.

We recently wrote about the many [opportunities for the new linear() interpolation function](https://blog.nordcraft.com/approximating-reality-with-css-linear) that among other things lets you approximate real physics. Try creating a "spring" and "bounce" function below.

The tool below is the exact same we use in Nordcraft. It lets you create different timing functions for your animations and transitions.

CSS keyframe animations suffer from the same issue. Simple "from" and "to" animations are easy to write, but as soon as you start adding custom keyframes it quickly gets more complicated and fine-tuning keyframe positions can get very tiresome.

A keyframe animation editor like the one we built into Nordcraft, removes the friction when creating more complex animations.

![[88e94769626050c17c5f610eb0ea566d_MD5.jpg]]

[Click here to view the example in Nordcraft](https://editor.nordcraft.com/projects/css_is_too_powerful/branches/main/components/HomePage?canvas-width=800&canvas-height=800&mode=design&selection=nodes.YyvTkXvE7eSxeLwdChxJ1.style.animation.0&rightpanel=style)

## Keeping up with the CSS working group

It used to be case that the biggest barrier to adoption for new CSS features was cross browser support, but in recent years that is no longer the case. Though features like offset-path have been supported in all major browsers since 2022 but in the recent State of CSS survey from 2025, only 30% of respondents were even aware that it existed.

As the spec expands it becomes harder and harder to remember how each feature works. We are generally seeing quite slow adoption on many new CSS features simply because developers are having a hard time keeping up.

Visual Editors and IDEs are a great way for web developers to discover new features, especially when paired with built-in documentation.

![[aa89f242e13d22bfdc6227f58363dcb7_MD5.jpg]]

## Encouraging play

Visual editors are not just about making CSS easier to use.

The thing each of the examples so far has had in common is that they are styles that usually requires some adjustment before you get them just right. Creating the perfect gradient that looks great and still has a good contrast to your text color is more art than science. You need to get in there and play with the color tones and stops.

The same is true for your animations and transitions. You can tell right away if someone has taken the time to get the details right. For your animations and transitions to have the right "weight", you need to tune the keyframes, durations, and timing functions.

Visual tools like the ones we have shown above naturally encourage you to play with the different values and see their effect. I have always believed that play is the best way to master a new tool.

<video src="//videos.ctfassets.net/lizv2opdd3ay/1C0HLen7NhYpkCw0E5kqxT/787a4f3d7001a277bf861086790a3307/CleanShot_2025-11-19_at_10.39.01.mp4" controls="true"></video>

## More to come

We are getting more and more advanced CSS features. The new shape() and path() functions are incredibly powerful features, but writing something like the example below, by hand, can be tedious.

![[929a5c9d2904a4b28060cf59ddc411a2_MD5.jpg]]

clip‑path: shape(from 87% 0.5%, hline to 1%, curve to 16% 52% with 1% 1% / 17% 17%, curve to 1% 100% with 16% 87% / 1% 100%, hline to 87%, curve to 100% 52% with 87% 100% / 100% 89%, curve to 87% 1% with 100% 15% / 87% 1%, close);

So many of the new amazing features like, mask-image, offset-path and conic-gradients are likely going to be underused simply because of the complexity and friction of writing the css for these properties.

## A new generation of tools

CSS becoming more powerful and has in many cases outgrown the text editor is of course a good thing and worth celebrating. Most web developers are already relying on visual editors for creating gradients, paths, and timing functions for animations and transitions but visual editors can do so much more.

Visual editors open up a whole new way of designing with CSS and we have only started scratching the surface of what is possible.

Using visual editors for writing CSS is not only a great way to specify colors, gradients and animations. They are also a great way for developers to discover new CSS features. When new features are paired with an intuitive interface it becomes much easier to adopt these features as part of your developer toolbox.

At [Nordcraft](https://nordcraft.com/) we are excited to be at the frontier of this new approach to writing CSS and we have so much more in the works. We can't wait to show you.
