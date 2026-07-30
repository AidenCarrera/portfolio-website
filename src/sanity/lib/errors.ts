export function getSanityErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
