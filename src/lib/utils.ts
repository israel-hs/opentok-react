export function createPublisherListernerMap() {
  const eventsToListenTo = [
    "accessAllowed",
    "accessDenied",
    "accessDialogClosed",
    "accessDialogOpened",
    // "audioLevelUpdated", this is triggered all the time
    "destroyed",
    "mediaStopped",
    "streamCreated",
    "streamDestroyed",
    "videoDimensionsChanged",
    "videoElementCreated",
    "muteForced",
  ];
  return createMapFor(eventsToListenTo, "publisher");
}

export function createSubscriberListenerMap() {
  const eventsToListenTo = [
    // "audioLevelUpdated", this is triggered all the time
    "connected",
    "captionReceived",
    "destroyed",
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
    "sessionDisconnected:",
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
