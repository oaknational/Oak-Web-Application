import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import SubjectPickerForm from "./SubjectPickerForm";
import { basic } from "./SubjectPickerForm.fixtures";
import { KEY_STAGES, YEAR_GROUPS } from "./formData";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockPush = jest.fn();

const render = renderWithProviders();

const SUBJECT_ERROR = "Choose a subject to continue";
const KEY_STAGE_ERROR = "Choose a key stage to continue";

const getSubmitButton = () =>
  screen.getByRole("button", { name: basic.buttonText });

describe("SubjectPickerForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("matches snapshot and renders data", () => {
    const { container } = render(<SubjectPickerForm {...basic} />);
    expect(container).toMatchSnapshot();

    expect(
      screen.getByRole("heading", { level: 2, name: basic.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(basic.bannerLabel)).toBeInTheDocument();
    expect(getSubmitButton()).toHaveAttribute("type", "submit");
  });

  it("does not render the key stage options until a subject is chosen", async () => {
    render(<SubjectPickerForm {...basic} />);

    expect(
      screen.queryByRole("group", { name: "Choose your key stage" }),
    ).not.toBeInTheDocument();
    KEY_STAGES.forEach((keyStage) => {
      expect(
        screen.queryByRole("radio", { name: keyStage.title }),
      ).not.toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole("radio", { name: "Science" }));

    const keyStageGroup = await screen.findByRole("group", {
      name: "Choose your key stage",
    });
    expect(within(keyStageGroup).getAllByRole("radio")).toHaveLength(
      KEY_STAGES.length,
    );
  });

  it("renders the year options when Maths is chosen", async () => {
    render(<SubjectPickerForm {...basic} />);

    expect(
      screen.queryByRole("group", { name: "Choose your year group" }),
    ).not.toBeInTheDocument();
    YEAR_GROUPS.forEach((yearGroup) => {
      expect(
        screen.queryByRole("radio", { name: yearGroup.title }),
      ).not.toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole("radio", { name: "Maths" }));

    const yearGroup = await screen.findByRole("group", {
      name: "Choose your year group",
    });
    expect(within(yearGroup).getAllByRole("radio")).toHaveLength(
      YEAR_GROUPS.length,
    );
  });

  it("renders an empty alert region on initial render", () => {
    render(<SubjectPickerForm {...basic} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeEmptyDOMElement();
  });

  it("announces the subject error in the alert region on submit", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basic} />);

    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(SUBJECT_ERROR);
    });
  });

  it("announces the key stage error in the alert region when a subject is chosen without a key stage", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basic} />);

    await user.click(screen.getByRole("radio", { name: "History" }));
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(KEY_STAGE_ERROR);
    });
    expect(screen.getByRole("alert")).not.toHaveTextContent(SUBJECT_ERROR);
  });

  it("shows a subject error and does not navigate when submitted empty", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basic} />);

    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getAllByText(SUBJECT_ERROR)).toHaveLength(2);
    });
    expect(screen.queryByText(KEY_STAGE_ERROR)).not.toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("does not show a key stage error when the key stage field mounts after a failed submit", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basic} />);

    await user.click(getSubmitButton());
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(SUBJECT_ERROR);
    });

    await user.click(screen.getByRole("radio", { name: "Science" }));

    await screen.findByRole("group", { name: "Choose your key stage" });
    expect(screen.queryByText(KEY_STAGE_ERROR)).not.toBeInTheDocument();
  });

  it("clears the subject error once a subject is chosen", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basic} />);

    await user.click(getSubmitButton());
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(SUBJECT_ERROR);
    });

    await user.click(screen.getByRole("radio", { name: "Computing" }));

    await waitFor(() => {
      expect(screen.queryByText(SUBJECT_ERROR)).not.toBeInTheDocument();
    });
  });

  it("shows a key stage error and does not navigate when only a subject is chosen", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basic} />);

    await user.click(screen.getByRole("radio", { name: "Science" }));
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getAllByText(KEY_STAGE_ERROR)).toHaveLength(2);
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("clears the key stage error once a key stage is chosen", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basic} />);

    await user.click(screen.getByRole("radio", { name: "Science" }));
    await user.click(getSubmitButton());
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(KEY_STAGE_ERROR);
    });

    await user.click(screen.getByRole("radio", { name: "Key stage 1" }));

    await waitFor(() => {
      expect(screen.queryByText(KEY_STAGE_ERROR)).not.toBeInTheDocument();
    });
    expect(screen.getByRole("alert")).toBeEmptyDOMElement();
  });

  it("navigates to the selected subject and key stage", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basic} />);

    await user.click(screen.getByRole("radio", { name: "Science" }));
    await user.click(screen.getByRole("radio", { name: "Key stage 2" }));
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
    expect(mockPush).toHaveBeenCalledWith("/nc-alignment-checker/science/ks2");
    expect(screen.getByRole("alert")).toBeEmptyDOMElement();
  });
});
