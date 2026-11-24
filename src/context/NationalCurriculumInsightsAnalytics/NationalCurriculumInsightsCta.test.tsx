import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ReactNode } from "react";

import {
  NationalCurriculumInsightsAnalyticsProvider,
  type NationalCurriculumInsightsAnalyticsPage,
} from "./NationalCurriculumInsightsAnalyticsProvider";
import {
  insightsCtaSectionContext,
  useNationalCurriculumInsightsAnalytics,
} from "./useNationalCurriculumInsightsAnalytics";
import { getDownloadSelectionCtaProperties } from "./ctaTracking";

import { analyticsContext } from "@/context/Analytics/AnalyticsProvider";
import { getMockAnalytics } from "@/context/Analytics/getMockAnalytics";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { NationalCurriculumInsightsDownload } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/Download";
import { NationalCurriculumInsightsFaq } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/sections/Faq";
import { NationalCurriculumInsightsView } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/View";
import { getNationalCurriculumInsightsRouteData } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/helpers/getRouteData";
import { localNationalCurriculumInsightsFixtures } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/__fixtures__/nationalCurriculumInsights";
import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";
import { PageName } from "@/browser-lib/avo/Avo";
import { MultiSelect } from "@/components/SharedComponents/MultiSelect";
import { NationalCurriculumInsightsPortableText } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/PortableText";
import { NationalCurriculumInsightsNewsletter } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/sections/Newsletter";

jest.mock("swr", () => ({
  __esModule: true,
  default: () => ({
    data: [
      {
        urn: "101105",
        name: "Dorothy Bricks Nursery School",
        la: "Westminster",
        postcode: "AB1 1CD",
      },
    ],
    error: null,
  }),
}));

const ctaClicked = jest.fn();
const page: NationalCurriculumInsightsAnalyticsPage = {
  pageName: PageName.NC_INSIGHTS,
  pageType: "hub",
  subjectSlug: null,
  subjectTitle: null,
  phase: null,
  keyStageSlug: null,
  keyStageTitle: null,
};
const section = {
  __typename: "NationalCurriculumInsightsDownloadSection" as const,
  barHeading: "The national curriculum is changing.",
  barCtaLabel: "Download free expert guidance.",
  detailsHeading: "Your details",
  downloadsHeading: "Downloads",
  downloadsIntroduction: "Select subjects",
  downloadButtonLabel: "Download",
};

const getData = async (segments?: string[]) => {
  const route = parseNationalCurriculumInsightsRoute(segments);
  if (!route) throw new Error("Expected a valid route");
  const data = await getNationalCurriculumInsightsRouteData(route, {
    previewMode: false,
    reader: localNationalCurriculumInsightsFixtures.reader,
  });
  if (!data) throw new Error("Expected fixture data");
  return data;
};

const analytics = () => ({
  ...getMockAnalytics(),
  track: { ...getMockAnalytics().track, ncInsightsCtaClicked: ctaClicked },
});
const renderTracked = (children: ReactNode) =>
  renderWithTheme(
    <analyticsContext.Provider value={analytics()}>
      <NationalCurriculumInsightsAnalyticsProvider page={page}>
        {children}
      </NationalCurriculumInsightsAnalyticsProvider>
    </analyticsContext.Provider>,
  );
const ids = () => ctaClicked.mock.calls.map(([properties]) => properties.ctaId);
const preventNavigation = (event: MouseEvent) => {
  if (event.target instanceof Element && event.target.closest("a"))
    event.preventDefault();
};

beforeEach(() => {
  ctaClicked.mockClear();
  window.localStorage.clear();
  document.addEventListener("click", preventNavigation);
});
afterEach(() => {
  document.removeEventListener("click", preventNavigation);
  jest.restoreAllMocks();
});

it("captures nested link targets once, with source page and article-section context", async () => {
  const user = userEvent.setup();
  renderTracked(
    <insightsCtaSectionContext.Provider
      value={{ sectionType: "rich-text", sectionId: "insights-preparation" }}
    >
      <NationalCurriculumInsightsPortableText
        value={[
          {
            _type: "block",
            _key: "paragraph",
            style: "normal",
            markDefs: [
              {
                _type: "link",
                _key: "guide",
                href: "https://example.org/guidance",
              },
            ],
            children: [
              {
                _type: "span",
                _key: "text",
                marks: ["guide"],
                text: "Read the guidance",
              },
            ],
          },
        ]}
      />
      <p>Ordinary page text</p>
    </insightsCtaSectionContext.Provider>,
  );
  await user.click(screen.getByText("Read the guidance"));
  await user.click(screen.getByText("Ordinary page text"));
  expect(ctaClicked).toHaveBeenCalledTimes(1);
  expect(ctaClicked).toHaveBeenCalledWith({
    ...page,
    pageVisitId: expect.any(String),
    platform: "owa",
    product: "curriculum resources",
    engagementIntent: "explore",
    eventVersion: "2.0.0",
    analyticsUseCase: "Teacher",
    ctaId: "inline-content-link",
    ctaText: "Read the guidance",
    ctaAction: "navigate",
    componentType: "national_curriculum",
    sectionId: "insights-preparation",
    sectionType: "rich-text",
  });
});

it("tracks real breadcrumb and phase/key-stage tab links on the page", async () => {
  const user = userEvent.setup();
  const data = await getData(["science", "primary", "key-stage-1"]);
  data.page = {
    ...data.page!,
    modules: [
      ...data.page!.modules,
      {
        __typename: "NationalCurriculumInsightsPhaseNavigationSection",
        overviewLabel: "overview",
        primaryLabel: "Primary",
        secondaryLabel: "Secondary",
      },
    ],
  };
  const { container } = renderWithTheme(
    <analyticsContext.Provider value={analytics()}>
      <NationalCurriculumInsightsView data={data} />
    </analyticsContext.Provider>,
  );
  const breadcrumb = container.querySelector('[data-insights-module="hero"] a');
  if (!breadcrumb) throw new Error("Expected a breadcrumb link");
  await user.click(breadcrumb);
  await user.click(screen.getByRole("link", { name: /KS2 changes/ }));
  await user.click(
    screen.getByRole("link", { name: /Primary Science overview/ }),
  );
  expect(ids()).toEqual(["breadcrumb-link", "key-stage-tab", "overview-tab"]);
});

it.each(["teacher", "schoolLeader"] as const)(
  "uses the checklist section type while preserving the %s section ID",
  async (audience) => {
    const user = userEvent.setup();
    const data = await getData(["science", "primary", "key-stage-1"]);
    data.page = {
      ...data.page!,
      modules: [
        {
          __typename: "NationalCurriculumInsightsChecklistSection",
          audience,
          heading: "Checklist",
          items: [],
        },
      ],
    };
    renderTracked(<NationalCurriculumInsightsView data={data} />);
    await user.click(
      screen.getByRole("button", { name: "Download this checklist" }),
    );
    expect(ctaClicked).toHaveBeenCalledTimes(1);
    expect(ctaClicked).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionType: "checklist",
        sectionId: `${audience}-checklist`,
        ctaId: "download-started",
      }),
    );
  },
);

it("captures FAQ expansion and keyboard collapse using the pre-click state", async () => {
  const user = userEvent.setup();
  renderTracked(
    <NationalCurriculumInsightsFaq
      data={await getData()}
      section={{
        __typename: "NationalCurriculumInsightsFaqSection",
        heading: "Questions",
        items: [
          { question: "When?", answerPortableText: [] },
          { question: "Where?", answerPortableText: [] },
        ],
      }}
    />,
  );
  await user.click(screen.getByRole("button", { name: /Where\?/ }));
  await user.keyboard("{Enter}");
  expect(
    ctaClicked.mock.calls.map(([properties]) => [
      properties.ctaId,
      properties.ctaAction,
    ]),
  ).toEqual([
    ["faq-toggle", "expand"],
    ["faq-toggle", "collapse"],
  ]);
});

it("does not infer tracking from markup, typing, disabled controls or unrelated clicks", async () => {
  const user = userEvent.setup();
  renderTracked(
    <section data-insights-module="newsletter">
      <label>
        Name
        <input aria-label="Name" />
      </label>
      <select aria-label="Role" name="role">
        <option value="">Choose role</option>
        <option value="teacher">Teacher</option>
      </select>
      <button type="submit" disabled>
        Sign up
      </button>
    </section>,
  );
  await user.type(screen.getByRole("textbox"), "Private person");
  await user.selectOptions(screen.getByRole("combobox"), "teacher");
  await user.click(screen.getByRole("button"));
  const outside = document.createElement("a");
  outside.href = "/outside";
  document.body.append(outside);
  fireEvent.click(outside);
  outside.remove();
  expect(ctaClicked).not.toHaveBeenCalled();
  expect(JSON.stringify(ctaClicked.mock.calls)).not.toContain("Private person");
});

const openDownloadDetails = async () => {
  const user = userEvent.setup();
  renderTracked(
    <NationalCurriculumInsightsDownload
      data={await getData()}
      section={section}
    />,
  );
  const toggle = screen.getByRole("button", {
    name: /The national curriculum is changing/,
  });
  await user.click(toggle);
  const primary = screen
    .getAllByRole("checkbox", { name: /^Science/ })
    .find(({ id }) => id.includes("science:primary"));
  if (!primary?.closest("label"))
    throw new Error("Expected Science primary checkbox");
  await user.click(primary.closest("label")!);
  await user.click(
    screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
  );
  return { user, toggle };
};

it("records a checkbox-label activation once and records Escape cancellation", async () => {
  const { user } = await openDownloadDetails();
  expect(ids()).toEqual([
    "download-started",
    "download-subject-selection",
    "download-selection-confirm",
  ]);
  expect(ctaClicked).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ ctaAction: "select" }),
  );
  await user.keyboard("{Escape}");
  expect(ids().at(-1)).toBe("download-cancelled");
});

it("tracks multiselect opening, group selection, select-all, clear-all and removing a selection", async () => {
  const user = userEvent.setup();
  const Picker = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const { trackCtaClicked } = useNationalCurriculumInsightsAnalytics();
    return (
      <section data-insights-module="downloads">
        <MultiSelect
          id="cta-subjects"
          data-testid="cta-picker"
          groups={[
            {
              value: "primary",
              label: "Primary",
              options: [{ value: "science:primary", label: "Science" }],
            },
          ]}
          selectedValues={selected}
          onChange={setSelected}
          onInteraction={(interaction) =>
            trackCtaClicked(getDownloadSelectionCtaProperties(interaction))
          }
          onMobileConfirm={() => {}}
        />
      </section>
    );
  };
  renderTracked(<Picker />);
  fireEvent.click(screen.getByTestId("cta-picker-trigger"));
  const group = document.getElementById("cta-subjects-mobile-primary-all");
  const clear = document.getElementById("cta-subjects-mobile-unselect-all");
  const all = document.getElementById("cta-subjects-mobile-select-all");
  if (!group || !clear || !all)
    throw new Error("Expected multiselect controls");
  await user.click(group);
  await user.click(clear);
  await user.click(all);
  fireEvent.click(
    screen.getAllByTestId("cta-picker-remove-science:primary")[0]!,
  );
  expect(ids()).toEqual([
    "download-subject-picker-toggle",
    "download-phase-selection",
    "download-unselect-all",
    "download-select-all",
    "download-selection-remove",
  ]);
  expect(ctaClicked).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ componentType: "download_button" }),
  );
  expect(ctaClicked).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ componentType: "signup_form" }),
  );
  expect(ctaClicked).toHaveBeenLastCalledWith(
    expect.objectContaining({ componentType: "download_button" }),
  );
});

it.each(["mouse", "keyboard"])(
  "tracks school selection by %s without exposing school details",
  async (mode) => {
    const { user } = await openDownloadDetails();
    const school = screen.getByRole("combobox", { name: "School (required)" });
    await user.type(school, "Dorothy");
    if (mode === "mouse")
      await user.click(await screen.findByTestId("listbox-option"));
    else await user.keyboard("{ArrowDown}{Enter}");
    expect(
      ids().filter((id) => id === "download-school-selection"),
    ).toHaveLength(1);
    const schoolEvent = ctaClicked.mock.calls.find(
      ([properties]) => properties.ctaId === "download-school-selection",
    )![0];
    expect(schoolEvent.ctaText).toBe("Select school or organisation");
    expect(JSON.stringify(ctaClicked.mock.calls)).not.toContain("Dorothy");
  },
);

it("distinguishes submitting a download, confirmation links and closing after success", async () => {
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => "blob:download");
  URL.revokeObjectURL = jest.fn();
  jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    headers: new Headers({ "x-filename": "Science.docx" }),
    blob: async () => new Blob(["docx"]),
  } as Response);
  try {
    const { user, toggle } = await openDownloadDetails();
    await user.type(
      screen.getByRole("textbox", { name: "Name (required)" }),
      "Private person",
    );
    await user.click(
      screen.getByRole("checkbox", { name: "My school isn't listed" }),
    );
    await user.click(screen.getByRole("radio", { name: "Headteacher" }));
    await user.click(
      screen.getByRole("checkbox", {
        name: "I accept the terms and conditions (required)",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Download 1 document (.DOCX)" }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Thanks for downloading!" }),
      ).toBeVisible(),
    );
    await user.click(screen.getByRole("link", { name: /Get in touch/ }));
    const curriculumLink = document.querySelector(
      'a[href="/teachers/curriculum"]',
    );
    if (!curriculumLink) throw new Error("Expected curriculum link");
    await user.click(curriculumLink);
    await user.click(toggle);
    expect(ids()).toEqual([
      "download-started",
      "download-subject-selection",
      "download-selection-confirm",
      "download-school-not-listed",
      "download-role-selection",
      "download-terms-acceptance",
      "submit-download",
      "download-confirmation-contact",
      "download-confirmation-curriculum",
      "download-confirmation-close",
    ]);
    expect(JSON.stringify(ctaClicked.mock.calls)).not.toContain(
      "Private person",
    );
  } finally {
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});

it("tracks the newsletter role and school selections in their own handlers", async () => {
  const user = userEvent.setup();
  const data = await getData();
  const hero = data.hub?.modules.find(
    (entry) => entry.__typename === "NationalCurriculumInsightsHeroSection",
  );
  if (!hero?.image) throw new Error("Expected fixture image");
  renderTracked(
    <NationalCurriculumInsightsNewsletter
      variant="plain"
      section={{
        __typename: "NationalCurriculumInsightsNewsletterSection",
        heading: "Stay informed",
        introduction: "Get updates",
        benefits: ["Guidance"],
        illustration: hero.image,
        privacyPortableText: [],
        buttonLabel: "Join newsletter",
      }}
    />,
  );
  await user.selectOptions(
    screen.getByRole("combobox", { name: "Role" }),
    "Headteacher",
  );
  await user.type(
    screen.getByRole("combobox", { name: "School or organisation" }),
    "Dorothy",
  );
  await user.click(await screen.findByTestId("listbox-option"));
  await user.click(
    screen.getByRole("checkbox", { name: "My school isn't listed" }),
  );
  expect(ids()).toEqual([
    "newsletter-role-selection",
    "newsletter-school-selection",
    "newsletter-school-not-listed",
  ]);
  expect(JSON.stringify(ctaClicked.mock.calls)).not.toContain("Dorothy");
});
