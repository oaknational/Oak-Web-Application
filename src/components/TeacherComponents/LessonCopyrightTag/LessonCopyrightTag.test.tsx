import { render } from "@testing-library/react";

import { LessonCopyrightTag } from "./LessonCopyrightTag";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedOut,
  mockGeorestrictedUser,
  mockNotOnboardedUser,
} from "@/__tests__/__helpers__/mockUser";

describe("LessonCopyrightTag", () => {
  test("it shows copyright tag if lesson has complex copyright and user is signed out", () => {
    setUseUserReturn(mockLoggedOut);

    const { getByText } = render(
      <LessonCopyrightTag
        lessonGeorestricted={true}
        lessonLoginRequired={true}
      />,
    );
    const copyrightTag = getByText("Copyrighted");
    expect(copyrightTag).toBeInTheDocument();
  });

  test("it shows copyrighted tag if lesson is geo restricted and user is signed in and geoblocked", () => {
    setUseUserReturn(mockGeorestrictedUser);
    const { getByText } = render(
      <LessonCopyrightTag lessonGeorestricted={true} />,
    );
    const geoRestrictedTag = getByText("Copyrighted");
    expect(geoRestrictedTag).toBeInTheDocument();
  });

  test("it does not show copyrighted tag if lesson is geo restricted and user is signed in and not geoblocked", () => {
    setUseUserReturn(mockNotOnboardedUser);
    const { queryByText } = render(
      <LessonCopyrightTag lessonGeorestricted={true} />,
    );
    const geoRestrictedTag = queryByText("Copyrighted");
    expect(geoRestrictedTag).not.toBeInTheDocument();
  });
});
