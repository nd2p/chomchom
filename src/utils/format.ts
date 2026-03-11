export const truncate = (s: string, n = 100) => (s.length > n ? s.slice(0, n) + '...' : s);

export const extractAuthorFromParentheses = (title: string) => {
  const match = title.match(/\(([^()]*)\)(?!.*\()/);
  return match ? match[1].trim() : '';
};
