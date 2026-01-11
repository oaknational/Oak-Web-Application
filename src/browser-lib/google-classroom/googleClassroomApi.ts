"use client";

const getOakGCAuthHeaders = async (): Promise<Headers | undefined> => {
  if (!window?.cookieStore) return undefined;
  const session = (await window.cookieStore.get("oak-gclassroom-session"))
    ?.value;
  const token = (await window.cookieStore.get("oak-gclassroom-token"))?.value;
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
      "type" in errorData
    ) {
      throw errorData;
    }

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
  // Validate loginHint before making API call
  if (!loginHint) {
    throw new Error(
      "Login hint is required for Google Classroom sign-in. Please ensure you are accessing this page from within Google Classroom.",
    );
  }

  try {
    const url = `/api/classroom/auth/sign-in?login_hint=${loginHint}`;
    const data = await sendRequest<{ signInUrl: string }>(url);
    return data.signInUrl ?? null;
  } catch (error) {
    console.error("Error fetching sign-in URL:", error);

    // If it's an OakGoogleClassroomException, provide a user-friendly message
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "MISSING_LOGIN_HINT"
    ) {
      throw new Error(
        "Unable to authenticate: Login information is missing. Please access this page from within Google Classroom.",
      );
    }

    throw error;
  }
};

const verifySession = async (): Promise<{
  authenticated: boolean;
  session: string | undefined;
  token: string | undefined;
}> => {
  try {
    const headers = await getOakGCAuthHeaders();
    const data = await sendRequest<{
      authenticated: boolean;
      session: string | undefined;
      token: string | undefined;
    }>(`/api/classroom/auth/verify`, "GET", undefined, headers);

    return {
      authenticated: data.authenticated ?? false,
      session: data.session,
      token: data.token,
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return {
      authenticated: false,
      session: undefined,
      token: undefined,
    };
  }
};

const createAttachment = async (attachment: {
  courseId: string;
  itemId: string;
  addOnToken: string;
  title: string;
  lessonSlug: string;
  programeSlug: string;
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
        programeSlug: string;
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
