---
title: Build AI-Powered App
author: Angular
date-created: 2025-03-30
date-modified: 2025-05-13
publishedAt: 2025-03-18T03:15:07.735Z
url: https://blog.angular.dev/build-ai-powered-apps-with-genkit-and-angular-707db8918c3a?source=rss----447683c3d9a3---4
---

## Build AI-Powered Apps With Genkit and Angular

![[_resources/Build AI-Powered App/effa93dfeb7fead06e0b6e223ad9814d_MD5.jpg]]

There has never been a better time to start building with AI and the state-of-the-art models available to developers everywhere. Building with AI is for everyone, especially web developers. The Firebase team at Google has just [launched the 1.0 version of Genkit for Node.js](https://firebase.blog/posts/2025/02/announcing-genkit/) which means that it is ready for production and ready to help you build the next generation of AI powered applications.

### **What is Genkit?**

[Genkit is a framework](https://github.com/firebase/genkit) designed to help you build AI-powered applications and features. It provides open source libraries for Node.js and Go as well as developer tools for testing and debugging. Genkit is designed as a server-side solution.

With that in mind, how can Angular developers leverage Genkit? Let'sl explore some of the architectural options available to you.

### **Connecting to Genkit in Angular**

Because Genkit APIs are designed to be used on the server, it's recommended to use a Node or Go based backend. For a Node-based backend, the most straightforward involves installing the necessary dependencies (genkit and @genkit-ai/googleai), selecting a model and sending a prompt. Here's an example:

```bash
import { genkit } from 'genkit';
import { googleAI, gemini20Flash } from '@genkit-ai/googleai';
const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash, // Set default model
});

// Simple generation
const { text } = await ai.generate('Why is AI awesome?');
console.log(text);
```

In an Angular app with SSR enabled, a Node backend is generated for you. You can add the connection code in the server.tsfile and create endpoints to communicate with the frontend of the Angular application.

```bash
/* server.ts */
//… other required imports
import { genkit } from 'genkit';
import { googleAI, gemini20Flash } from '@genkit-ai/googleai';

/* … */
const app = express();
const commonEngine = new CommonEngine();

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash, // Set default model
});

// Create an API return the output of the prompt to the client
app.get('/api/ai', (req, res, next) => {
  // Simple generation
  ai.generate('Why is AI awesome?')
    .then(({text}) => res.json(text))
    .catch(next);
});

/* … */
export default app;
```

Now a request to /api/ai returns a response from the [Gemini 2.0 Flash model](https://deepmind.google/technologies/gemini/flash/). Because Genkit supports a growing ecosystem of model providers this example can be updated to a different model. You can use Gemini through Google AI or Vertex AI, in addition to third-party providers like OpenAI, Anthropic, and more.

The above example provides a good starting point, but we can expand on it and leverage even more features of Genkit. We can update the example to stream the response from the model [with the streamFlow API](https://firebase.google.com/docs/genkit/flows).

```bash
/* Within the SampleComponent class, you can leverage the streamFlow API */
…

import { streamFlow } from 'genkit/beta/client';
const url = 'http://127.0.0.1:3400/streamCharacters';

@Component({ … })
export class SampleComponent {
  …
  
  async callFlow() {
    try {
      const response = streamFlow({url, input: parseInt(this.count()),});
      for await (const chunk of response.stream) {
        this.characters.set(chunk);
      }
      this.loading.set(false);
    } catch (e) {
      /* … handle the error */
    }
  }
}
```

Streaming the response helps create the well-known "AI typing" style experience when interacting with the underlying models.

On the server side, the implementation uses a structured response with a [zod schema](https://zod.dev/) and the [defineFlow](https://firebase.google.com/docs/genkit/flows) API to create a flow that can be exposed from the server side and accessed from the client via HTTP. Here's an example of defining a flow that creates a stream of different RPG game characters:

```bash
export const streamCharacters = ai.defineFlow({
    name: 'streamCharacters',
    inputSchema: z.number(),
    outputSchema: z.string(),
    streamSchema: GameCharactersSchema,
  },
  async (count, { sendChunk }) => {
    const { response, stream } = await ai.generateStream({
    model: gemini20Flash,
    output: {
      format: 'json',
      schema: GameCharactersSchema,
    },
    config: {
      temperature: 1,
    },
    prompt: `Respond as JSON only. Generate ${count} different RPG game characters.`,
  });

  let buffer = '';
  for await (const chunk of stream) {
    buffer += chunk.content[0].text!;
    if (buffer.length > 10) {
      sendChunk(parse(maybeStripMarkdown(buffer), Allow.ALL));
    }
  }
  return (await response).text;
});
```

Check out the full example in [the streaming-json example in the Firebase repo](https://github.com/firebase/genkit/tree/main/samples/js-angular/genkit-app/src/app/samples/streaming-json) to see this code in greater detail and even try it yourself.

## Testing and Debugging your AI Workflows and data

One of the challenges of development with LLMs is the seemingly opaque nature of their interactions and missing observability piece. Genkit provides additional developer tooling to give you insights into what's happening during your interactions with the model. Along with the Genkit CLI, there's also the [Genkit Developer UI](https://firebase.google.com/docs/genkit/devtools). The Genkit Developer UI is a local web app that lets you run, debug, and test flows, prompts and other elements.

Here's the Developer UI in action:

\<a href="[https://medium.com/media/7bfd5c6e712815a8260d66738d0b11c8/href">https://medium.com/media/7bfd5c6e712815a8260d66738d0b11c8/href\</a>](https://medium.com/media/7bfd5c6e712815a8260d66738d0b11c8/href">https://medium.com/media/7bfd5c6e712815a8260d66738d0b11c8/href</a>)

There are more developer tools available, [to learn more check out the documentation](https://firebase.google.com/docs/genkit/devtools).

## Start building today

This post only covers a basic interaction with Genkit, there's much more available to you through the robust API including:

* Multi-turn conversations with context management
* Tool use where the AI can call functions in your application
* Human-in-the-loop workflows where AI and users collaborate
* Context-aware generation that leverages your application's data

Genkit significantly simplifies AI model interaction and integration so you can focus on building incredible user experiences.

With all of the great features recently released in Angular and the production-ready release of Genkit developers have the tools needed to build the next great ai-powered web applications today. The possibilities are vast and we can't wait to see all the great things you'll build.

Be sure to check out [angular.dev](https://angular.dev/) and [firebase.google.com/docs/genkit](http://firebase.google.com/docs/genkit) for the latest, up-to-date news and features.

![](https://medium.com/_/stat?event=post.clientViewed\&referrerSource=full_rss\&postId=707db8918c3a)

***

[Build AI-Powered Apps With Genkit and Angular](https://blog.angular.dev/build-ai-powered-apps-with-genkit-and-angular-707db8918c3a) was originally published in [Angular Blog](https://blog.angular.dev) on Medium, where people are continuing the conversation by highlighting and responding to this story.
