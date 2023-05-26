# opentok-react

Leveraging the Opentok library using React. Proof of concept intended to demonstrate call stability.

Please note that this App example was scaffolded using Vite.

## POC Intention

We want to make sure we can hold a Therapist-to-Member call on the web that is supported by the Opentok library only.

The Opentok documentation showing a simple code supporting a two-way call can be accesed here: [https://tokbox.com/developer/tutorials/web/basic-video-chat/](https://tokbox.com/developer/tutorials/web/basic-video-chat/)

## Installation steps

Run the following scripts to run locally:

- yarn
- yarn dev

Once the local server is up and running, we can access the App at [http://localhost:5173/opentok-react/](http://localhost:5173/opentok-react/) from there, we are presented with two links: one for the Member experience, and another for the Therapist.

## Making sense out of the code

There are two important concepts behind the code: The Lobby and the Call itself.

The Member experience is separated from the Therapist one, that's the reason why there exists a component for each.

While they are practically the same, this highlights the intention of having two separate entities that might or might not present different features.

This also means that we are expecting to have two browser windows opened to simulate a two-way call: one for the therapist and one for the memmber.

The Lobby is represented by the [GetMediaLobby](src/lib/GetMediaLobby.tsx) component.

The [Therapist](src/lib/Therapist.tsx) and the [Member](src/lib/Member.tsx) components both act as Wrappers of [Call](src/lib/Call.tsx) which is the actual component handling the Call feed.

## GetMediaLobby

This component's two main objectives are:

- Show who's connected to the call (supporting by polling information from an API `get-members` endpoint)
- Allow the user to select the devices supporting the video and microphone inputs and the speaker output. If any if the devices is not selected, then the user is not allowed to progress to the Call.

## Call component

This is the heart of the POC. Here we are dealing with three entities required to execute a successful call: The `Session`, the `Publisher` and the `Subscriber`.

Simply put:

- The Session initiates a Call using an `apiKey`, a `token` and a `sessionId`. The Session keeps tabs on both the Publisher and Subscriber all the time, so it knows what happens with them all the time. It is also the one allowing them to be part of a session.
- The Publisher is our own live video and audio **stream** feed. We start publishing the second we start a call.
- The Subscriber is someone else's **stream**. When some else starts streaming, the session knows about it and we show that feed onscreen.

Both the Publisher and the Subscriber need a DOM element to exist, that's why we can see them onscreen.

`More information regarding these entities can be found at the OpenTok (Vonage) official documentation.`

```
Also, the very first thing this component does is to use the `add-member` endpoint to let the server know that either my therapist or member is connected to the call.
```

## Challenges

There are listing the pending challenges that need to be solved moving forward:

- Coverage for the main browsers (Chrome, Firefox, Edge and Safari) needs to be confirmed. We know of an existing issue whereby the `enumerateDevices` api allowing us to list the exisitng devices doesn't return any audio output devices (speakers) in Firefox. The browser coverage for this api can be seen here: [https://caniuse.com/?search=enumerateDevices](https://caniuse.com/?search=enumerateDevices).

- When accessing the Lobby for the first time we are not presented with the Browser's Permissio asking us to allow access to our Camera and Microphone. This can be solved by showing the Publisher (out own feed) as part of the Lobby component as required by the Figma design specification [here](https://www.figma.com/file/iQoErKolVASOq4gEfV37z0/Call-stability?type=design&node-id=411-12994&t=vnE7kgDgXRW9Nb2z-4).

- While the end-to-end call works, connectivity issues haven't been accounted for in this POC, and therefore they are encouraged to be tested and catered for in here before testing them in the HelloSelf platform.

- While we are including the `screenshare` as part of this POC using the `web-components` library, we haven't been able to clean/destroy the stream related to it and thus we could be dealing with memory leak. However, this is working and can be included as part of the requirements for P0.

- Event logging needs to be accounted for. A list of the events that we are already logging in the backend for the Member and Expert platforms should be compared against the events we are logging (to the console) already. The full list of events for each of the entities can be found at the utils [here](src/lib/utils.ts).

# GitHub pages

This POC app can be accessed via GitHub pages at [https://israel-hs.github.io/opentok-react/](https://israel-hs.github.io/opentok-react/).

In order to publish any new development, just run the deploy script by executing `yarn deploy`. This will use local changes to update the artifacts in the GitHub page configuration related to this codebase.

## Troubleshooting

As this project is hardcoding the `token` and `sessionId` required to connect to a sesssion, and as these entities can exipre, we need to manually update them at our codebase. The `apikey`, along with the `token` and `sessionId` can be copy-pasted from a OpenTok example here: [https://tokbox.com/developer/quickstart/](https://tokbox.com/developer/quickstart/) (see _Step 1 of 5: Authentication_ section to copy the info).
