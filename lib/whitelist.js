// Add users to the ALLOWED_USERS env var in Vercel (comma-separated)
// e.g. ALLOWED_USERS=lilsantah,anotheruser,someone
const WHITELIST = (process.env.ALLOWED_USERS || 'lilsantah')
  .split(',')
  .map(u => u.trim().toLowerCase())
  .filter(Boolean);

export function isAllowed(username) {
  if (!username) return false;
  return WHITELIST.includes(username.toLowerCase());
}
