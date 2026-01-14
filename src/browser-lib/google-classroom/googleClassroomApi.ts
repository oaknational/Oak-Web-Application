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
}> => {
  const data = await sendRequest<{
    authenticated: boolean;
    session: string | undefined;
    token: string | undefined;
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
  };
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
