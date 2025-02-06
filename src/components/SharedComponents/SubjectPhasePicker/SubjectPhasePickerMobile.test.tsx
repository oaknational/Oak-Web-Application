import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("@/hooks/useMediaQuery.tsx", () => ({
  __esModule: true,
  default: () => true,
}));

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

describe("Component - Mobile subject phase picker", () => {
  describe("Subject picker interaction", () => {
    test("shows subject list when clicking picker", async () => {
      const { getByTitle, findAllByTitle, getByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );
      const control = getByTitle("Subject");
      expect(control).toBeTruthy();
      await userEvent.click(control);

      expect(getByTestId("subject-picker-heading")).toHaveTextContent(
        "Curriculum plans",
      );
      const button = await findAllByTitle("English");
      expect(button).toHaveLength(1);
    });

    test("links to previous curriculum plans", async () => {
      const { getByTestId, getByTitle } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );
      await userEvent.click(getByTitle("Subject"));
      const link = getByTestId("subject-picker-previous-plans-link");
      expect(link).toHaveAttribute(
        "href",
        "/teachers/curriculum/previous-downloads",
      );
    });

    test("selects subject when clicked", async () => {
      const { findAllByTitle, getByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const buttons = await findAllByTitle("English");
      expect(buttons).toHaveLength(1);

      const button = buttons[0] as HTMLElement;
      if (!button) {
        throw new Error("Button not found");
      }

      await userEvent.click(button);
      await waitFor(() => {
        expect(buttons[0]).toHaveTextContent("English");
      });
    });

    test("disables confirm button until subject is selected", async () => {
      const { findAllByTitle, getByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const buttons = await findAllByTitle("Science");
      expect(buttons).toHaveLength(1);

      const subjectConfirmationButton = getByTestId(
        "mobile-subject-picker-confirm-button",
      );
      expect(subjectConfirmationButton).toBeDisabled();

      const button = buttons[0] as HTMLElement;
      await userEvent.click(button);

      expect(subjectConfirmationButton).not.toBeDisabled();
      await userEvent.click(subjectConfirmationButton);
    });

    test("shows phase picker after confirming subject", async () => {
      const { findAllByTitle, getByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const buttons = await findAllByTitle("English");
      expect(buttons).toHaveLength(1);
      const button = buttons[0] as HTMLElement;
      if (!button) {
        throw new Error("Button not found");
      }
      await userEvent.click(button);
      await waitFor(() => {
        expect(buttons[0]).toHaveTextContent("English");
      });

      const subjectConfirmationButton = getByTestId(
        "mobile-subject-picker-confirm-button",
      );
      expect(subjectConfirmationButton).not.toBeDisabled();
      await userEvent.click(subjectConfirmationButton);
      await waitFor(() => {
        expect(getByTestId("mobile-phase-picker-heading")).toHaveTextContent(
          "School phase",
        );
      });
    });

    test("traps focus within subject picker", async () => {
      const { getByTitle, findByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      await userEvent.click(getByTitle("Subject"));
      const modal = await findByTestId("mobile-subject-picker");
      await waitFor(() => new Promise((res) => setTimeout(res, 500)));

      const focusableElements = Array.from(
        modal.querySelectorAll(
          'button:not([disabled]), [role="radio"], a, input, [tabindex]:not([tabindex="-1"])',
        ),
      ) as HTMLElement[];

      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0]!;
        const lastElement = focusableElements[focusableElements.length - 1]!;

        // Focus on the last element and tab forward, expecting wrap to the first
        lastElement.focus();
        await userEvent.tab();
        expect(document.activeElement).toBe(firstElement);

        // Focus on the first element and tab backward, expecting wrap to the last
        firstElement.focus();
        await userEvent.tab({ shift: true });
        await waitFor(() => {
          expect(document.activeElement).toBe(lastElement);
        });
      } else {
        throw new Error("No focusable elements found in the modal");
      }
    });

    test("closes subject picker with close button", async () => {
      const { getByTestId, queryByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      await userEvent.click(getByTestId("subject-picker-button-heading"));

      const subjectHeading = getByTestId("subject-picker-heading");
      expect(subjectHeading).toBeInTheDocument();
      expect(subjectHeading.textContent).toBe("Curriculum plans");

      const closeButton = getByTestId("close-modal-button");
      await userEvent.click(closeButton);

      expect(queryByTestId("subject-picker-heading")).not.toBeInTheDocument();
    });

    test("closes subject picker with escape key", async () => {
      const { getByTestId, queryByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      await userEvent.click(getByTestId("subject-picker-button-heading"));

      const subjectPickerHeading = getByTestId("subject-picker-heading");
      expect(subjectPickerHeading).toBeInTheDocument();
      expect(subjectPickerHeading.textContent).toBe("Curriculum plans");

      await userEvent.keyboard("{Escape}");

      expect(queryByTestId("subject-picker-heading")).not.toBeInTheDocument();
    });
  });

  describe("Phase picker interaction", () => {
    test("user can navigate back from phase picker to subject picker", async () => {
      const { findAllByTitle, getByTestId, queryByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const buttons = await findAllByTitle("English");
      const button = buttons[0] as HTMLElement;
      await userEvent.click(button);

      const confirmButton = getByTestId("mobile-subject-picker-confirm-button");
      await userEvent.click(confirmButton);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const phasePickerHeading = getByTestId("mobile-phase-picker-heading");
      expect(phasePickerHeading).toBeInTheDocument();
      expect(phasePickerHeading).toHaveTextContent("School phase");

      const backButton = getByTestId(
        "mobile-phase-picker-back-to-subject-button",
      );
      await userEvent.click(backButton);

      await waitFor(() => {
        expect(
          queryByTestId("mobile-phase-picker-heading"),
        ).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(getByTestId("subject-picker-heading")).toBeInTheDocument();
      });
    });

    test("user cannot click view curriculum button until a valid phase selection is made", async () => {
      const { getByTitle, findAllByTitle, findByTitle, getByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      await userEvent.click(getByTitle("Subject"));
      const englishButton = (await findAllByTitle("English"))[0];
      await userEvent.click(englishButton as HTMLElement);
      await userEvent.click(
        getByTestId("mobile-subject-picker-confirm-button"),
      );

      await waitFor(() => {
        expect(getByTestId("mobile-phase-picker-heading")).toHaveTextContent(
          "School phase",
        );
      });

      const viewButton = getByTestId("mobile-phase-picker-confirm-button");
      expect(viewButton).toBeDisabled();

      await userEvent.click(await findByTitle("Secondary"));
      expect(viewButton).toBeDisabled();

      const ks4Options = await findAllByTitle("AQA");
      await userEvent.click(ks4Options[0] as HTMLElement);

      expect(viewButton).not.toBeDisabled();
    });

    test("an error is shown if a phase is confirmed without a subject having been selected first", async () => {
      const { getByTitle, getByTestId, getByRole } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      await userEvent.click(getByTestId("phase-picker-button"));
      expect(getByTestId("mobile-phase-picker-heading")).toHaveTextContent(
        "School phase",
      );
      const secondaryButton = getByTitle("Secondary");
      await userEvent.click(secondaryButton);

      const viewButton = getByTestId("mobile-phase-picker-confirm-button");
      await userEvent.click(viewButton);

      // Confirm error message shown in lot picker and subject picker modal
      const subjectControl = getByTitle("Subject");
      expect(subjectControl).toHaveTextContent("Select a subject");
      const subjectPickerButton = getByTestId("subject-picker-button");
      await userEvent.click(subjectPickerButton);

      const errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(
        "Select a subject to view a curriculum",
      );
    });

    test("traps focus within phase picker modal", async () => {
      const { getByTestId, findByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      await userEvent.click(getByTestId("phase-picker-button"));
      const modal = await findByTestId("mobile-phase-picker");
      await waitFor(() => new Promise((res) => setTimeout(res, 500)));

      const focusableElements = Array.from(
        modal.querySelectorAll(
          'button:not([disabled]), [role="radio"], a, input, [tabindex]:not([tabindex="-1"])',
        ),
      ) as HTMLElement[];

      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0]!;
        const lastElement = focusableElements[focusableElements.length - 1]!;

        // Focus on the last element and tab forward, expecting wrap to the first
        lastElement.focus();
        await userEvent.tab();
        expect(document.activeElement).toBe(firstElement);

        // Focus on the first element and tab backward, expecting wrap to the last
        firstElement.focus();
        await userEvent.tab({ shift: true });
        await waitFor(() => {
          expect(document.activeElement).toBe(lastElement);
        });
      } else {
        throw new Error("No focusable elements found in the modal");
      }
    });

    test("close button closes mobile phase picker", async () => {
      const { getByTestId, queryByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      await userEvent.click(getByTestId("phase-picker-button"));

      const phasePickerHeading = getByTestId("mobile-phase-picker-heading");
      expect(phasePickerHeading).toBeInTheDocument();
      expect(phasePickerHeading.textContent).toBe("School phase");

      const closeButton = getByTestId("close-modal-button");
      await userEvent.click(closeButton);

      expect(
        queryByTestId("mobile-phase-picker-heading"),
      ).not.toBeInTheDocument();
    });

    test("escape key closes mobile phase picker", async () => {
      const { getByTestId, queryByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      await userEvent.click(getByTestId("phase-picker-button"));

      const phasePickerHeading = getByTestId("mobile-phase-picker-heading");
      expect(phasePickerHeading).toBeInTheDocument();
      expect(phasePickerHeading.textContent).toBe("School phase");

      await userEvent.keyboard("{Escape}");

      expect(
        queryByTestId("mobile-phase-picker-heading"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Pathways are shown correctly", () => {
    test("shows primary options when selecting English", async () => {
      const { getByTitle, findAllByTitle, getByTestId } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const englishButton = await findAllByTitle("English");
      expect(englishButton).toHaveLength(1);
      await userEvent.click(englishButton[0] as HTMLElement);

      const confirmSubjectButton = getByTestId(
        "mobile-subject-picker-confirm-button",
      );
      await userEvent.click(confirmSubjectButton);

      await waitFor(() => {
        expect(getByTestId("mobile-phase-picker-heading")).toBeInTheDocument();
      });

      const primaryButton = getByTitle("Primary");
      await userEvent.click(primaryButton);

      const viewButton = getByTestId("mobile-phase-picker-confirm-button");
      expect(viewButton).not.toBeDisabled();
    });

    test("shows two KS4 options when selecting English and secondary", async () => {
      const { getByTitle, findAllByTitle, getByTestId, findAllByTestId } =
        render(<SubjectPhasePicker {...curriculumPhaseOptions} />);

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const englishButton = await findAllByTitle("English");
      expect(englishButton).toHaveLength(1);
      await userEvent.click(englishButton[0] as HTMLElement);

      const confirmSubjectButton = getByTestId(
        "mobile-subject-picker-confirm-button",
      );
      if (!confirmSubjectButton) {
        throw new Error("Confirm subject button not found");
      }
      await userEvent.click(confirmSubjectButton);

      await waitFor(() => {
        expect(getByTestId("mobile-phase-picker-heading")).toBeInTheDocument();
      });

      const secondaryButton = await getByTitle("Secondary");
      expect(secondaryButton).toBeInTheDocument();
      if (!secondaryButton) {
        throw new Error("Secondary button not found");
      }
      await userEvent.click(secondaryButton);

      const ks4OptionsTitle = getByTestId(
        "mobile-phase-picker-ks4-option-heading",
      );
      expect(ks4OptionsTitle).toHaveTextContent("Choose an option for KS4");

      const ks4Options = await findAllByTestId(
        "mobile-phase-picker-ks4-option",
      );
      expect(ks4Options).toHaveLength(2);
    });

    test("shows PE examboards in alphabetical order when selecting secondary", async () => {
      const { getByTitle, findAllByTitle, getByTestId, findAllByTestId } =
        render(<SubjectPhasePicker {...curriculumPhaseOptions} />);

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const peButton = await findAllByTitle("Physical education");
      expect(peButton).toHaveLength(1);
      await userEvent.click(peButton[0] as HTMLElement);

      const confirmSubjectButton = getByTestId(
        "mobile-subject-picker-confirm-button",
      );
      if (!confirmSubjectButton) {
        throw new Error("Confirm subject button not found");
      }
      await userEvent.click(confirmSubjectButton);

      await waitFor(() => {
        expect(getByTestId("mobile-phase-picker-heading")).toBeInTheDocument();
      });

      const secondaryButton = await getByTitle("Secondary");
      expect(secondaryButton).toBeInTheDocument();
      if (!secondaryButton) {
        throw new Error("Secondary button not found");
      }
      await userEvent.click(secondaryButton);

      const ks4OptionsTitle = getByTestId(
        "mobile-phase-picker-ks4-option-heading",
      );
      expect(ks4OptionsTitle).toHaveTextContent("Choose an option for KS4");

      const ks4Options = await findAllByTestId(
        "mobile-phase-picker-ks4-option",
      );
      expect(ks4Options[0]).toHaveTextContent("AQA");
      expect(ks4Options[1]).toHaveTextContent("Edexcel");
      expect(ks4Options[2]).toHaveTextContent("OCR");
      expect(ks4Options).toHaveLength(3);
    });

    test("shows correct Computing options with no GCSE option", async () => {
      const { getByTitle, findAllByTitle, getByTestId, findAllByTestId } =
        render(<SubjectPhasePicker {...curriculumPhaseOptions} />);

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const computingButton = await findAllByTitle("Computing");
      expect(computingButton).toHaveLength(1);
      await userEvent.click(computingButton[0] as HTMLElement);

      const confirmSubjectButton = getByTestId(
        "mobile-subject-picker-confirm-button",
      );
      if (!confirmSubjectButton) {
        throw new Error("Confirm subject button not found");
      }
      await userEvent.click(confirmSubjectButton);

      await waitFor(() => {
        expect(getByTestId("mobile-phase-picker-heading")).toBeInTheDocument();
      });

      const secondaryButton = await getByTitle("Secondary");
      expect(secondaryButton).toBeInTheDocument();
      if (!secondaryButton) {
        throw new Error("Secondary button not found");
      }
      await userEvent.click(secondaryButton);

      const ks4OptionsTitle = getByTestId(
        "mobile-phase-picker-ks4-option-heading",
      );
      expect(ks4OptionsTitle).toHaveTextContent("Choose an option for KS4");

      const ks4Options = await findAllByTestId(
        "mobile-phase-picker-ks4-option",
      );
      expect(ks4Options[0]).toHaveTextContent("Core");
      expect(ks4Options[1]).toHaveTextContent("AQA (Computer Science)");
      expect(ks4Options[2]).toHaveTextContent("OCR (Computer Science)");
    });

    test("shows both Core and GCSE options for Citizenship", async () => {
      const { getByTitle, findAllByTestId, findAllByTitle, getByTestId } =
        render(<SubjectPhasePicker {...curriculumPhaseOptions} />);

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const citizenshipButton = await findAllByTitle("Citizenship");
      expect(citizenshipButton).toHaveLength(1);
      await userEvent.click(citizenshipButton[0] as HTMLElement);

      const confirmSubjectButton = getByTestId(
        "mobile-subject-picker-confirm-button",
      );
      if (!confirmSubjectButton) {
        throw new Error("Confirm subject button not found");
      }
      await userEvent.click(confirmSubjectButton);

      await waitFor(() => {
        expect(getByTestId("mobile-phase-picker-heading")).toBeInTheDocument();
      });

      const secondaryButton = await getByTitle("Secondary");
      expect(secondaryButton).toBeInTheDocument();
      if (!secondaryButton) {
        throw new Error("Secondary button not found");
      }
      await userEvent.click(secondaryButton);

      await waitFor(() => {
        expect(
          getByTestId("mobile-phase-picker-ks4-option-heading"),
        ).toHaveTextContent("Choose an option for KS4");
      });

      const ks4Options = await findAllByTestId(
        "mobile-phase-picker-ks4-option",
      );
      expect(ks4Options).toHaveLength(2);

      const optionTexts = ks4Options.map((opt) => opt.textContent);
      expect(optionTexts).toContain("Core");
      expect(optionTexts).toContain("GCSE");
    });

    test("No KS4 options displayed for Geography", async () => {
      const { queryByTestId, getByTestId, findAllByTitle } = render(
        <SubjectPhasePicker {...curriculumPhaseOptions} />,
      );

      const control = getByTestId("subject-picker-button");
      await userEvent.click(control);

      const geographyButton = await findAllByTitle("Geography");
      await userEvent.click(geographyButton[0] as HTMLElement);

      const confirmSubjectButton = getByTestId(
        "mobile-subject-picker-confirm-button",
      );
      await userEvent.click(confirmSubjectButton);

      await waitFor(() => {
        expect(getByTestId("mobile-phase-picker-heading")).toBeInTheDocument();
      });
      const secondaryButton = await findAllByTitle("Secondary");
      await userEvent.click(secondaryButton[0] as HTMLElement);

      expect(
        queryByTestId("mobile-phase-picker-ks4-option-heading"),
      ).not.toBeInTheDocument();
    });

    test("populates lot picker with the correct subject and phase selections", () => {
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
          {...curriculumPhaseOptions}
          currentSelection={currentSelection}
        />,
      );
      const subjectControl = getByTitle("Subject");
      const phaseControl = getByTitle("Phase");
      expect(subjectControl).toHaveTextContent("English");
      expect(phaseControl).toHaveTextContent("Secondary");
    });
  });
});
