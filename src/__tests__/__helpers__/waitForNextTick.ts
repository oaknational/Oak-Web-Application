import { waitFor } from "@testing-library/react";

const waitForNextTick = async (delayMs?: number) => {
  return waitFor(
    () => new Promise((resolve) => setTimeout(resolve, delayMs ?? 0)),
  );
};

export default waitForNextTick;
