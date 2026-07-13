/**
 * Reads the `{ error }` body of a failed API response.
 *
 * The body may be missing, truncated or not JSON at all (a proxy 502 page, for
 * example) — that must never throw on top of the error we are already handling.
 */
export async function readError(
  response: Response
): Promise<{ error?: string }> {
  try {
    return (await response.json()) as { error?: string }
  } catch {
    return {}
  }
}
