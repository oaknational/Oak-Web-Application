import useLocalStorageForDownloads from "../../hooks/downloadAndShareHooks/useLocalStorageForDownloads";
import { SchoolSelectFormProps } from "../OnboardingForm.schema";

import { setOnboardingLocalStorage } from "./setOnboardingLocalStorage";

const mockLocalStorageForDownloads = {
  setSchoolInLocalStorage: vi.fn(),
  setEmailInLocalStorage: vi.fn(),
  setTermsInLocalStorage: vi.fn(),
} as unknown as ReturnType<typeof useLocalStorageForDownloads>;
const submit = vi.fn();
const data: SchoolSelectFormProps = {
  school: "123",
  schoolName: "Test School",
  newsletterSignUp: true,
  onSubmit: submit,
};
const dataManual: SchoolSelectFormProps = {
  schoolAddress: "address",
  manualSchoolName: "Manual Test School",
  newsletterSignUp: true,
  onSubmit: submit,
};
const userEmail = "test@example.com";
const userSubscribed = true;

describe("setOnboardingLocalStorage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should set school in local storage when data contains school", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data,
      userEmail,
      userSubscribed,
    });

    expect(
      mockLocalStorageForDownloads.setSchoolInLocalStorage,
    ).toHaveBeenCalledWith({
      schoolName: "Test School",
      schoolId: "123",
    });
  });

  it("should set school in local storage when data contains manualSchoolName", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data: dataManual,
      userEmail,
      userSubscribed,
    });

    expect(
      mockLocalStorageForDownloads.setSchoolInLocalStorage,
    ).toHaveBeenCalledWith({
      schoolName: "Manual Test School",
      schoolId: "Manual Test School",
    });
  });

  it("should set email in local storage when userEmail is provided and user is subscribed", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data: { ...data, manualSchoolName: "Manual Test School" },
      userEmail,
      userSubscribed: true,
    });

    expect(
      mockLocalStorageForDownloads.setEmailInLocalStorage,
    ).toHaveBeenCalledWith(userEmail);
  });

  it("should set email to empty string in local storage when userSubscribed is false", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data: { ...data, manualSchoolName: "Manual Test School" },
      userEmail,
      userSubscribed: false,
    });

    expect(
      mockLocalStorageForDownloads.setEmailInLocalStorage,
    ).toHaveBeenCalledWith("");
  });

  it("should set terms in local storage", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data: { ...data, manualSchoolName: "Manual Test School" },
      userEmail,
      userSubscribed: true,
    });
    expect(
      mockLocalStorageForDownloads.setTermsInLocalStorage,
    ).toHaveBeenCalledWith(true);
  });
});
