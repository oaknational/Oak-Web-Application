import { act } from "@testing-library/react";

import { OakModalNew } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme", "theme"]);

window.matchMedia = jest.fn().mockReturnValue({
  matches: true,
});

describe("OakModalNew", () => {
  it("should match snapshot", () => {
    HTMLDialogElement.prototype.close = () => {};
    HTMLDialogElement.prototype.showModal = () => {};
    const { container, getByTestId } = render(
      <OakModalNew
        title={"test_title"}
        content={"test_content"}
        footer={"test_footer"}
        open={false}
        onClose={() => {}}
      />,
    );

    expect(getByTestId("modal").tagName).toEqual("DIALOG");
    expect(getByTestId("modal-title")).toHaveTextContent("test_title");
    expect(getByTestId("modal-content")).toHaveTextContent("test_content");
    expect(getByTestId("modal-footer")).toHaveTextContent("test_footer");
    expect(container).toMatchSnapshot();
  });

  it("should open/close when open state changed", () => {
    const closeMock = jest.fn();
    const showModalMock = jest.fn();
    const onCloseMock = jest.fn();
    HTMLDialogElement.prototype.close = closeMock;
    HTMLDialogElement.prototype.showModal = showModalMock;
    const { rerender } = render(
      <OakModalNew
        title={"test_title"}
        content={"test_content"}
        footer={"test_footer"}
        open={false}
        onClose={onCloseMock}
      />,
    );

    const resetMocks = () => {
      closeMock.mockClear();
      showModalMock.mockClear();
      onCloseMock.mockClear();
    };

    expect(closeMock).not.toHaveBeenCalled();
    expect(showModalMock).not.toHaveBeenCalled();
    expect(onCloseMock).not.toHaveBeenCalled();

    resetMocks();
    rerender(
      <OakModalNew
        title={"test_title"}
        content={"test_content"}
        footer={"test_footer"}
        open={true}
        onClose={onCloseMock}
      />,
    );

    expect(closeMock).not.toHaveBeenCalled();
    expect(showModalMock).toHaveBeenCalled();
    expect(onCloseMock).not.toHaveBeenCalled();

    resetMocks();
    rerender(
      <OakModalNew
        title={"test_title"}
        content={"test_content"}
        footer={"test_footer"}
        open={false}
        onClose={onCloseMock}
      />,
    );

    expect(closeMock).toHaveBeenCalled();
    expect(showModalMock).not.toHaveBeenCalled();
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("should open/close when open state changed", () => {
    const closeMock = jest.fn();
    const showModalMock = jest.fn();
    const onCloseMock = jest.fn();
    HTMLDialogElement.prototype.close = closeMock;
    HTMLDialogElement.prototype.showModal = showModalMock;
    const { container } = render(
      <OakModalNew
        title={"test_title"}
        content={"test_content"}
        footer={"test_footer"}
        open={false}
        onClose={onCloseMock}
      />,
    );

    act(() => {
      (container.querySelector('[aria-label="Close"]') as HTMLElement).click();
    });

    expect(onCloseMock).toHaveBeenCalled();
  });
});
