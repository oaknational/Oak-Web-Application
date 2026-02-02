"use client";

import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";
import {
  IntroResult,
  QuizResult,
  SectionResult,
  VideoResult,
} from "@oaknational/google-classroom-addon/dist/types";

const getOakGCAuthHeaders = async (): Promise<Headers | undefined> => {
  if (!globalThis?.cookieStore) return undefined;
  const session = (await globalThis.cookieStore.get("oak-gclassroom-session"))
    ?.value;
  const token = (await globalThis.cookieStore.get("oak-gclassroom-token"))
    ?.value;
  let headers: Headers | undefined;
  if (session && token) {
    headers = new Headers();
    headers.append("Authorization", `${token}`);
    headers.append("X-Oakgc-Session", session);
  }
  return headers;
};

const sendRequest = async <returnType, payload = undefined>(
  url: string,
  method: "GET" | "POST" = "GET",
  body?: payload,
  headers?: Headers,
): Promise<returnType> => {
  const res = await fetch(url, {
    credentials: "include",
    method,
    body: body && JSON.stringify(body),
    headers,
  });
  // should error handle
  return res.json();
};

const getGoogleSignInUrl = async (
  loginHint: string | null,
): Promise<string | null> => {
  const url = loginHint
    ? `/api/classroom/auth/sign-in?login_hint=${loginHint}`
    : `/api/classroom/auth/sign-in`;

  const data = await sendRequest<{ signInUrl: string }>(url);
  return data.signInUrl ?? null;
};

const verifySession = async (): Promise<{
  authenticated: boolean;
  session: string | undefined;
  token: string | undefined;
  userProfilePicUrl?: string;
}> => {
  console.log("VERIFYING SESSION browse", await getOakGCAuthHeaders());
  const data = await sendRequest<{
    authenticated: boolean;
    session: string | undefined;
    token: string | undefined;
    userProfilePicUrl?: string;
  }>(
    `/api/classroom/auth/verify`,
    "GET",
    undefined,
    await getOakGCAuthHeaders(),
  );
  return {
    authenticated: data.authenticated ?? false,
    session: data.session,
    token: data.token,
    userProfilePicUrl: data.userProfilePicUrl,
  };
};

const createAttachment = async (attachment: {
  courseId: string;
  itemId: string;
  addOnToken: string;
  title: string;
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
}): Promise<void> => {
  try {
    await sendRequest<
      void,
      {
        courseId: string;
        itemId: string;
        addOnToken: string;
        title: string;
        lessonSlug: string;
        programmeSlug: string;
        unitSlug: string;
      }
    >(
      `/api/classroom/attachment/create`,
      "POST",
      attachment,
      await getOakGCAuthHeaders(),
    );
    return;
  } catch (error) {
    console.error("Failed to create attachment:", error);
    throw error;
  }
};

const submitAssignment = async (attachment: {
  courseId: string;
  itemId: string;
  addOnToken: string;
  attachmentId: string;
  pointsEarned: number;
  sectionResults: LessonSectionResults;
}): Promise<void> => {
  try {
    await sendRequest<
      void,
      {
        courseId: string;
        itemId: string;
        addOnToken: string;
        attachmentId: string;
        pointsEarned: number;
        sectionResults: LessonSectionResults;
      }
    >(
      `/api/classroom/submissions`,
      "POST",
      attachment,
      await getOakGCAuthHeaders(),
    );
    return;
  } catch (error) {
    console.error("Failed to submit assignment:", error);
    throw error;
  }
};

const getClassroomSubmission = async (
  submissionId: string,
): Promise<{
  sectionResults: Partial<{
    "starter-quiz": {
      isComplete: boolean;
    } & QuizResult;
    "exit-quiz": {
      isComplete: boolean;
    } & QuizResult;
    video: {
      isComplete: boolean;
    } & VideoResult;
    intro: {
      isComplete: boolean;
    } & IntroResult;
  }>;
}> => {
  try {
    const data = await sendRequest<
      {
        sectionResults: Partial<{
          "starter-quiz": {
            isComplete: boolean;
          } & QuizResult;
          "exit-quiz": {
            isComplete: boolean;
          } & QuizResult;
          video: {
            isComplete: boolean;
          } & VideoResult;
          intro: {
            isComplete: boolean;
          } & IntroResult;
        }>;
      },
      {
        submissionId: string;
      }
    >(
      `/api/classroom/submissions?submissionId=${submissionId}`,
      "GET",
      undefined,
      await getOakGCAuthHeaders(),
    );
    return data;
  } catch (error) {
    console.error("Failed to submit assignment:", error);
    throw error;
  }
};

export default {
  getGoogleSignInUrl,
  verifySession,
  createAttachment,
  submitAssignment,
  getClassroomSubmission,
};
