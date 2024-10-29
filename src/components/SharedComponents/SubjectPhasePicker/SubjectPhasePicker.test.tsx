import userEvent from "@testing-library/user-event";
import { getByTestId, waitFor } from "@testing-library/react";

import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const curriculumVisualiserAccessed = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumVisualiserAccessed: (...args: unknown[]) =>
        curriculumVisualiserAccessed(...args),
    },
  }),
}));

describe("Component - subject phase picker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("populates selection if supplied", () => {
    const currentSelection = {
      subject: {
        title: "English",
        slug: "english",
        phases: [],
        cycle: "1",
        ks4_options: [{ title: "AQA", slug: "aqa" }],
        keystages: [
          { title: "KS1", slug: "ks1" },
          { title: "KS3", slug: "ks3" },
        ],
      },
      phase: { title: "Secondary", slug: "secondary" },
      ks4Option: { title: "AQA", slug: "aqa" },
    };
    const { getByTitle } = render(
      <SubjectPhasePicker
        {...subjectPhaseOptions}
        currentSelection={currentSelection}
      />,
    );
    const subjectControl = getByTitle("Subject");
    const phaseControl = getByTitle("Phase");
    expect(subjectControl).toHaveTextContent("English");
    expect(phaseControl).toHaveTextContent("Secondary");
    expect(phaseControl).toHaveTextContent("AQA");
  });

  test("user can see subjects when they click the control", async () => {
    const { getByTitle, findAllByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Subject");
    expect(control).toBeTruthy();
    await userEvent.click(control);
    const buttons = await findAllByTitle("English");
    expect(buttons).toHaveLength(1);
  });

  test("user selects a subject", async () => {
    const { getByTitle, findAllByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Subject");
    await userEvent.click(control);
    const buttons = await findAllByTitle("Science");
    const button = buttons[0];
    if (!button) {
      throw new Error("Button not found");
    }
    await userEvent.click(button);
    await waitFor(() => {
      expect(control).toHaveTextContent("Science");
    });
  });

  test("user clicks to open phases when they click the control", async () => {
    const { findByTitle, getByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Phase");
    expect(control).toBeTruthy();
    await userEvent.click(control);
    const button = await findByTitle("Primary");
    expect(button).toBeInTheDocument();
  });

  test("user selects primary and then Music", async () => {
    const { getByTitle, findByTitle, findAllByTitle, queryByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Phase");
    await userEvent.click(control);
    await userEvent.click(await findByTitle("Primary"));
    expect(control).toHaveTextContent("Primary");
    expect(queryByTitle("Exam board")).toBeNull();
    await userEvent.click(getByTitle("Subject"));
    const button = (await findAllByTitle("Music"))[0];
    if (!button) {
      throw new Error("Could not find button");
    }
    await userEvent.click(button);
    expect(control).toHaveTextContent("Select");
  });

  test("user clicks English, secondary and an exam board", async () => {
    const { findByText, findByTitle, getByTitle, findAllByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    await userEvent.click(getByTitle("Subject"));
    const button = (await findAllByTitle("English"))[0];
    if (!button) {
      throw new Error("Could not find button");
    }
    await userEvent.click(button);
    const control = getByTitle("Phase");
    await userEvent.click(await findByTitle("Secondary"));
    const examboardTitle = await findByText("Choose an option for KS4");
    expect(examboardTitle).toBeTruthy();
    const aqa = (await findAllByTitle("AQA"))[0];
    if (!aqa) {
      throw new Error("Could not find button");
    }
    await userEvent.click(aqa);
    expect(control).toHaveTextContent("Secondary, AQA");
  });

  test("user can close selection panels with escape button", async () => {
    const { getByTestId } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );

    // Open the subject dropdown
    await userEvent.click(getByTestId("selectSubjectHeading"));
    const curriculumHeadingElem = getByTestId("subjectDropdownHeading");
    expect(curriculumHeadingElem).toBeVisible();
    await userEvent.keyboard("{Escape}");
    expect(curriculumHeadingElem).not.toBeVisible();

    // Open the phase dropdown
    await userEvent.click(getByTestId("selectPhaseHeading"));
    const schoolPhaseHeadingElem = getByTestId("phaseDropdownHeading");
    expect(schoolPhaseHeadingElem).toBeVisible();
    await userEvent.keyboard("{Escape}");
    expect(schoolPhaseHeadingElem).not.toBeVisible();
  });

  test("user clicks View without complete selection and gets error", async () => {
    const { getByTestId, getAllByTitle, getByTitle, queryByText } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const viewButton = getByTestId("view-desktop");
    await userEvent.click(viewButton);
    expect(queryByText("Select a subject")).toBeTruthy();
    expect(queryByText("Select a school phase")).toBeTruthy();
    const subjectButtons = getAllByTitle("History");
    const historyButton = subjectButtons[0];
    if (!historyButton) {
      throw new Error("History button not found");
    }
    await userEvent.click(historyButton);
    await userEvent.click(document.body);
    await userEvent.click(viewButton);
    expect(queryByText("Select a subject")).toBeNull();
    expect(queryByText("Select a school phase")).toBeTruthy();
    await userEvent.click(getByTitle("Secondary"));
    await userEvent.click(document.body);
    await userEvent.click(viewButton);
    expect(queryByText("Select an option for KS4")).toBeTruthy();
  });

  test("calls tracking.curriculumVisualiserAccessed once, with correct props", async () => {
    const { findAllByTitle, getByTitle, findByTitle, baseElement } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    await userEvent.click(getByTitle("Subject"));
    const button = (await findAllByTitle("English"))[0];
    if (!button) {
      throw new Error("Could not find button");
    }
    await userEvent.click(button);

    await userEvent.click(await findByTitle("Primary"));

    const viewButton = getByTestId(baseElement, "view-desktop");
    await userEvent.click(viewButton);

    expect(curriculumVisualiserAccessed).toHaveBeenCalledTimes(1);
    expect(curriculumVisualiserAccessed).toHaveBeenCalledWith({
      subjectTitle: "English",
      subjectSlug: "english",
      phase: "primary",
      analyticsUseCase: null,
    });
  });

  test("User can navigate to previous curriculum plans", async () => {
    const { getByTestId, getByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    await userEvent.click(getByTitle("Subject"));
    const link = getByTestId("previousPlansLink");
    expect(link).toHaveAttribute(
      "href",
      "/teachers/curriculum/previous-downloads",
    );
  });

  describe("Pathways are shown correctly", () => {
    test("user clicks English, secondary and two KS4 options are shown", async () => {
      const {
        findByText,
        findByTitle,
        getByTitle,
        findAllByTitle,
        findAllByTestId,
      } = render(<SubjectPhasePicker {...subjectPhaseOptions} />);
      await userEvent.click(getByTitle("Subject"));
      const button = (await findAllByTitle("English"))[0];
      if (!button) {
        throw new Error("Could not find button");
      }
      await userEvent.click(button);
      await userEvent.click(await findByTitle("Secondary"));
      const examboardTitle = await findByText("Choose an option for KS4");
      expect(examboardTitle).toBeTruthy();

      const ks4Options = await findAllByTestId("ks4-option-lot-picker");
      if (!ks4Options) {
        throw new Error("Could not find buttons");
      }
      expect(ks4Options).toHaveLength(2);
    });

    test("user clicks PE, secondary and correct examboards are shown in alphabetical order", async () => {
      const {
        findByText,
        findByTitle,
        getByTitle,
        findAllByTitle,
        findAllByTestId,
      } = render(<SubjectPhasePicker {...subjectPhaseOptions} />);

      await userEvent.click(getByTitle("Subject"));
      const button = (await findAllByTitle("Physical education"))[0];
      if (!button) {
        throw new Error("Could not find button");
      }
      await userEvent.click(button);
      await userEvent.click(await findByTitle("Secondary"));
      const examboardTitle = await findByText("Choose an option for KS4");
      expect(examboardTitle).toBeTruthy();

      const ks4Options = await findAllByTestId("ks4-option-lot-picker");
      if (!ks4Options) {
        throw new Error("Could not find buttons");
      }
      expect(ks4Options[0]).toHaveTextContent("AQA");
      expect(ks4Options[1]).toHaveTextContent("Edexcel");
      expect(ks4Options[2]).toHaveTextContent("OCR");
      expect(ks4Options).toHaveLength(3);
    });

    test("Computing has correct titles and no GCSE option present", async () => {
      const {
        findByText,
        findByTitle,
        getByTitle,
        findAllByTitle,
        findAllByTestId,
      } = render(<SubjectPhasePicker {...subjectPhaseOptions} />);

      await userEvent.click(getByTitle("Subject"));
      const button = (await findAllByTitle("Computing"))[0];
      if (!button) {
        throw new Error("Could not find button");
      }
      await userEvent.click(button);
      await userEvent.click(await findByTitle("Secondary"));
      const examboardTitle = await findByText("Choose an option for KS4");
      expect(examboardTitle).toBeTruthy();

      const ks4Options = await findAllByTestId("ks4-option-lot-picker");
      if (!ks4Options) {
        throw new Error("Could not find buttons");
      }
      expect(ks4Options[0]).toHaveTextContent("Core");
      expect(ks4Options[1]).toHaveTextContent("AQA (Computer Science)");
      expect(ks4Options[2]).toHaveTextContent("OCR (Computer Science)");
    });

    test("Citizenship has both Core and GCSE", async () => {
      const {
        findByText,
        findByTitle,
        getByTitle,
        findAllByTitle,
        findAllByTestId,
      } = render(<SubjectPhasePicker {...subjectPhaseOptions} />);

      await userEvent.click(getByTitle("Subject"));
      const button = (await findAllByTitle("Citizenship"))[0];
      if (!button) {
        throw new Error("Could not find button");
      }
      await userEvent.click(button);
      await userEvent.click(await findByTitle("Secondary"));
      const examboardTitle = await findByText("Choose an option for KS4");
      expect(examboardTitle).toBeTruthy();

      const ks4Options = await findAllByTestId("ks4-option-lot-picker");
      if (!ks4Options) {
        throw new Error("Could not find buttons");
      }
      expect(ks4Options[0]).toHaveTextContent("Core");
      expect(ks4Options[1]).toHaveTextContent("GCSE");
    });

    test("No KS4 options displayed", async () => {
      const { queryByText, findByTitle, getByTitle, findAllByTitle } = render(
        <SubjectPhasePicker {...subjectPhaseOptions} />,
      );

      await userEvent.click(getByTitle("Subject"));
      const button = (await findAllByTitle("Geography"))[0];
      if (!button) {
        throw new Error("Could not find button");
      }
      await userEvent.click(button);
      await userEvent.click(await findByTitle("Secondary"));
      expect(queryByText("Choose an option for KS4")).not.toBeInTheDocument();
    });

    test("tab focus breaks outside of modal", async () => {
      const { getByTestId, getByTitle, findAllByTitle } = render(
        <SubjectPhasePicker {...subjectPhaseOptions} />,
      );
      await userEvent.click(getByTitle("Subject"));
      const button = (await findAllByTitle("Geography"))[0];
      if (!button) {
        throw new Error("Could not find button");
      }

      const checkIfPhasesFocused = () => {
        const el = getByTestId("phasePickerButton");
        if (el.matches(":focus-within")) {
          return true;
        }
        return false;
      };

      // Tab through until we tab outside the
      let i = 0;
      for (i; i < 20; i++) {
        await userEvent.tab();
        if (checkIfPhasesFocused()) {
          break;
        }
      }

      expect(getByTestId("phasePickerButton").matches(":focus")).toBe(true);
    });
  });
});
