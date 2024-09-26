import useLocalStorageForDownloads from "../hooks/downloadAndShareHooks/useLocalStorageForDownloads";

import { SchoolSelectFormProps } from "./OnboardingForm.schema";
import { setOnboardingLocalStorage } from "./setOnboardingLocalStorage";

const mockLocalStorageForDownloads = {
  setSchoolInLocalStorage: jest.fn(),
  setEmailInLocalStorage: jest.fn(),
  setTermsInLocalStorage: jest.fn(),
} as unknown as ReturnType<typeof useLocalStorageForDownloads>;

describe("setOnboardingLocalStorage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set school in local storage when data contains school", () => {
    const data = {
      school: "123",
      schoolName: "Test School",
      newsletterSignUp: true,
    } as unknown as SchoolSelectFormProps;
    const userEmail = "test@example.com";
    const newsletterSignUp = true;

    setOnboardingLocalStorage(
      mockLocalStorageForDownloads,
      newsletterSignUp,
      data,
      userEmail,
      false,
    );

    expect(
      mockLocalStorageForDownloads.setSchoolInLocalStorage,
    ).toHaveBeenCalledWith({
      schoolName: "Test School",
      schoolId: "123",
    });
  });

  it("should set school in local storage when data contains manualSchoolName", () => {
    const data = {
      manualSchoolName: "Manual Test School",
      schoolAddress: "Test Address",
      newsletterSignUp: true,
    } as unknown as SchoolSelectFormProps;
    const userEmail = "test@example.com";
    const newsletterSignUp = true;

    setOnboardingLocalStorage(
      mockLocalStorageForDownloads,
      newsletterSignUp,
      data,
      userEmail,
      false,
    );

    expect(
      mockLocalStorageForDownloads.setSchoolInLocalStorage,
    ).toHaveBeenCalledWith({
      schoolName: "Manual Test School",
      schoolId: "Manual Test School",
    });
  });

  it("should set email in local storage when userEmail is provided and user is subscribed", () => {
    const data = {
      school: "123",
      newsletterSignUp: true,
    } as unknown as SchoolSelectFormProps;
    const userEmail = "test@example.com";
    const newsletterSignUp = true;
    const userSubscribedInHubspot = true;

    setOnboardingLocalStorage(
      mockLocalStorageForDownloads,
      newsletterSignUp,
      data,
      userEmail,
      userSubscribedInHubspot,
    );

    expect(
      mockLocalStorageForDownloads.setEmailInLocalStorage,
    ).toHaveBeenCalledWith(userEmail);
  });

  it("should not set email in local storage when userEmail is not provided", () => {
    const data = {
      school: "123",
      newsletterSignUp: true,
    } as unknown as SchoolSelectFormProps;
    const newsletterSignUp = true;

    setOnboardingLocalStorage(
      mockLocalStorageForDownloads,
      newsletterSignUp,
      data,
    );

    expect(
      mockLocalStorageForDownloads.setEmailInLocalStorage,
    ).not.toHaveBeenCalled();
  });

  it("should set terms in local storage", () => {
    const data = {
      school: "123",
      newsletterSignUp: true,
    } as unknown as SchoolSelectFormProps;
    const userEmail = "test@example.com";
    const newsletterSignUp = true;

    setOnboardingLocalStorage(
      mockLocalStorageForDownloads,
      newsletterSignUp,
      data,
      userEmail,
      false,
    );

    expect(
      mockLocalStorageForDownloads.setTermsInLocalStorage,
    ).toHaveBeenCalledWith(true);
  });
});
