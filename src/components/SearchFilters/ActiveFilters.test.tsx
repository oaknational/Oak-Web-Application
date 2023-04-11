import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import ActiveFilters from "./ActiveFilters";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const ks4OnChange = jest.fn();
const ks3OnChange = jest.fn();
const keyStageFilters = [
  {
    title: "Key-stage 4",
    slug: "ks4",
    shortCode: "KS4",
    onChange: ks4OnChange,
    checked: true,
  },
  {
    title: "Key-stage 3",
    slug: "ks3",
    shortCode: "KS3",
    onChange: ks3OnChange,
    checked: false,
  },
];

describe("ActiveFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test.each(keyStageFilters.filter((ks) => ks.checked).map((ks) => ks.title))(
    "should render the checked filters: %s",
    (ks) => {
      const { getByRole } = renderWithTheme(
        <ActiveFilters keyStageFilters={keyStageFilters} />
      );
      const button = getByRole("button", { name: `Remove ${ks} filter` });
      expect(button).toBeInTheDocument();
    }
  );
  test.each(keyStageFilters.filter((ks) => !ks.checked).map((ks) => ks.title))(
    "should not render the unchecked filters: %s",
    (ks) => {
      const { queryByRole } = renderWithTheme(
        <ActiveFilters keyStageFilters={keyStageFilters} />
      );
      const button = queryByRole("button", { name: `Remove ${ks} filter` });
      expect(button).not.toBeInTheDocument();
    }
  );
});
