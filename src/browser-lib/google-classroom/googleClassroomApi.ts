"use client";

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
): Promise<string | null> => {
  try {
    const url = loginHint
      ? `/api/classroom/auth/sign-in?login_hint=${loginHint}`
      : `/api/classroom/auth/sign-in`;
    const data = await sendRequest<{ signInUrl: string }>(url);
    return data.signInUrl ?? null;
  } catch (error) {
    console.error("Error fetching sign-in URL:", error);
    return null;
  }
};

const verifySession = async (): Promise<{
  authenticated: boolean;
  session: string | undefined;
  token: string | undefined;
  userProfilePicUrl?: string;
}> => {
  try {
    const headers = await getOakGCAuthHeaders();
    const data = await sendRequest<{
      authenticated: boolean;
      session: string | undefined;
      token: string | undefined;
      userProfilePicUrl?: string;
    }>(`/api/classroom/auth/verify`, "GET", undefined, headers);

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

export default {
  getGoogleSignInUrl,
  verifySession,
  createAttachment,
};
