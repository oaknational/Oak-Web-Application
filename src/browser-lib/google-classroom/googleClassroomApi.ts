"use client";

import {
  UpsertPupilLessonProgressArgs,
  PupilLessonProgress,
} from "@oaknational/google-classroom-addon/types";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

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
  }> => {
    try {
      const headers = await getOakGCAuthHeaders(isPupil);

      const data = await sendRequest<{
        authenticated: boolean;
        session: string | undefined;
        token: string | undefined;
        userProfilePicUrl?: string;
      }>("/api/classroom/auth/verify", "GET", undefined, headers);

      return {
        authenticated: data.authenticated ?? false,
        session: data.session,
        token: data.token,
        userProfilePicUrl: data.userProfilePicUrl,
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

export default {
  getGoogleSignInUrl,
  verifySession,
  createAttachment,
  getAddOnContext,
  submitPupilProgress,
  getPupilLessonProgress,
};
