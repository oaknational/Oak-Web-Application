import { act, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";

import useOptionalDownloadSignUp from "../hooks/downloadAndShareHooks/useOptionalDownloadSignUp";

import LessonDownloadSignUpButtons from "./LessonDownloadSignUpButtons";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useOptionalDownloadSignUp",
);
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  SignUpButton: jest.fn(() => <button>Download & sign up</button>),
}));

const onDownloadWithoutSignUpClick = jest.fn();

const renderLessonDownloadSignUpButtons = () => {
  renderWithProviders()(
    <LessonDownloadSignUpButtons
      onDownloadWithoutSignUpClick={onDownloadWithoutSignUpClick}
    />,
  );
};

describe("LessonDownloadSignUpButtons", () => {
  describe("when logged out", () => {
    beforeEach(() => {
      setUseUserReturn(mockLoggedOut);
      (useOptionalDownloadSignUp as jest.Mock).mockImplementation(() => ({
        showDownloadSignUpButtons: true,
        showTermsAgreement: false,
        setShowTermsAgreement: jest.fn(),
      }));
    });

    test("should render a sign up button and download without signing up button", () => {
      renderLessonDownloadSignUpButtons();

      const signUpButton = screen.getByText("Download & sign up");
      expect(signUpButton).toBeInTheDocument();
      const downloadWithoutSignUpButton = screen.getByText(
        "Download without signing up",
      );
      expect(downloadWithoutSignUpButton).toBeInTheDocument();
    });

    test("should call onDownloadWithoutSignUpClick when download without signing up button is clicked", () => {
      renderLessonDownloadSignUpButtons();

      const downloadWithoutSignUpButton = screen.getByText(
        "Download without signing up",
      );
      downloadWithoutSignUpButton.click();

      expect(onDownloadWithoutSignUpClick).toHaveBeenCalled();
    });
  });

  describe("when logged in", () => {
    test("should not render buttons", () => {
      setUseUserReturn(mockLoggedIn);
      (useOptionalDownloadSignUp as jest.Mock).mockImplementation(() => ({
        showDownloadSignUpButtons: false,
        showTermsAgreement: false,
        setShowTermsAgreement: jest.fn(),
      }));

      renderLessonDownloadSignUpButtons();

      const signUpButton = screen.queryByText("Download & sign up");
      const downloadWithoutSignUpButton = screen.queryByText(
        "Download without signing up",
      );

      expect(signUpButton).not.toBeInTheDocument();
      expect(downloadWithoutSignUpButton).not.toBeInTheDocument();
    });
  });

  describe("when logged in but not onboarded", () => {
    beforeEach(() => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: {
          ...mockLoggedIn.user,
          publicMetadata: {
            owa: {
              isOnboarded: false,
            },
          },
        },
      });
      (useOptionalDownloadSignUp as jest.Mock).mockImplementation(() => ({
        showDownloadSignUpButtons: true,
        showTermsAgreement: false,
        setShowTermsAgreement: jest.fn(),
      }));
    });

    test("should render a download button", () => {
      renderLessonDownloadSignUpButtons();

      const downloadButton = screen.getByText("Download .zip");
      expect(downloadButton).toBeInTheDocument();
    });

    test("should redirect to onboarding when download button is clicked", () => {
      renderLessonDownloadSignUpButtons();

      const downloadButton = screen.getByText("Download .zip");
      act(() => {
        downloadButton.click();
      });

      expect(mockRouter.asPath).toEqual("/onboarding?returnTo=%2F");
    });
  });
});
