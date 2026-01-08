const sendRequest = async <returnType, payload = undefined>(
  url: string,
  method: "GET" | "POST" = "GET",
  body?: payload,
): Promise<returnType> => {
  const res = await fetch(url, {
    credentials: "include",
    method,
    body: body && JSON.stringify(body),
  });
  // todo: error handling
  return res.json();
};

const getGoogleSignInUrl = async (
  loginHint: string | null,
): Promise<string | null> => {
  if (!loginHint) return null;
  const data = await sendRequest<{ signInUrl: string }>(
    `/api/classroom/auth/sign-in?login_hint=${loginHint}`,
  );
  return data.signInUrl ?? null;
};

const verifySession = async (
  session: string,
): Promise<{ authenticated: boolean }> => {
  const data = await sendRequest<
    { authenticated: boolean },
    { session: string }
  >(`/api/classroom/auth/verify`, "POST", { session });
  return { authenticated: data.authenticated ?? false };
};

export default {
  getGoogleSignInUrl,
  verifySession,
};
