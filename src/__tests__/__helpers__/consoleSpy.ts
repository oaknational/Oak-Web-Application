import { vi } from "vitest";

export const consoleSpy = () => {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const spy = {
    log,
    warn,
    error,
    restore: () => {
      log.mockRestore();
      warn.mockRestore();
      error.mockRestore();
    },
  };
  return spy;
};
