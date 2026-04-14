import { VideoEventCallbackArgs } from "@/components/SharedComponents/VideoPlayer/VideoPlayer";

export const shouldPersistVideoTimeElapsed = ({
  event,
  nextTimeElapsed,
  currentTimeElapsed,
  currentSection,
}: {
  event: VideoEventCallbackArgs["event"];
  nextTimeElapsed: number;
  currentTimeElapsed: number;
  currentSection: string;
}) => {
  return (
    event !== "playing" ||
    (nextTimeElapsed - currentTimeElapsed > 10 && currentSection === "video")
  );
};
