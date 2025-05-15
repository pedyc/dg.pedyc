---
uid: 
title: Meet Angular v19
aliases: []
author: Minko Gechev
description: 
tags: []
date-created: 2025-01-03
date-modified: 2025-05-12
status: 
publishedAt: 2024-11-19T16:58:05.350Z
url: https://blog.angular.dev/meet-angular-v19-7b29dfd05b84?source=rss----447683c3d9a3---4
---

## Meet Angular v19

In the past two years we doubled down on our investment in developer experience and performance — in every single release we've been consistently shipping improvements that multiply their impact when combined together. Seeing the positive community response and increased engagement in our developer events is validating that we've been moving in the right direction. Today's release is bringing a series of improvements that will make it even easier for you to deliver fast web apps with confidence.

A few highlights:

* Developer preview of incremental hydration supporting the most performance demanding use cases
* Control which routes render on the client, server, or during a build and resolve route parameters during prerendering
* Schematics to keep you up to date with the latest best practices — inputs, outputs, queries, inject-based dependency injection, and new build system
* Stabilization of core reactivity primitives and introduction of new ones: linkedSignal and resource
* Series of quality of life improvements addressing feature requests with more than 2,700 👍 on GitHub! This includes time picker component, unused import removal, running schematics via the language service, HMR for styles, and more!

![Banner with the Angular logo saying “v19 is now available”](https://cdn-images-1.medium.com/max/1024/1*IKZuN_kzUYPl37lBXQkymQ.png)

You can watch a quick overview of the release from our special event video. For a more holistic list of the features and improvements in v19, continue reading below.

\<a href="[https://medium.com/media/b695ed67198fffcd4cfd89de2ccb5b90/href">https://medium.com/media/b695ed67198fffcd4cfd89de2ccb5b90/href\</a>](https://medium.com/media/b695ed67198fffcd4cfd89de2ccb5b90/href">https://medium.com/media/b695ed67198fffcd4cfd89de2ccb5b90/href</a>)

### Build for speed

Evolving Angular we see the opportunity to enable best performance practices out of the box, so that we can support your performance-sensitive use cases. In the past two years we kicked off a project to enable zoneless Angular, made server-side rendering an integral part of the Angular CLI, and worked closely with [Chrome Aurora](https://web.dev/aurora) on hydration and the [image directive](https://angular.dev/guide/image-optimization).

In version 19, we're elevating Angular server-side rendering to another level with incremental hydration, server route configuration, event replay enabled by default, and more.

Building large web apps increases the amount of JavaScript we ship to the user, which negatively impacts user experience. In v17 we made it trivial to lazily load code with [deferrable views](https://angular.dev/guide/defer) for client-side rendered apps. For server-side rendered applications we introduced full-app hydration which requires all the JavaScript associated with a given page to make it interactive. Today, we're delivering a solution to the server that is inspired by deferrable views!

#### Welcome incremental hydration in developer preview

Incremental hydration allows you to annotate parts of your template, using already familiar @defer syntax, instructing Angular to load and hydrate them on specific triggers, lazily.

![A demo showing incremental hydration. On the gif there’s an ecommerce website which is server-side rendered. At first everything is grayed out because the app is rendered, but none of the scripts associated with the UI are loaded. When the user engages with the side nav, Angular hydrates this content and changes the color. When the user engages with the items on the page, Angular hydrates the content and removes the grayed out styles.](https://cdn-images-1.medium.com/max/1024/0*cSNZMJjQtq2-O9v8)Incremental hydration demo

The demo above shows incremental hydration in action for a server-side rendered page. There are three visual effects that we've added to the demo app code to better illustrate what's going on:

* A component in grayscale filter shows that Angular hasn't loaded and hydrated it yet
* Angular downloads a component from the network when the component starts pulsing
* Angular has downloaded and hydrated the component when there's a purple border around it and the component no longer has a grayscale filter

Additionally, the demo app has an artificial delay of 500ms for each loading operation, so that we can easily explore different states.

Notice that at the beginning everything besides the top bar is grayed out. This means that at this point we have not downloaded any of the JavaScript associated with the page. When the user engages with the filter component at the top left, Angular downloads it (visually indicated by pulsing), and after that hydrates it (demonstrated with the purple glow around the component).

Later on, we continue interacting with the page and incrementally hydrate the rest of the components.

Even without the artificial delay, Angular will download and hydrate the component asynchronously, which means that we have to replay the user event. For this functionality we're using the [event replay](https://blog.angular.dev/event-dispatch-in-angular-89d868d2351c) functionality we introduced in Angular version 18, which powers Google Search.

When you update to Angular v19, you can try the new incremental hydration in any application that already uses SSR and full application hydration. In your client bootstrap, specify:

```Javascript
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

// ...
provideClientHydration(withIncrementalHydration());
```

To apply incremental hydration to a portion of your template use:

```Javascript
@defer (hydrate on viewport) {
  <shopping-cart/>
}
```

When your app loads, Angular will not download and hydrate the shopping-cart component until it enters the viewport. You can read more about incremental hydration in the [documentation](https://angular.dev/guide/incremental-hydration).

We're grateful to everyone who shared their thoughts in the [incremental hydration RFC](https://github.com/angular/angular/discussions/57664) and to our beta testers. Thank you for helping us improve Angular!

#### Event replay is enabled by default

A common problem in server-side rendered apps in any framework is the gap that occurs between a user event and the browser downloading and executing the code responsible for handling the event. We already touched on this in the incremental hydration section.

Last May we shared the [event dispatch library](https://blog.angular.dev/event-dispatch-in-angular-89d868d2351c), which addresses this use case. Event dispatch captures events during initial page load and replays them when the code responsible for handling the events is available. Event dispatch is the same [library](https://github.com/angular/angular/tree/main/packages/core/primitives/event-dispatch) that the Wiz team developed for Google Search and it has been battle tested by billions of users over the past ten years.

You can enable event replay feature in Angular by configuring your hydration provider:

```Javascript
// For new projects the Angular CLI will generate this code by default
bootstrapApplication(App, {
  providers: [
    provideClientHydration(withEventReplay())
  ]
});
```

The result will be similar to the visualization on the gif below. When the browser renders the app for the first time it hasn't downloaded any JavaScript yet, which we visualize by using gray color for the UI. You can see that in the meantime the user clicks multiple times on the "Add to cart" button. In the background, event dispatch records all these events. When the JavaScript responsible for handling the click events loads, event dispatch replays the events which reflects in the number of items in the shopping cart:

![A gif showing the event replay functionality. The user clicks on the “Add to cart” 4 times, which triggers hydration. Once Angular hydrates the user interface the 4 event the framework replays the events which adds 4 items to the cart.](https://cdn-images-1.medium.com/max/1024/0*HiE5nOfpvdZitlT1)Demo of event relay

Over the past six months, we verified that this approach works really well with Angular. Today, we're graduating event replay to stable and enabling it by default for all new applications that use server-side rendering!

#### Route-level render mode

When you enable server-side rendering in your app, by default Angular will server-side render all the parametrized routes in your app and prerender all routes without parameters.

In v19, we provide a new interface called ServerRoute which allows you to configure whether the individual routes should be server-side rendered, prerendered, or rendered on the client side:

```Javascript
export const serverRouteConfig: ServerRoute[] = [
  { path: '/login', mode: RenderMode.Server },
  { path: '/dashboard', mode: RenderMode.Client },
  { path: '/**', mode: RenderMode.Prerender },
];
```

In the example above we specify that we want Angular to render the login route on the server, the dashboard route on the client, and to prerender all other routes. The server route config is a new configuration file, but it composes your existing route declarations with globs, so you don't have to duplicate any routes.

In the past, there was no ergonomic way to resolve route parameters at prerender time. With the server route configuration this is now seamless:

```Javascript
export const routeConfig: ServerRoute = [{
 path: '/product/:id',
 mode: 'prerender',
 async getPrerenderPaths() {
   const dataService = inject(ProductService);
   const ids = await dataService.getIds(); // ["1", "2", "3"]
   return ids.map(id => ({ id })); // `id` is used in place of `:id` in the route path.
  },
}];
```

Since Angular executes getPrerenderPaths in an injection context, you can use inject to reuse your business logic in the parameter resolution.

This feature is now in developer preview! You can read more about route-level render modes in our [documentation](https://angular.dev/guide/hybrid-rendering).

#### Server-side rendering with Zoneless Angular

In v18 we introduced experimental support for zoneless which allows Angular to function without having a dependency on zone.js. Historically, zone.js has been a critical component in Angular's server-side rendering story, notifying the serving stack when the framework has completed rendering and the markup of the page is ready.

We identified that the main reasons to wait for apps are pending requests and navigation. We introduced a primitive that we use in the Angular HttpClient and the Router to delay sending the page to the user until the app is ready. You can experiment with both of these packages and zoneless in v19 today!

In addition to this, we provide a RxJS operator which enables you to notify the serving stack that Angular is still not done rendering:

```Javascript
subscription
  .asObservable()
  .pipe(
    pendingUntilEvent(injector),
    catchError(() => EMPTY),
  )
  .subscribe();
```

When the subscription emits a new value, we'll make the app stable and the serving stack will pass the rendered markup to the client.

### Developer experience

We've been deeply focused on enabling you to build fast apps from the start. Just as important we see making sure you develop these apps efficiently. Today we have a few exciting improvements that we can't wait to share with you!

#### Instant edit/refresh with hot module replacement

Angular v19 supports hot module replacement (HMR) for styles out of the box and enables experimental support for template HMR behind a flag!

Prior to this improvement, every time you change the style or template of a component and save the file, Angular CLI would rebuild your app and send a notification to the browser which would refresh.

Our new HMR will compile the style or template you modified, send the result to the browser, and patch your app without a page refresh and any state loss. That way you'll have a faster turnaround cycle and uninterrupted flow state.

![A gif showing how we edit the styles of the h2 element in the app by setting its color to red and font-size to 2.3em. The change gets reflected in the app without a page refresh.](https://cdn-images-1.medium.com/max/1024/1*wP31sSXNNXImc_qh2cR4cg.gif)Style hot-module replacement in the Angular CLI

Hot module replacement for styles is enabled by default in v19! To try HMR for templates use:

```Javascript
NG_HMR_TEMPLATES=1 ng serve
```

To disable this feature specify "hmr": false as a development server option, or alternatively use:

```Javascript
ng serve --no-hmr
```

#### Standalone defaults to true

We introduced standalone components over two years ago in v14. In the last developer survey over 90% of developers said they are using this feature. As part of v19 we are providing a schematic that will run as part of ng update and will automatically remove the standalone component metadata property for all your standalone directives, components, and pipes and set standalone to false for all non-standalone abstractions.

For more information, check our update guide on [update.angular.dev](http://update.angular.dev). Thanks [Matthieu Riegler](https://twitter.com/jean__meche) for this contribution!

#### Strict standalone enforcement

To help you enforce modern APIs in your project, we developed a compiler flag that will throw an error if it discovers a component, directive, or a pipe that is not standalone. To enable it in your projects configure angular.json:

```Javascript
{
  "angularCompilerOptions": {
    "strictStandalone": true
  }
}
```

#### State of testing tooling

Since we introduced experimental [Jest](https://jestjs.io/) and [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) support in the Angular CLI, we continued evaluating the space and gathering feedback from developers.

In the unit testing space, we believe in real browser testing to ensure we have the same environment across testing and production. To support developers to move to the new esbuild-based builder, in v19 we are introducing developer preview support for Karma to use the application builder by setting the builderMode option. This improves build times for unit tests and allows users to more easily leverage application builder-specific features like file loaders without breaking tests.

With Karma being deprecated, in the first half of 2025 we'll continue evaluating the existing test runners to pick our default recommendation that we'll move forward with. Follow our [blog](https://blog.angular.dev) and [X](https://x.com/angular) for announcements and surveys.

#### Secure from the start

We collaborated with the security team at Google on a developer preview feature for automatic generation of a hash-based [Strict Content Security Policy](https://web.dev/articles/strict-csp#choose-hash) based on scripts in index.html.

Using hash-based CSP, the browser will add the hash of every inline script to the CSP. Each script will have a unique hash associated with it. That will prevent an attacker from running a malicious script on your page because for the browser to execute the script, its hash needs to be present in the CSP.

Currently, autoCSP is available in developer preview as an opt-in. To use it in your apps, configure the application builder by setting the autoCSP property to true under security within your project in angular.json.

### Evolving reactivity

A core theme for Angular over the past two years has been evolving our reactivity system. In version 19, we're excited to share a couple of new complimentary APIs and the stabilization of some of the fundamental reactivity APIs we introduced in previous versions, such as input, output, and view queries.

#### Stabilization of inputs, outputs, and view queries

Over the past year, we observed how developers are using the new input, output, and view query APIs and we're graduating them to stable! To simplify the adoption of these new APIs, we developed schematics that will transform your existing inputs, outputs, and view queries:

```Javascript
ng generate @angular/core:signal-input-migration
ng generate @angular/core:signal-queries-migration
ng generate @angular/core:output-migration
```

Note that signal inputs are read-only in contrast to traditional inputs, so you may need to migrate parts of your application manually if you're setting input values.

To run all these migrations at once, you can use the joint alias:

```Javascript
ng generate @angular/core:signals
```

You can read more about [inputs](https://angular.dev/guide/signals/inputs), [outputs](https://angular.dev/guide/components/output-fn), and [view queries](https://angular.dev/guide/signals/queries#view-queries) in our documentation.

#### Modernize your code via the language service

To make it frictionless for you to update your code to the latest APIs, we introduced an integration between schematics and Angular's language service.

![A gif showing how in VSCode a developer hovers an Angular input. The Angular language service shows a pop up asking if the developer wants to change it to a signal input. The developer selects that option and the language service updates the input to a signal-based, by also changing the template.](https://cdn-images-1.medium.com/max/988/0*5G7I_FY5T9JuDk22)Language service integration with schematics

When you update the Angular language service and your project to v19, you can directly update your inputs, queries, and more to the latest APIs directly from your code editor!

#### Introducing linked signals

In [developer feedback](https://github.com/angular/angular/issues/55673) as well as observing how applications in the wild use Angular signals, we saw an opportunity to better serve a common use case with a new primitive. Often in UIs, there's a need for mutable state that still tracks some higher level state. For example, a selection UI has a "current selection" state which changes as the user makes selections, but also needs to reset if the list of options changes. The new linkedSignal primitive creates a writable signal which captures this type of dependency:

```Javascript
const options = signal(['apple', 'banana', 'fig']);

// Choice defaults to the first option, but can be changed.
const choice = linkedSignal(() => options()[0]);
console.log(choice()); // apple

choice.set('fig');
console.log(choice()); // fig

// When options change, choice resets to the new default value.
options.set(['peach', 'kiwi']);
console.log(choice()); // peach
```

linkedSignal clearly expresses the relationship between options and choice without resorting to an effect usage. The new API has 2 forms: a simplified (presented here) and an advanced one where a developer has access to previous values of options and choice. It also has an advanced API which allows for more complex logic such as maintaining the user's choice as long as it exists in the new list of options.

This new API is experimental, so please [give it a try](https://angular.dev/guide/signals/linked-signal) and let us know what you think!

#### Introducing resource

So far, signals in Angular have focused on synchronous data: storing state in signals, computed values, inputs, queries, etc. In Angular v19, we're taking our first steps towards integrating signals with asynchronous operations by introducing a new experimental resource() API. A resource is an asynchronous dependency that participates in the signal graph. You can think of a resource as having three parts:

1\. A request function, which expresses the exact request to be made in terms of signals. For example, a user resource might compute a request that depends on a user ID parameter in the current route.

2\. A loader, which performs an asynchronous operation when the request changes, and ultimately returns a new value.

3\. The resulting Resource instance, which exposes signals that communicate both the value (when available) as well as the current status of the resource (loading, resolved, errored, etc).

```Javascript
@Component(...)
export class UserProfile {
  userId = input<number>();

  userService = inject(UserService);

  user = resource({
    request: user,
    loader: async ({request: id}) => await userService.getUser(id),
  });
}
```

We're offering resource() as an independent, [experimental API](https://angular.dev/guide/signals/resource) today in order to test the APIs and gain early feedback from developers. Over time, we expect to gradually incorporate support for resources more deeply into Angular (for example, into the router as a form of resolver) as a key part of the async story in applications.

Because many Angular applications today use RxJS for data fetching, we've also added rxResource to @angular/core/rxjs-interop which creates a resource from an Observable-based loader.

#### State of the effects API

For the past couple of versions we've been keeping effect in developer preview to observe how developers have been using them. Based on your feedback, prior to v19, we introduced a change in the timing of effect to better serve your use cases. You can read more about the change and our process evolving the API on [our blog](https://blog.angular.dev/latest-updates-to-effect-in-angular-f2d2648defcd).

As a core primitive in the new reactivity APIs, we'd want to take our time and make sure to get effect's semantics right. We'll keep this API in developer preview to open the door for changes if we discover use cases we haven't taken into consideration yet.

#### State of zoneless

Six months ago we introduced experimental zoneless support to Angular. Since then, we've been iterating over the APIs and enhancing them — adding support for server-side rendering and improving the testing experience. We also partnered with the [Google Fonts](https://fonts.google.com/) team to make their application zoneless and evaluate the developer experience. The results and the ease of the transition to zoneless exceeded our expectations, but there are still a few more polishing touches we want to put in place before moving this API to developer preview.

In 2025 we'll continue improving zoneless. In the meantime, [make sure you give it a try](https://angular.dev/guide/experimental/zoneless) in your app bootstrap and let us know what's your experience with it! The easiest way to create a zoneless project is using the Angular CLI:

```Javascript
ng new [project-name] --experimental-zoneless
```

Thanks to [Angelo Parziale](https://github.com/aparzi) for this community [contribution](https://github.com/angular/angular-cli/pull/28579)!

In existing applications you can use the experimental zoneless provider:

```Javascript
bootstrapApplication(App, {
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
});
```

Next, make sure you remove zone.js from the polyfills section of your angular.json.

### Advancing Angular Material and the CDK

Earlier this year we shipped Material 3 as stable, which makes our material components more customizable with a powerful Sass theming API powered by [design tokens](https://m3.material.io/foundations/design-tokens/overview). In v19 we're introducing enhancements to the theming API by making it easier to customize your components!

#### Enhanced theming API

With Material 3 we enabled you to [create custom themes](https://v18.material.angular.io/guide/theming#custom-theme) using component-specific mixins:

```Javascript
@use '@angular/material' as mat;

@include mat.core();

$light-theme: mat.define-theme((
    color: (
      primary: mat.$violet-palette,
      tertiary: mat.$orange-palette,
      theme-type: light
    ),
    typography: Roboto,
    density: 0
  ));

html {
  // Apply the light theme by default
  @include mat.core-theme($light-theme);
  @include mat.button-theme($light-theme);
  @include mat.card-theme($light-theme);
  // and 27 more...
  ...
}
```

With this highly customizable API, you often end up duplicating code for your individual components. To simplify the creation of custom themes, in v19 we enabled a more expressive API that allows you to declare a custom theme using a single mixin — mat.theme:

```Javascript
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$violet-palette,
      tertiary: mat.$orange-palette,
      theme-type: light
    ),
    typography: Roboto,
    density: 0
  ));
}
```

#### Component overrides

To customize the styles of individual components you can use the new override API we provide in Sass:

```Javascript
@include mat.sidenav-overrides(
  (
    'content-background-color': purple,
    'container-divider-color': orange,
  )
);
```

The snippet above will override the content background and content divider colors to purple and orange respectively, while preserving the original values for the remaining design tokens respecting your configured app theme.

#### Two-dimensional drag and drop

Making Angular CDK more powerful, we developed support for two-dimensional [drag & drop in the CDK](https://github.com/angular/components/issues/13372) which was quite a popular feature request with 311 👍 on GitHub.

Here's a quick snippet of how you can use this functionality of the CDK:

```Javascript
<div
  cdkDropList
  cdkDropListOrientation="mixed" <!-- specify mixed orientation -->
  ...>
  @for (item of mixedTodo; track item) {
    <div cdkDrag>
      {{item}}
      <mat-icon cdkDragHandle svgIcon="dnd-move"></mat-icon>
    </div>
  }
</div>
```

And the result will be something like:

![A gif showing the user drag items in a collection of items. There are two rows of boxes and the user moves boxes across the two rows.](https://cdn-images-1.medium.com/max/1024/0*xnaH7rnKjUIiSDi8)Demo of drag & drop with mixed orientation

Find out more in the [documentation](https://material.angular.io/cdk/drag-drop/overview).

#### Support tab reordering

Another feature request we shipped recently is [support for tab reordering](https://github.com/angular/components/issues/13572) with the Angular CDK (24 👍). Using this functionality you can easily make tabs draggable, which the Google Cloud Console team immediately landed in [BigQuery](https://cloud.google.com/bigquery) via Angular and the CDK:

![A gif showing the UI of the query editor in BigQuery. The user moves tabs around.](https://cdn-images-1.medium.com/max/1024/0*6ZqwBzEQT7nCd8m1)BigQuery draggable tabs

#### New time picker component

One of the most popular feature requests, with more than 1.3k 👍 on GitHub, has been a time picker component for Angular Material. We didn't immediately implement it because there was no strict spec for it, but given the demand we created a design which aligns with your requirements and accessibility standards and shipped it in v19!

![A UI showing the user changing the time selection in a time picker component.](https://cdn-images-1.medium.com/max/1024/0*D38KOwxVIOhb8z8g)Basic use of the time picker component

You can use it in your Angular apps today! Find more in the [documentation](https://material.angular.io/components/timepicker/overview).

### And there's more

Together with the major improvements we shipped across our main themes: performance, reactivity, developer experience, and standalone, we also have a slew of quality of life improvements that make it even more enjoyable to build Angular apps!

#### Reporting unused imports in standalone components

[Reporting unused imports](https://github.com/angular/angular/issues/46766) in standalone components has been one of the most requested features with over 150 👍!

Starting in v19, Angular CLI will report a warning for your unused imports, similar to the gif below:

![](https://cdn-images-1.medium.com/max/888/0*-sFjEXZ1m6h59zZr)

Additionally, the Angular language service will highlight such unused imports and provide the functionality to auto remove them directly in your IDE or text editor.

To suppress this check, you can update your angular.json:

```Javascript
{
  "angularCompilerOptions": {
    "extendedDiagnostics": {
      "checks": {
        "unusedStandaloneImports": "suppress"
      }
    }
  }
}
```

#### Command-line environment variable declaration

The most highly requested feature in the Angular CLI repository with over 350 👍 is enabling the ability to [pass environment variables during build time](https://github.com/angular/angular-cli/issues/4318).

Starting v19, you can use the --define flag to achieve this:

```Javascript
ng build --define "apiKey='$API_KEY'"
```

```Javascript
declare global {
  var apiKey: string;
}

await fetch(`/api/data?apiKey=${globalThis.apiKey}`);
```

#### Local variables in templates

Over the years we got hundreds of feature requests to introduce syntax for [local variable declaration](https://github.com/angular/angular/issues/15280) (443 👍) in the templates. For many years, unfortunately, we didn't have the optimal syntactical construct to do that.

With the new block syntax for the built-in control flow and deferrable views we designed a solution which meets developers needs for local template variable declaration. We shipped this feature in developer preview as part of Angular v18.1. After observing how developers are using this new syntax, we're now graduating it to stable!

It works elegantly with template references and with the async pipe:

```Javascript
<!-- Use with a template variable referencing an element -->
<input #name>

@let greeting = 'Hello ' + name.value;

<!-- Use with an async pipe -->
@let user = user$ | async;
```

### Evolving apps with unfolding best practices

It's one of our core values to evolve your apps together with Angular and the Web platform. To ensure your apps are using latest APIs and best practices, we shipped multiple improvements:

* Flipping the default value of standalone to true, which simplifies the metadata of all your standalone components, directives and pipes. It's a migration that the CLI will automatically run when you update your project
* Optional schematic to transform your constructor-based dependency injection to inject function calls by running ng generate @angular/core:inject-migration
* Optional schematic that moves your eagerly loaded routes to lazy routes. Thanks to [Enea Jahollari](https://x.com/Enea_Jahollari) for this community [contribution](https://github.com/angular/angular/pull/56428)!
* Optional schematic to transform your decorator-based inputs, queries, and outputs to the latest APIs: ng generate @angular/core:signal-input-migration, ng generate @angular/core:signal-queries-migration, ng generate @angular/core:output-migration
* Support new clustering API in @angular/googe-maps! You can find the original feature request [on GitHub](https://github.com/angular/components/issues/23695) (26 👍).
* [Removed](https://blog.angular.dev/the-state-of-end-to-end-testing-with-angular-d175f751cb9c) the Protractor builder to enable a path forward with [supported e2e testing tools](https://angular.dev/tools/cli/end-to-end)
* And an opt-in migration that will move your project to the application builder that uses esbuild and vite

### Big thanks to the Angular community

We, as developers, are building a product specifically for other developers like you. We wouldn't be here without the incredible support and contributions of the Angular community. Each of you plays a vital role in shaping Angular's future.

Your feedback, open-source packages, and active participation in meetups and conferences help us make Angular better every day. The knowledge you share on platforms like StackOverflow, Discord, Reddit, Telegram and others empowers developers worldwide.

We invite you to join this vibrant community, online or locally. This year alone, ten Angular conferences were held across the globe, from [Belgium](https://ng-be.org/), [Germany](https://ng-de.org/), [India](https://www.ng-ind.com/), [Israel](https://angular-tlv.com/), [Italy](https://ngrome.io/), [Kenya](https://ng-kenya.com/home), [Macedonia](https://www.angularmacedonia.org/), [Poland](https://ng-poland.pl/), [Serbia](https://angularbelgrade.org/), [USA](https://ng-conf.org/). These events are fantastic opportunities to connect with fellow developers, learn about the latest advancements, and share your expertise.

![Angular logo surrounded by the flags of Germany, Serbia, Israel, India, Poland, Belgium, Italy, Macedonia, USA, Kenya symbolizing the community Angular conferences in 2024.](https://cdn-images-1.medium.com/max/1024/0*XG7aUr-ZD283mY6a)

If you've organized an Angular conference that's not on our list, please let us know at <devrel@angular.io> so we can spread the word.

We'd also like to thank all the 247 contributors between our last two major releases who helped us shape v19.

Let's continue to learn, grow, and build amazing things with Angular!

### Onward to 2025

Over the past year we worked hard on all the features we shipped as part of this release. We also connected with hundreds of developers to collect your feedback and understand how we can best support you in 2025. We're in the process of going through our notes and the results of our developer satisfaction survey to validate our assumptions.

A couple of core themes that keep occurring again and again are around modernizing Angular's authoring experience and rethinking our unit testing recommendations. We're planning to do a thorough research in this space early next year and share our findings with you to collect feedback before making any decisions. In the meantime, we'll continue putting polishing touches on our reactivity APIs, bringing incremental DX improvements across the board and evolving Angular's performance to enable you to build web apps with confidence!

Thank you for helping us shape Angular and onward to 2025! 🚀

![](https://medium.com/_/stat?event=post.clientViewed\&referrerSource=full_rss\&postId=7b29dfd05b84)

***

[Meet Angular v19](https://blog.angular.dev/meet-angular-v19-7b29dfd05b84) was originally published in [Angular Blog](https://blog.angular.dev) on Medium, where people are continuing the conversation by highlighting and responding to this story.
