import { waitFor } from "@testing-library/react";

import useTeachWithOakDownload from "./useTeachWithOakDownload";

import { createTeachWithOakDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import type { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink",
  () => ({
    __esModule: true,
    createTeachWithOakDownloadLink: jest.fn(),
  }),
);
jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

const mockPersistResourceFormDetails = jest.fn();
jest.mock("./usePersistResourceFormDetails", () => () => ({
  persistResourceFormDetails: mockPersistResourceFormDetails,
}));

const mockTeachWithOakDownloaded = jest.fn();
jest.mock("@/context/Analytics/useAnalytics.ts", () => ({
  __esModule: true,
  default: () => ({
    track: {
      teachWithOakDownloaded: (...args: unknown[]) =>
        mockTeachWithOakDownloaded(...args),
    },
  }),
}));

describe("useTeachWithOakDownload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("persists the resource form details and downloads the teach with oak resources", async () => {
    (createTeachWithOakDownloadLink as jest.Mock).mockResolvedValue(
      "download-link",
    );

    const { result } = renderHookWithProviders()(() =>
      useTeachWithOakDownload(),
    );

    const data: ResourceFormValues = {
      school: "homeschool",
      terms: true,
      resources: [],
    };

    await result.current.onSubmit({ data });

    await waitFor(() => {
      expect(mockPersistResourceFormDetails).toHaveBeenCalledWith(data);
      expect(createTeachWithOakDownloadLink).toHaveBeenCalled();
      expect(createAndClickHiddenDownloadLink).toHaveBeenCalledWith(
        "download-link",
      );
    });
  });
  it("tracks the download event", async () => {
    (createTeachWithOakDownloadLink as jest.Mock).mockResolvedValue(
      "download-link",
    );

    const { result } = renderHookWithProviders()(() =>
      useTeachWithOakDownload(),
    );

    const data: ResourceFormValues = {
      school: "homeschool",
      terms: true,
      resources: [],
    };

    await result.current.onSubmit({ data });

    await waitFor(() => {
      expect(mockTeachWithOakDownloaded).toHaveBeenCalled();
    });
  });
});
