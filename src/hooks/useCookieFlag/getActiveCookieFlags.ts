import { cookies } from "next/headers";

export async function getActiveCookieFlags() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .filter(({ name }) => name.startsWith("oak-flag-"))
    .filter(({ value }) => value === "1")
    .map(({ name }) => name);
}
