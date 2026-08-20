import { cookies } from "next/headers";

export async function getCookieFlags() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .filter(({ name }) => name.startsWith("oak-flag-"))
    .filter(({ value }) => value === "1")
    .map(({ name }) => name);
}
