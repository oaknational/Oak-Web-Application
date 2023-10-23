import { renderHook, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";
import { DownloadFormProps } from "../downloads.types";

import DownloadCardGroup from "./DownloadCardGroup";

const selectAll = jest.fn;
const deselectAll = jest.fn;

describe("DownloadCardGroup", () => {
  it("renders a toggleable select all checkbox", async () => {
    const { result } = renderHook(() => useForm<DownloadFormProps>());
    renderWithTheme(
      <DownloadCardGroup
        control={result.current.control}
        onSelectAllClick={selectAll}
        onDeselectAllClick={deselectAll}
        preselectAll={true}
      />,
    );

    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: "Select all",
    });

    expect(selectAllCheckbox).toBeInTheDocument();
    expect(selectAllCheckbox).toBeChecked();

    const user = userEvent.setup();
    await user.click(selectAllCheckbox);
    expect(selectAllCheckbox).not.toBeChecked();
  });
});
