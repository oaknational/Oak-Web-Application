"use client";

import {
  UpsertPupilLessonProgressArgs,
  PupilLessonProgress,
  PostSubmissionState,
  CourseListItem,
  CourseWorkCreatedResult,
  UpsertCourseWorkPupilProgressArgs,
  CourseWorkPupilProgress,
} from "@oaknational/google-classroom-addon/types";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import { ScopeInsufficientError } from "./errors";

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
    if (
      errorData &&
      typeof errorData === "object" &&
      "code" in errorData &&
      "type" in errorData &&
      "name" in errorData &&
      errorData.name === "OakGoogleClassroomException"
    ) {
      if (errorData.code === "insufficient_scope") {
        throw new ScopeInsufficientError();
      }
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

export type GetPostSubmissionStateArgs = {
  courseId: string;
  itemId: string;
  attachmentId: string;
  submissionId: string;
};

export type GetPostSubmissionStateResponse = {
  submissionState: PostSubmissionState;
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

const getPostSubmissionState = async (
  args: GetPostSubmissionStateArgs,
): Promise<GetPostSubmissionStateResponse | null> => {
  try {
    const params = new URLSearchParams();
    params.set("submissionId", args.submissionId);
    params.set("itemId", args.itemId);
    params.set("attachmentId", args.attachmentId);
    params.set("courseId", args.courseId);
    const headers = await getOakGCAuthHeaders(true);

    return await sendRequest<GetPostSubmissionStateResponse>(
      `/api/classroom/submission?${params.toString()}`,
      "GET",
      undefined,
      headers,
    );
  } catch (error) {
    console.error("Failed to fetch pupil submission state:", error);
    return null;
  }
};

// ── Teacher: CourseWork ──────────────────────────────────────────────────────

const COURSEWORK_API_ROUTES = {
  courses: "/api/classroom/coursework/courses",
  create: "/api/classroom/coursework/create",
  context: "/api/classroom/coursework/context",
  progress: "/api/classroom/coursework/progress",
  turnin: "/api/classroom/coursework/turnin",
  results: "/api/classroom/coursework/results",
} as const;

type CreateCourseWorkArgs = {
  courseId: string;
  title: string;
  description?: string;
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  maxPoints: number;
};

const listCourses = async (): Promise<CourseListItem[]> => {
  const headers = await getOakGCAuthHeaders();
  const data = await sendRequest<{ courses: CourseListItem[] }>(
    COURSEWORK_API_ROUTES.courses,
    "GET",
    undefined,
    headers,
  );
  return data.courses;
};

const createCourseWork = async (
  args: CreateCourseWorkArgs,
): Promise<CourseWorkCreatedResult & { assignmentToken: string }> => {
  const headers = await getOakGCAuthHeaders();
  return sendRequest<
    CourseWorkCreatedResult & { assignmentToken: string },
    CreateCourseWorkArgs
  >(COURSEWORK_API_ROUTES.create, "POST", args, headers);
};

// ── Pupil: CourseWork ────────────────────────────────────────────────────────

export type CourseWorkContextResponse = {
  courseWorkId: string;
  courseId: string;
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  submissionId?: string;
};

const getCourseWorkContext = async (
  assignmentToken: string,
): Promise<CourseWorkContextResponse | null> => {
  try {
    const headers = await getOakGCAuthHeaders(true);
    const params = new URLSearchParams({ assignmentToken });
    return await sendRequest<CourseWorkContextResponse>(
      `${COURSEWORK_API_ROUTES.context}?${params.toString()}`,
      "GET",
      undefined,
      headers,
    );
  } catch (error) {
    console.error("Failed to get coursework context:", error);
    return null;
  }
};

const upsertCourseWorkProgress = async (
  args: UpsertCourseWorkPupilProgressArgs,
): Promise<void> => {
  const headers = await getOakGCAuthHeaders(true);
  await sendRequest<void, UpsertCourseWorkPupilProgressArgs>(
    COURSEWORK_API_ROUTES.progress,
    "POST",
    args,
    headers,
  );
};

const turnInCourseWork = async (assignmentToken: string): Promise<void> => {
  const headers = await getOakGCAuthHeaders(true);
  await sendRequest<void, { assignmentToken: string }>(
    COURSEWORK_API_ROUTES.turnin,
    "POST",
    { assignmentToken },
    headers,
  );
};

const getCourseWorkProgress = async (
  submissionId: string,
  assignmentToken: string,
): Promise<CourseWorkPupilProgress | null> => {
  try {
    const headers = await getOakGCAuthHeaders(true);
    const params = new URLSearchParams({ submissionId, assignmentToken });
    return await sendRequest<CourseWorkPupilProgress>(
      `${COURSEWORK_API_ROUTES.progress}?${params.toString()}`,
      "GET",
      undefined,
      headers,
    );
  } catch (error) {
    console.error("Failed to get coursework progress:", error);
    return null;
  }
};

export type CourseWorkResultsResponse = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  pupilProgress: CourseWorkPupilProgress | null;
};

const getCourseWorkResults = async (
  assignmentToken: string,
  submissionId: string,
): Promise<CourseWorkResultsResponse | null> => {
  try {
    const headers = await getOakGCAuthHeaders();
    const params = new URLSearchParams({ assignmentToken, submissionId });
    return await sendRequest<CourseWorkResultsResponse>(
      `${COURSEWORK_API_ROUTES.results}?${params.toString()}`,
      "GET",
      undefined,
      headers,
    );
  } catch (error) {
    console.error("Failed to get coursework results:", error);
    return null;
  }
};

const hasTeacherCookies = async (): Promise<boolean> => {
  const headers = await getOakGCAuthHeaders();
  return headers !== undefined;
};

export default {
  getGoogleSignInUrl,
  verifySession,
  hasTeacherCookies,
  createAttachment,
  getAddOnContext,
  submitPupilProgress,
  getPupilLessonProgress,
  getPostSubmissionState,
  listCourses,
  createCourseWork,
  getCourseWorkContext,
  upsertCourseWorkProgress,
  getCourseWorkProgress,
  getCourseWorkResults,
  turnInCourseWork,
};
