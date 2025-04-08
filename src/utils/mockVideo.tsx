import { forwardRef } from "react";

export function setupVideoMock() {
  jest.mock("@mux/mux-player-react/lazy", () => {
    return forwardRef((props, ref) => {
      ref; // This prevents warning about ref not being used
      return <div data-testid="mux-player-mock" />;
    });
  });
}
