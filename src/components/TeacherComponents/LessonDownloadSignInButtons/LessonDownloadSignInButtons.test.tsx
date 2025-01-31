import { act, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";

import useOptionalDownloadSignIn from "../hooks/downloadAndShareHooks/useOptionalDownloadSignIn";

import LessonDownloadSignInButtons from "./LessonDownloadSignInButtons";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useOptionalDownloadSignIn",
);
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  SignUpButton: jest.fn(() => <button>Download & sign in</button>),
}));

const onDownloadWithoutSignInClick = jest.fn();

const renderLessonDownloadSignInButtons = () => {
  renderWithProviders()(
    <LessonDownloadSignInButtons
      onDownloadWithoutSignInClick={onDownloadWithoutSignInClick}
    />,
  );
};

describe("LessonDownloadSignInButtons", () => {
  describe("when logged out", () => {
    beforeEach(() => {
      setUseUserReturn(mockLoggedOut);
      (useOptionalDownloadSignIn as jest.Mock).mockImplementation(() => ({
        showDownloadSignInButtons: true,
        showTermsAgreement: false,
        setShowTermsAgreement: jest.fn(),
      }));
    });

    test("should render a sign in button and download without signing in button", () => {
      renderLessonDownloadSignInButtons();

      const signInButton = screen.getByText("Download & sign in");
      expect(signInButton).toBeInTheDocument();
      const downloadWithoutSignInButton = screen.getByText(
        "Download without signing in",
      );
      expect(downloadWithoutSignInButton).toBeInTheDocument();
    });

    test("should call onDownloadWithoutSignInClick when download without signing in button is clicked", () => {
      renderLessonDownloadSignInButtons();

      const downloadWithoutSignInButton = screen.getByText(
        "Download without signing in",
      );
      downloadWithoutSignInButton.click();

      expect(onDownloadWithoutSignInClick).toHaveBeenCalled();
    });
  });

  describe("when logged in", () => {
    test("should not render buttons", () => {
      setUseUserReturn(mockLoggedIn);
      (useOptionalDownloadSignIn as jest.Mock).mockImplementation(() => ({
        showDownloadSignInButtons: false,
        showTermsAgreement: false,
        setShowTermsAgreement: jest.fn(),
      }));

      renderLessonDownloadSignInButtons();

      const signInButton = screen.queryByText("Download & sign in");
      const downloadWithoutSignInButton = screen.queryByText(
        "Download without signing in",
      );

      expect(signInButton).not.toBeInTheDocument();
      expect(downloadWithoutSignInButton).not.toBeInTheDocument();
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
      (useOptionalDownloadSignIn as jest.Mock).mockImplementation(() => ({
        showDownloadSignInButtons: true,
        showTermsAgreement: false,
        setShowTermsAgreement: jest.fn(),
      }));
    });

    test("should render a download button", () => {
      renderLessonDownloadSignInButtons();

      const downloadButton = screen.getByText("Download .zip");
      expect(downloadButton).toBeInTheDocument();
    });

    test("should redirect to onboarding when download button is clicked", () => {
      renderLessonDownloadSignInButtons();

      const downloadButton = screen.getByText("Download .zip");
      act(() => {
        downloadButton.click();
      });

      expect(mockRouter.asPath).toEqual("/onboarding?returnTo=%2F");
    });
  });
});
