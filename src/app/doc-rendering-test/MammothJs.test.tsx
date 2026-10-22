import { screen, waitFor } from "@testing-library/react";

import { MammothJs } from "./MammothJs";
import { getParsedDocx } from "./getParsedDocx";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("./getParsedDocx", () => ({ getParsedDocx: jest.fn() }));

const render = renderWithProvidersByName(["oakTheme"]);
const parse = jest.mocked(getParsedDocx);

describe("MammothJs local cache", () => {
  beforeEach(() => {
    parse.mockReset();
  });

  it("reuses a successful result immediately after remounting", async () => {
    parse.mockResolvedValue({
      fileId: "cached-document",
      html: "<p>Cached content</p>",
      messages: ["Conversion warning"],
    });
    const first = render(<MammothJs fileId="cached-document" />);
    await screen.findByText("Cached content");
    first.unmount();

    render(<MammothJs fileId="cached-document" />);
    expect(screen.getByText("Cached content")).toBeInTheDocument();
    expect(screen.getByText("Conversion warning")).toBeInTheDocument();
    expect(parse).toHaveBeenCalledTimes(1);
  });

  it("keeps different documents separate when switching back", async () => {
    parse.mockImplementation(async (fileId) => ({
      fileId,
      html: `<p>Content for ${fileId}</p>`,
      messages: [],
    }));
    const view = render(<MammothJs fileId="first-document" />);
    await screen.findByText("Content for first-document");
    view.rerender(<MammothJs fileId="second-document" />);
    await screen.findByText("Content for second-document");
    view.rerender(<MammothJs fileId="first-document" />);

    expect(screen.getByText("Content for first-document")).toBeInTheDocument();
    expect(screen.queryByText("Content for second-document")).toBeNull();
    expect(parse).toHaveBeenCalledTimes(2);
  });

  it("does not cache failures", async () => {
    const log = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      parse.mockRejectedValueOnce(new Error("Export unavailable"));
      const first = render(<MammothJs fileId="retry-document" />);
      await screen.findByRole("alert");
      first.unmount();
      parse.mockResolvedValueOnce({
        fileId: "retry-document",
        html: "<p>Recovered content</p>",
        messages: [],
      });
      render(<MammothJs fileId="retry-document" />);
      await screen.findByText("Recovered content");
      expect(parse).toHaveBeenCalledTimes(2);
      expect(log).toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it("aborts unmounted requests and does not cache their late results", async () => {
    let complete:
      | ((result: Awaited<ReturnType<typeof getParsedDocx>>) => void)
      | undefined;
    parse.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          complete = resolve;
        }),
    );
    const first = render(<MammothJs fileId="cancelled-document" />);
    const signal = parse.mock.calls[0]?.[1];
    first.unmount();
    expect(signal?.aborted).toBe(true);
    complete?.({
      fileId: "cancelled-document",
      html: "<p>Stale content</p>",
      messages: [],
    });
    await Promise.resolve();
    parse.mockResolvedValueOnce({
      fileId: "cancelled-document",
      html: "<p>Fresh content</p>",
      messages: [],
    });
    render(<MammothJs fileId="cancelled-document" />);
    await waitFor(() =>
      expect(screen.getByText("Fresh content")).toBeInTheDocument(),
    );
    expect(parse).toHaveBeenCalledTimes(2);
  });
});
