import { nanoid } from "nanoid";
import Cookies from "js-cookie";

export const generateShareId = (): string => {
  const id = nanoid();
  Cookies.set("sid", id, { expires: 365 });
  return id;
};
