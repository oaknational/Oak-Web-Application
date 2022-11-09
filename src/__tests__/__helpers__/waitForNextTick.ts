import { waitFor } from "@testing-library/react";

const waitForNextTick = async () => {
  return waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));
};

export default waitForNextTick;
