import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";

import MobileDrawerNav, { MobileDrawerNavProps } from "./MobileDrawerNav";

const onClick = jest.fn();

const testProps: MobileDrawerNavProps = {
  label: "Menu",
  children: (
    <ul>
      <li>
        <a onClick={() => onClick()} href="#">
          Item 1
        </a>
      </li>
      <li>
        <a onClick={() => onClick()} href="#">
          Item 2
        </a>
      </li>
      <li>
        <a onClick={() => onClick()} href="#">
          Item 3
        </a>
      </li>
    </ul>
  ),
};

const render = renderWithProviders();

describe("components/MobileDrawerNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("it renders all blogs button and has focus", async () => {
    const { getByText } = render(<MobileDrawerNav {...testProps} />);
    const button = getByText("Menu");

    expect(button).toBeInTheDocument();
  });
  test("it opens the drawer when clicked", async () => {
    const { getByText } = render(<MobileDrawerNav {...testProps} />);
    const button = getByText("Menu");
    const link = getByText("Item 1");
    userEvent.click(button);

    expect(link).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(0);
  });
  test("you can click on a link in the expanded drawer", async () => {
    const { getByText } = render(<MobileDrawerNav {...testProps} />);
    const button = getByText("Menu");
    const link = getByText("Item 1");
    await userEvent.click(button);
    await userEvent.click(link);

    expect(link).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test("you can tab onto and click on a link in the expanded drawer", async () => {
    render(<MobileDrawerNav {...testProps} />);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
