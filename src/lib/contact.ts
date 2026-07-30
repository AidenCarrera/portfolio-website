// Enforced by the API route and mirrored onto the form inputs so the two
// cannot drift apart.
export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  message: 1000,
} as const;
