import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import SubjectPickerForm from "./SubjectPickerForm";
import { basicSubjectPickerFormFixture } from "./SubjectPickerForm.fixtures";
import { KEY_STAGES, YEAR_GROUPS } from "./formData";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockPush = jest.fn();

const render = renderWithProviders();

const SUBJECT_ERROR = "Choose a subject to continue";
const KEY_STAGE_ERROR = "Choose a key stage to continue";

const getSubmitButton = () =>
  screen.getByRole("button", {
    name: basicSubjectPickerFormFixture.buttonText,
  });

describe("SubjectPickerForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("matches snapshot and renders data", () => {
    const { container } = render(
      <SubjectPickerForm {...basicSubjectPickerFormFixture} />,
    );
    expect(container).toMatchSnapshot();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: basicSubjectPickerFormFixture.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(basicSubjectPickerFormFixture.bannerLabel),
    ).toBeInTheDocument();
    expect(getSubmitButton()).toHaveAttribute("type", "submit");
  });

  it("does not render the key stage options until a subject is chosen", async () => {
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

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
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

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
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeEmptyDOMElement();
  });

  it("announces the subject error in the alert region and does not navigate on submit when no subject selected", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(SUBJECT_ERROR);
    });
    await waitFor(() => {
      expect(screen.getAllByText(SUBJECT_ERROR)).toHaveLength(2);
    });
    expect(screen.queryByText(KEY_STAGE_ERROR)).not.toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("announces the key stage error in the alert region when a subject is chosen without a key stage", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

    await user.click(screen.getByRole("radio", { name: "History" }));
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(KEY_STAGE_ERROR);
    });
    expect(screen.getByRole("alert")).not.toHaveTextContent(SUBJECT_ERROR);
    await waitFor(() => {
      expect(screen.getAllByText(KEY_STAGE_ERROR)).toHaveLength(2);
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("does not show a key stage error when the key stage field mounts after a failed submit", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

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
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

    await user.click(getSubmitButton());
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(SUBJECT_ERROR);
    });

    await user.click(screen.getByRole("radio", { name: "Computing" }));

    await waitFor(() => {
      expect(screen.queryByText(SUBJECT_ERROR)).not.toBeInTheDocument();
    });
  });

  it("clears the key stage error once a key stage is chosen", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

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

  it("does not mark the subject group as invalid before submitting", () => {
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

    const subjectGroup = screen.getByRole("group", {
      name: "Choose your primary subject",
    });
    expect(subjectGroup).not.toHaveAttribute("aria-describedby");
    expect(subjectGroup).not.toHaveAttribute("aria-invalid");
  });

  it("associates the subject error with the subject group", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

    await user.click(getSubmitButton());

    const subjectGroup = screen.getByRole("group", {
      name: "Choose your primary subject",
    });
    await waitFor(() => {
      expect(subjectGroup).toHaveAccessibleDescription(
        new RegExp(SUBJECT_ERROR),
      );
    });
    expect(subjectGroup).toHaveAttribute("aria-invalid", "true");
  });

  it("navigates to the selected subject and key stage", async () => {
    const user = userEvent.setup();
    render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

    await user.click(screen.getByRole("radio", { name: "Science" }));
    await user.click(screen.getByRole("radio", { name: "Key stage 2" }));
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
    expect(mockPush).toHaveBeenCalledWith("/nc-alignment-checker/science/ks2");
    expect(screen.getByRole("alert")).toBeEmptyDOMElement();
  });

  describe("changing subject", () => {
    it("clears the key stage when switching to Maths and does not navigate until a year is chosen", async () => {
      const user = userEvent.setup();
      render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

      await user.click(screen.getByRole("radio", { name: "Science" }));
      await user.click(screen.getByRole("radio", { name: "Key stage 2" }));
      await user.click(screen.getByRole("radio", { name: "Maths" }));

      const yearGroup = await screen.findByRole("group", {
        name: "Choose your year group",
      });
      expect(
        screen.queryByRole("group", { name: "Choose your key stage" }),
      ).not.toBeInTheDocument();
      within(yearGroup)
        .getAllByRole("radio")
        .forEach((radio) => expect(radio).not.toBeChecked());

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Choose a year group to continue",
        );
      });
      expect(mockPush).not.toHaveBeenCalled();

      await user.click(screen.getByRole("radio", { name: "Year 3" }));
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(1);
      });
      expect(mockPush).toHaveBeenCalledWith(
        "/nc-alignment-checker/maths/year-3",
      );
    });

    it("clears the key stage when switching between two key stage subjects", async () => {
      const user = userEvent.setup();
      render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

      await user.click(screen.getByRole("radio", { name: "Science" }));
      await user.click(screen.getByRole("radio", { name: "Key stage 2" }));
      expect(screen.getByRole("radio", { name: "Key stage 2" })).toBeChecked();

      await user.click(screen.getByRole("radio", { name: "History" }));

      const keyStageGroup = screen.getByRole("group", {
        name: "Choose your key stage",
      });
      within(keyStageGroup)
        .getAllByRole("radio")
        .forEach((radio) => expect(radio).not.toBeChecked());

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(KEY_STAGE_ERROR);
      });
      expect(mockPush).not.toHaveBeenCalled();

      await user.click(screen.getByRole("radio", { name: "Key stage 1" }));
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(1);
      });
      expect(mockPush).toHaveBeenCalledWith(
        "/nc-alignment-checker/history/ks1",
      );
    });

    it("clears an existing key stage error when the subject changes", async () => {
      const user = userEvent.setup();
      render(<SubjectPickerForm {...basicSubjectPickerFormFixture} />);

      await user.click(screen.getByRole("radio", { name: "Science" }));
      await user.click(getSubmitButton());
      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(KEY_STAGE_ERROR);
      });

      await user.click(screen.getByRole("radio", { name: "History" }));

      await waitFor(() => {
        expect(screen.queryByText(KEY_STAGE_ERROR)).not.toBeInTheDocument();
      });
      expect(
        screen.getByRole("group", { name: "Choose your key stage" }),
      ).not.toHaveAttribute("aria-invalid");
    });
  });
});
