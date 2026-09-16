import { renderHook, waitFor } from "@testing-library/react";

import useTeachWithOakDownload from "./useTeachWithOakDownload";

import { createTeachWithOakDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import type { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";

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

describe("useTeachWithOakDownload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("persists the resource form details and downloads the teach with oak resources", async () => {
    (createTeachWithOakDownloadLink as jest.Mock).mockResolvedValue(
      "download-link",
    );

    const { result } = renderHook(() => useTeachWithOakDownload());

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
});
