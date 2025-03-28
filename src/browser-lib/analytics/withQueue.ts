"use client";

import {
  AnalyticsService,
  EventFn,
  EventName,
  EventProperties,
  IdentifyFn,
  IdentifyProperties,
  PageFn,
  PageProperties,
} from "../../context/Analytics/AnalyticsProvider";
import isBrowser from "../../utils/isBrowser";

type QueueItem =
  | {
      type: "identify";
      userId: string;
      props: IdentifyProperties;
    }
  | {
      type: "track";
      eventName: EventName;
      props: EventProperties;
    }
  | {
      type: "page";
      props: PageProperties;
    };
type Queue = QueueItem[];

const withQueue = <T>(
  service: AnalyticsService<T>,
  intervalMs = 3000,
): AnalyticsService<T> & { queue: Queue } => {
  let intervalId: number;
  const queue: Queue = [];

  const queueEvent = (item: QueueItem) => {
    queue.push(item);
  };

  const clearQueue = () => {
    queue.length = 0;
  };

  const track: EventFn = (eventName, props) => {
    queueEvent({ type: "track", eventName, props });
  };
  const identify: IdentifyFn = (userId, props) => {
    queueEvent({ type: "identify", userId, props });
  };
  const page: PageFn = (props) => {
    queueEvent({ type: "page", props });
  };

  const processItem = (item: QueueItem) => {
    switch (item.type) {
      case "identify":
        service.identify(item.userId, item.props);
        break;
      case "track":
        service.track(item.eventName, item.props);
        break;
      case "page":
        service.page(item.props);
        break;

      default:
        break;
    }
  };

  const processQueue = () => {
    while (queue.length) {
      const item = queue.shift();
      if (item) {
        processItem(item);
      }
    }
  };

  const conditionallyProcessQueue = () => {
    switch (service.state()) {
      case "enabled":
        // fire all queued events
        processQueue();
        setQueueInterval();
        break;
      case "disabled":
        // don't fire events but clear queue
        clearQueue();
        setQueueInterval();
        break;
      case "pending":
        break;

      default:
        break;
    }
  };

  const setQueueInterval = () => {
    if (!isBrowser) {
      return;
    }
    if (intervalId) {
      window.clearInterval(intervalId);
    }
    intervalId = window.setInterval(
      () => conditionallyProcessQueue(),
      intervalMs,
    );
  };

  setQueueInterval();

  return { ...service, identify, page, track, queue };
};

export default withQueue;
