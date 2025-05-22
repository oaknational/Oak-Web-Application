import { render } from "@testing-library/react";

import PupilLessonListingPage, {
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { lessonBrowseDataByKsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseDataByKs.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { PupilViewsLessonListing } from "@/components/PupilViews/PupilLessonListing/PupilLessonListing.view";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";

interface MockLocation {
  href: string;
  assign: jest.Mock;
  reload: jest.Mock;
  replace: jest.Mock;
  // Add other methods and properties if needed
}

jest.mock(
  "@/components/PupilViews/PupilLessonListing/PupilLessonListing.view",
  () => ({
    PupilViewsLessonListing: jest.fn((props) => (
      <div>
        {props.orderedCurriculumData.map(
          (data: LessonListingBrowseData[number]) => {
            return <div>{data.lessonData.title}</div>;
          },
        )}
      </div>
    )),
  }),
);

// Explicitly assert the type as a Jest mock
const MockPupilViewsLessonListing = PupilViewsLessonListing as jest.Mock;

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/index", () => {
  const originalLocation: Location = window.location;
  let mockLocation: MockLocation;

  beforeEach(() => {
    // Create a mock location object
    mockLocation = {
      href: "https://original.com",
      assign: jest.fn(),
      reload: jest.fn(),
      replace: jest.fn(),
    };

    // Override the window.location with the mock object using type casting
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    //mock console.error to prevent it from being called
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Reset document.referrer after each test to avoid side effects
    Object.defineProperty(document, "referrer", {
      value: undefined,
      configurable: true,
    });
    // Restore the original window.location object after each test
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });

    jest.clearAllMocks();
  });

  describe("renders", () => {
    it("should throw an error if no data", () => {
      expect(() => {
        render(
          <PupilLessonListingPage
            browseData={[]}
            backLink={{ programmeSlug: "english" }}
          />,
        );
      }).toThrow("unitData or programmeFields is undefined");
    });

    it("should call PupilViewsLessonListing with the provided backlink when the referrer is unavailable", () => {
      // mock document referrer
      Object.defineProperty(document, "referrer", {
        value: "",
        configurable: true,
      });

      render(
        <PupilLessonListingPage
          browseData={[lessonBrowseDataFixture({})]}
          backLink={{ programmeSlug: "english-secondary-year-10" }}
        />,
      );

      // Get all the calls made to PupilViewsLessonListing
      const calls = MockPupilViewsLessonListing.mock.calls.filter((call) =>
        Boolean(call[0]?.backLink),
      );

      expect.assertions(calls.length + 1);

      // Ensure that at least qualifying one call has been made
      expect(calls.length).toBeGreaterThan(0);

      // Ensure that all qualifying calls have the correct backlink
      calls.forEach((call) => {
        const callArgs = call[0];
        expect(callArgs).toEqual(
          expect.objectContaining({
            backLink: "/pupils/programmes/english-secondary-year-10/units",
          }),
        );
      });
    });

    it("should call PupilViewsLessonListing with the referrer as the backlink when available", () => {
      const referrer =
        "https://example.com/programmes/english-secondary-year-10/units";

      // mock document referrer
      Object.defineProperty(document, "referrer", {
        value: referrer,
        configurable: true,
      });

      Object.defineProperty(window.location, "href", {
        value:
          "https://example.com/programmes/english-secondary-year-10/units/unit-slug/lessons",
        writable: true,
      });

      render(
        <PupilLessonListingPage
          browseData={[lessonBrowseDataFixture({})]}
          backLink={{ programmeSlug: "english" }}
        />,
      );

      // Get all the calls made to PupilViewsLessonListing
      const calls = MockPupilViewsLessonListing.mock.calls.filter((call) =>
        Boolean(call[0]?.backLink),
      );

      expect.assertions(2);

      // Ensure that 2 calls have been made
      expect(calls.length).toEqual(2);

      // we expect the second call to be the correct one
      expect(calls[1][0]).toEqual(
        expect.objectContaining({
          backLink: referrer,
        }),
      );
    });

    it("should call PupilViewsLessonListing with correct props", () => {
      render(
        <PupilLessonListingPage
          browseData={[lessonBrowseDataFixture({})]}
          backLink={{ programmeSlug: "english" }}
        />,
      );
      expect.assertions(1);
      expect(PupilViewsLessonListing).toHaveBeenCalled();
    });

    it("should call PupilViewsLessonListing with correctly ordered lessons", () => {
      const { getByText } = render(
        <PupilLessonListingPage
          browseData={[
            lessonBrowseDataFixture({
              lessonData: {
                ...lessonBrowseDataByKsFixture({}).lessonData,
                title: "lesson-title-2",
              },
              supplementaryData: { orderInUnit: 2, unitOrder: 4 },
            }),
            lessonBrowseDataFixture({
              lessonData: {
                ...lessonBrowseDataFixture({}).lessonData,
                title: "lesson-title-1",
              },
              supplementaryData: { orderInUnit: 1, unitOrder: 4 },
            }),
          ]}
          backLink={{ programmeSlug: "english" }}
        />,
      );
      const e1 = getByText("lesson-title-1");
      const e2 = getByText("lesson-title-2");
      expect(e2.compareDocumentPosition(e1)).toBe(2);
    });
  });

  describe("getStaticProps", () => {
    it("Should call API:pupilLessonListingQuery", async () => {
      const programmeSlug = "english-secondary-year-10";
      const unitSlug = "unit-slug";

      await getStaticProps({
        params: {
          programmeSlug,
          unitSlug,
        },
      });

      expect(
        curriculumApi2023.default.pupilLessonListingQuery,
      ).toHaveBeenCalledWith({
        programmeSlug,
        unitSlug,
      });
    });

    it("should return the programmeSlug as the backlink for non-legacy programmes", async () => {
      const programmeSlug = "english-secondary-year-10";
      const unitSlug = "unit-slug";

      const res = await getStaticProps({
        params: {
          programmeSlug,
          unitSlug,
        },
      });

      if ("props" in res) {
        expect(res.props.backLink).toEqual({ programmeSlug });
      } else {
        throw new Error("getStaticProps did not return props.");
      }
    });

    it("should return the non-legacy programmeSlug as the backlink for legacy programmes with a non-legacy equivalent", async () => {
      const programmeSlug = "english-secondary-year-10-l";
      const unitSlug = "unit-slug";

      // mock the return value of the API call
      (
        curriculumApi2023.default.pupilLessonListingQuery as jest.Mock
      ).mockResolvedValue({
        browseData: [lessonBrowseDataByKsFixture({})],
        backLinkData: [{ programmeSlug: "english-secondary-year-10" }],
      });

      const res = await getStaticProps({
        params: {
          programmeSlug,
          unitSlug,
        },
      });

      if ("props" in res) {
        expect(res.props.backLink).toEqual({
          programmeSlug: "english-secondary-year-10",
        });
      } else {
        throw new Error("getStaticProps did not return props.");
      }
    });

    it("should return the baseSlug as the backlink for legacy programmes without a non-legacy equivalent where there are multiple entries in backLinkData", async () => {
      const programmeSlug = "english-secondary-year-10-l";
      const unitSlug = "unit-slug";

      // mock the return value of the API call
      (
        curriculumApi2023.default.pupilLessonListingQuery as jest.Mock
      ).mockResolvedValue({
        browseData: [lessonBrowseDataByKsFixture({})],
        backLinkData: [
          { programmeSlug: "english-secondary-year-10-aqa" },
          { programmeSlug: "english-secondary-year-10-ocr" },
        ],
      });

      const res = await getStaticProps({
        params: {
          programmeSlug,
          unitSlug,
        },
      });

      if ("props" in res) {
        expect(res.props.backLink).toEqual({
          programmeSlug: "english-secondary-year-10",
          options: true,
        });
      } else {
        throw new Error("getStaticProps did not return props.");
      }
    });

    it("should return the non-legacy programmeSlug as the backlink for legacy programmes without a non-legacy equivalent where there is a single entry in backLinkData", async () => {
      const programmeSlug = "english-secondary-year-10-aqa-l";
      const unitSlug = "unit-slug";

      // mock the return value of the API call
      (
        curriculumApi2023.default.pupilLessonListingQuery as jest.Mock
      ).mockResolvedValue({
        browseData: [lessonBrowseDataByKsFixture({})],
        backLinkData: [{ programmeSlug: "english-secondary-year-10" }],
      });

      const res = await getStaticProps({
        params: {
          programmeSlug,
          unitSlug,
        },
      });

      if ("props" in res) {
        expect(res.props.backLink).toEqual({
          programmeSlug: "english-secondary-year-10",
        });
      } else {
        throw new Error("getStaticProps did not return props.");
      }
    });
  });

  it("falls back to the legacy programmeSlug if there are no non-legacy backlinks", async () => {
    const programmeSlug = "english-secondary-year-10-l";
    const unitSlug = "unit-slug";

    // mock the return value of the API call
    (
      curriculumApi2023.default.pupilLessonListingQuery as jest.Mock
    ).mockResolvedValue({
      browseData: [lessonBrowseDataByKsFixture({})],
      backLinkData: [],
    });

    const res = await getStaticProps({
      params: {
        programmeSlug,
        unitSlug,
      },
    });

    if ("props" in res) {
      expect(res.props.backLink).toEqual({ programmeSlug });
    } else {
      throw new Error("getStaticProps did not return  props.");
    }
  });
});
