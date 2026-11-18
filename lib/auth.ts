import "server-only";
import { timingSafeEqual } from "node:crypto";
import { getResponse } from "./store";

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/**
 * The space code is printed on a QR code at Kunz: you need to have been there to join.
 * Fails closed when SPACE_CODE is not set.
 */
export const spaceCodeOk = (code: unknown) =>
  typeof code === "string" && !!process.env.SPACE_CODE && same(code.trim().toLowerCase(), process.env.SPACE_CODE.toLowerCase());

/** Key-holders send KEYHOLDER_CODE in the x-keyholder header. Fails closed when it is not set. */
export const isKeyholder = (req: Request) => {
  const c = req.headers.get("x-keyholder");
  return !!c && !!process.env.KEYHOLDER_CODE && same(c, process.env.KEYHOLDER_CODE);
};

/** The member making this request (x-id and x-token headers), or null. */
export async function member(req: Request) {
  const [id, token] = [req.headers.get("x-id"), req.headers.get("x-token")];
  return id && token ? getResponse(id, token) : null;
}
