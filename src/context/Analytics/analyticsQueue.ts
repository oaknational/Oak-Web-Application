import { useCallback, useEffect, useState } from "react";

import useStableCallback from "../../hooks/useStableCallback";

import { AnalyticsService, IdentifyFn } from "./AnalyticsProvider";

type QueuedEvent =
  | {
      type: "track";
      args: [string, unknown];
    }
  | {
      type: "page";
      args: [string, unknown];
    }
  | {
      type: "identify";
      args: [string, unknown];
    };
type Queue = QueuedEvent[];
export const useQueuedService = (
  service: AnalyticsService
): AnalyticsService => {
  const sendEvent = (event: QueuedEvent) => {
    switch (event.type) {
      case "track":
        return service.track(...event.args);

      case "page":
        return service.page(...event.args);

      case "identify":
        return service.identify(...event.args);

      default: {
        // Ensure all event types are accounted for
        const _unreachable: never = event;
        return _unreachable;
      }
    }
  };

  const { enabled } = service;
  const [queue, setQueue] = useState<Queue>([]);

  const sendQueuedEvents = useStableCallback(() => {
    while (queue.length) {
      const [nextItem, ...otherItems] = queue;
      if (nextItem) {
        sendEvent(nextItem);
      }
      setQueue(otherItems);
    }
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
  const identify: IdentifyFn = (userId: string) => {
    if (service.enabled) {
      sendQueuedEvents();
      return service.identify(userId);
    } else {
      queueEvent;
    }
  };

  return {
    ...service,
    identify,
  };
};
