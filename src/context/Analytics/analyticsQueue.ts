import { useCallback, useEffect, useState } from "react";

import {
  AnalyticsService,
  IdentifyFn,
} from "../../browser-lib/avo/getAnalyticsSDKBridge";

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
      args: [string];
    };
type Queue = QueuedEvent[];
export const useQueuedService = (
  service: AnalyticsService
): AnalyticsService => {
  const { enabled } = service;
  const [queue, setQueue] = useState<Queue>([]);

  const sendQueuedEvents = useCallback(() => {
    while (queue.length) {
      const nextItem = queue.shift();
      if (nextItem) {
        sendEvent(nextItem);
      }
    }
  }, [sendEvent]);

  useEffect(() => {
    if (enabled) {
      sendQueuedEvents();
    }
  }, [enabled, sendQueuedEvents]);

  const clearQueue = () => {
    setQueue([]);
  };
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
