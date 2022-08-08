import { useCallback, useEffect, useState } from "react";

import useStableCallback from "../../hooks/useStableCallback";

import {
  AnalyticsService,
  EventName,
  EventProperties,
  IdentifyFn,
  IdentifyProperties,
  UserId,
} from "./AnalyticsProvider";

type QueuedEvent =
  | {
      type: "track";
      args: [EventName, EventProperties];
    }
  | {
      type: "page";
    }
  | {
      type: "identify";
      args: [UserId, IdentifyProperties];
    };
type Queue = QueuedEvent[];
export const useQueuedService = (
  service: AnalyticsService<unknown>
): AnalyticsService<unknown> => {
  const sendEvent = (event: QueuedEvent) => {
    switch (event.type) {
      case "track":
        return service.track(...event.args);

      case "page":
        return service.page();

      case "identify":
        return service.identify(...event.args);

      default: {
        // Ensure all event types are accounted for
        const _unreachable: never = event;
        return _unreachable;
      }
    }
  };

  const {
    enabled,
    // loaded
  } = service;
  const [queue, setQueue] = useState<Queue>([]);
  // const [isLoaded, setIsLoaded] = useState(loaded());
  // const [time, setTime] = useState(Date.now())

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setIsLoaded(loaded());
  //   }, 1000);

  //   return clearTimeout(timeoutId);
  // });

  const processQueue = (_queue: Queue) => {
    while (_queue.length) {
      const [nextItem, ...otherItems] = queue;
      if (nextItem) {
        sendEvent(nextItem);
      }
      setQueue(otherItems);
    }
  };

  const sendQueuedEvents = useStableCallback(() => {
    processQueue(queue);
    clearQueue();
  });

  useEffect(() => {
    if (enabled) {
      sendQueuedEvents();
    }
  }, [enabled, sendQueuedEvents]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const queueEvent = (event: QueuedEvent) => {
    queue.push(event);
  };
  const identify: IdentifyFn = (userId, properties) => {
    if (service.enabled) {
      sendQueuedEvents();
      return service.identify(userId, properties);
    } else {
      queueEvent;
    }
  };

  return {
    ...service,
    identify,
  };
};
