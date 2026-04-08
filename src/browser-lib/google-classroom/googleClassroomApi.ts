"use client";

import {
  CourseListItem,
  CourseWorkCreatedResult,
  CourseWorkPupilProgress,
  UpsertCourseWorkPupilProgressArgs,
  UpsertPupilLessonProgressArgs,
  PupilLessonProgress,
} from "@oaknational/google-classroom-addon/types";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import {
  ScopeInsufficientError,
  handleCourseWorkApiError,
} from "./errorHandling";

export { ScopeInsufficientError };

const getOakGCAuthHeaders = async (
  isPupil?: boolean,
): Promise<Headers | undefined> => {
  if (!globalThis?.cookieStore) return undefined;
  const session = (
    await globalThis.cookieStore.get(
      isPupil ? AuthCookieKeys.PupilSession : AuthCookieKeys.Session,
    )
  )?.value;
  const token = (
    await globalThis.cookieStore.get(
      isPupil ? AuthCookieKeys.PupilAccessToken : AuthCookieKeys.AccessToken,
    )
  )?.value;
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

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }
    // If is an OakGoogleClassroomException, throw as is
    if (
      errorData &&
      typeof errorData === "object" &&
      "code" in errorData &&
      "type" in errorData &&
      "name" in errorData &&
      errorData.name === "OakGoogleClassroomException"
    ) {
      throw errorData;
    }
    // catch other errors
    throw new Error(
      errorData?.error ||
        errorData?.details ||
        `Request failed with status ${res.status}`,
    );
  }

  return res.json();
};

const getGoogleSignInUrl = async (
  loginHint: string | null,
  subscribeToNewsletter?: boolean,
  isPupil?: boolean,
): Promise<string | null> => {
  try {
    const basePath = "/api/classroom/auth/sign-in";
    const searchParams = new URLSearchParams();

    if (loginHint) searchParams.append("login_hint", loginHint);
    if (isPupil) searchParams.append("is_pupil", "true");
    if (subscribeToNewsletter)
      searchParams.set("subscribeToNewsletter", "true");

    const paramsString = searchParams.toString();
    const url = paramsString ? `${basePath}?${paramsString}` : basePath;

    const data = await sendRequest<{ signInUrl: string }>(url);
    return data.signInUrl ?? null;
  } catch (error) {
    console.error("Error fetching sign-in URL:", error);
    return null;
  }
};

const verifySession =
  (isPupil?: boolean) =>
  async (): Promise<{
    authenticated: boolean;
    session: string | undefined;
    token: string | undefined;
    userProfilePicUrl?: string;
    loginHint?: string;
  }> => {
    try {
      const headers = await getOakGCAuthHeaders(isPupil);

      const data = await sendRequest<{
        authenticated: boolean;
        session: string | undefined;
        token: string | undefined;
        userProfilePicUrl?: string;
        loginHint?: string;
      }>("/api/classroom/auth/verify", "GET", undefined, headers);

      return {
        authenticated: data.authenticated ?? false,
        session: data.session,
        token: data.token,
        userProfilePicUrl: data.userProfilePicUrl,
        loginHint: data.loginHint,
      };
    } catch (error) {
      console.error("Session verification error:", error);
      return {
        authenticated: false,
        session: undefined,
        token: undefined,
        userProfilePicUrl: undefined,
      };
    }
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

export type AddOnContextResponse = {
  studentContext?: {
    submissionId: string;
  };
  pupilLoginHint: string;
  teacherLoginHint?: string | null;
};
export type AddOnContextArgs = {
  courseId: string;
  itemId: string;
  attachmentId: string;
};

const getAddOnContext = async (
  args: AddOnContextArgs,
): Promise<AddOnContextResponse | null> => {
  try {
    const headers = await getOakGCAuthHeaders(true);
    return await sendRequest<AddOnContextResponse, AddOnContextArgs>(
      "/api/classroom/context",
      "POST",
      args,
      headers,
    );
  } catch (error) {
    console.error("Failed to get add-on context:", error);
    return null;
  }
};

const submitPupilProgress = async (
  args: UpsertPupilLessonProgressArgs,
): Promise<void> => {
  const headers = await getOakGCAuthHeaders(true);
  await sendRequest<void, UpsertPupilLessonProgressArgs>(
    "/api/classroom/pupil/progress/submit",
    "POST",
    args,
    headers,
  );
};

type GetPupilLessonProgressArgs = {
  submissionId: string;
  itemId: string;
  attachmentId: string;
};
const getPupilLessonProgress = async (
  args: GetPupilLessonProgressArgs,
): Promise<PupilLessonProgress | null> => {
  try {
    const params = new URLSearchParams();
    params.set("submissionId", args.submissionId);
    params.set("itemId", args.itemId);
    params.set("attachmentId", args.attachmentId);
    return await sendRequest<PupilLessonProgress | null>(
      `/api/classroom/pupil/progress?${params.toString()}`,
      "GET",
      undefined,
      await getOakGCAuthHeaders(),
    );
  } catch (error) {
    console.error("Failed to fetch pupil lesson progress:", error);
    return null;
  }
};

export type CourseWorkContextResponse = {
  submissionId: string;
  courseId: string;
  courseWorkId: string;
  assignmentToken: string;
};

export type CreateCourseWorkRequest = {
  courseId: string;
  title: string;
  description?: string;
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  maxPoints?: number;
};

const listCourses = async (): Promise<CourseListItem[]> => {
  try {
    const headers = await getOakGCAuthHeaders();
    const data = await sendRequest<{ courses: CourseListItem[] }>(
      "/api/classroom/courses",
      "GET",
      undefined,
      headers,
    );
    return data.courses;
  } catch (error) {
    return handleCourseWorkApiError(error);
  }
};

const createCourseWork = async (
  args: CreateCourseWorkRequest,
): Promise<CourseWorkCreatedResult & { assignmentToken: string }> => {
  try {
    const headers = await getOakGCAuthHeaders();
    return await sendRequest<
      CourseWorkCreatedResult & { assignmentToken: string },
      CreateCourseWorkRequest
    >("/api/classroom/coursework/create", "POST", args, headers);
  } catch (error) {
    return handleCourseWorkApiError(error);
  }
};

const getCourseWorkContext = async (
  assignmentToken: string,
): Promise<CourseWorkContextResponse | null> => {
  try {
    const headers = await getOakGCAuthHeaders(true);
    const params = new URLSearchParams({ assignmentToken });
    return await sendRequest<CourseWorkContextResponse>(
      `/api/classroom/coursework/context?${params.toString()}`,
      "GET",
      undefined,
      headers,
    );
  } catch (error) {
    console.error("Failed to get coursework context:", error);
    return null;
  }
};

const upsertCourseWorkPupilProgress = async (
  args: UpsertCourseWorkPupilProgressArgs,
): Promise<void> => {
  const headers = await getOakGCAuthHeaders(true);
  await sendRequest<void, UpsertCourseWorkPupilProgressArgs>(
    "/api/classroom/coursework/pupil/progress",
    "POST",
    args,
    headers,
  );
};

const getCourseWorkPupilProgress = async (
  submissionId: string,
  assignmentToken: string,
): Promise<CourseWorkPupilProgress | null> => {
  try {
    const params = new URLSearchParams({ submissionId, assignmentToken });
    return await sendRequest<CourseWorkPupilProgress | null>(
      `/api/classroom/coursework/pupil/progress?${params.toString()}`,
    );
  } catch (error) {
    console.error("Failed to fetch coursework pupil progress:", error);
    return null;
  }
};

type TurnInCourseWorkSubmissionArgs = {
  courseId: string;
  courseWorkId: string;
  submissionId: string;
  assignmentToken: string;
};

const turnInCourseWorkSubmission = async (
  args: TurnInCourseWorkSubmissionArgs,
): Promise<void> => {
  const headers = await getOakGCAuthHeaders(true);
  await sendRequest<void, TurnInCourseWorkSubmissionArgs>(
    "/api/classroom/coursework/pupil/turnin",
    "POST",
    args,
    headers,
  );
};

type CourseWorkLessonInfo = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
};

const getCourseWorkLessonInfo = async (
  assignmentToken: string,
): Promise<CourseWorkLessonInfo | null> => {
  try {
    const params = new URLSearchParams({ assignmentToken });
    return await sendRequest<CourseWorkLessonInfo>(
      `/api/classroom/coursework/lesson-info?${params.toString()}`,
    );
  } catch (error) {
    console.error("Failed to fetch coursework lesson info:", error);
    return null;
  }
};

export default {
  getGoogleSignInUrl,
  verifySession,
  createAttachment,
  getAddOnContext,
  submitPupilProgress,
  getPupilLessonProgress,
  listCourses,
  createCourseWork,
  getCourseWorkContext,
  upsertCourseWorkPupilProgress,
  getCourseWorkPupilProgress,
  turnInCourseWorkSubmission,
  getCourseWorkLessonInfo,
};
