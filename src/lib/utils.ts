export function handleError(error?: OT.OTError) {
  if (error) {
    alert(error.message);
  }
}

export function createPublisherListernerMap() {
  const eventsToListenTo = [
    "accessAllowed",
    "accessDenied",
    "accessDialogClosed",
    "accessDialogOpened",
    // "audioLevelUpdated", this is triggered all the time
    "destroyed",
    // "disconnected", this event doesn't exist for the Publisher
    "mediaStopped",
    "muteForced",
    "streamCreated",
    "streamDestroyed",
    "videoDimensionsChanged",
    "videoElementCreated",
  ];
  return createMapFor(eventsToListenTo, "publisher");
}

export function createSubscriberListenerMap() {
  const eventsToListenTo = [
    // "audioLevelUpdated", this is triggered all the time
    "connected",
    "captionReceived",
    "destroyed",
    "disconnected",
    "encryptionSecretMismatch",
    "encryptionSecretMatch",
    "videoDisabled",
    "videoDimensionsChanged",
    "videoDisabled",
    "videoDisableWarning",
    "videoDisableWarningLifted",
    "videoElementCreated",
    "videoEnabled",
  ];
  return createMapFor(eventsToListenTo, "subscriber");
}

export function createSessionListenersMap() {
  const eventsToListenTo = [
    "archiveStarted",
    "archiveStopped",
    "connectionCreated",
    "connectionDestroyed",
    "sessionDisconnected",
    "sessionConnected",
    "sessionReconnected",
    "sessionReconnecting",
    "signal",
    "streamCreated",
    "streamDestroyed",
    "streamPropertyChanged",
    "muteForced",
  ];

  return createMapFor(eventsToListenTo, "session");
}

function createMapFor(
  events: string[],
  origin: "session" | "publisher" | "subscriber"
): Record<string, () => void> {
  return events.reduce(
    (result, currentEvent) => ({
      ...result,
      [currentEvent]: () =>
        console.log(`triggered from ${origin}: ${currentEvent}`),
    }),
    {}
  );
}

export const callProperties: OT.SubscriberProperties = {
  insertMode: "append",
  width: "100%",
  height: "100%",
};

export const publisherProperties: OT.PublisherProperties = {
  audioSource: null,
  videoSource: null,
  insertMode: "append",
  width: "100%",
  height: "100%",
  showControls: true,
  // publishAudio: true,
  // publishVideo: true,
  // resolution: "1280x720",
  // frameRate: 30,
  // name: "publisher",
  // style: {
  //   nameDisplayMode: "off",
  // },
};
