export const truncate = (s: string, n = 100) =>
  s.length > n ? s.slice(0, n) + "..." : s;
