import { MouseEventHandler, MutableRefObject } from "react";
import { render, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "../__tests__/__helpers__/LocalStorageMock";

import useClickableCard from "./useClickableCard";

const Clickable = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { primaryTargetProps, containerProps } =
    useClickableCard<HTMLButtonElement>();
  const onSecondaryClick: MouseEventHandler<HTMLButtonElement> = () => {
    // noop
  };
  return (
    <div data-testid="container" {...containerProps}>
      <button onClick={onClick} ref={primaryTargetProps.ref}>
        Primary button
      </button>
      <p>A bunch of other text that that is not a label for either button</p>
      <button onClick={onSecondaryClick}>Secondary button</button>
    </div>
  );
};

describe("useClickableCard()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("clicking the container clicks the click target", async () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<Clickable onClick={onClick} />);
    const container = getByTestId("container");
    const user = userEvent.setup();
    await user.click(container);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test("clicking the primary button should only cause the click callback to be fired once", async () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Clickable onClick={onClick} />);
    const primaryButton = getByRole("button", { name: "Primary button" });
    const user = userEvent.setup();
    await user.click(primaryButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test("clicking the secondary button does not click the click target", async () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Clickable onClick={onClick} />);
    const secondaryButton = getByRole("button", { name: "Secondary button" });
    const user = userEvent.setup();
    await user.click(secondaryButton);
    expect(onClick).not.toHaveBeenCalled();
  });
  test("you can pass in an external ref", async () => {
    const ref = { current: "my ref" as unknown as HTMLAnchorElement };
    const { result } = renderHook(() =>
      useClickableCard(ref as MutableRefObject<HTMLAnchorElement>),
    );
    expect(result.current.primaryTargetProps.ref.current).toBe("my ref");
  });
});
