const API_BASE = "https://fantasy.premierleague.com/api/entry";

export async function fplFetch(path: string, options?: RequestInit) {
  console.log(`${API_BASE}${path}`);
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
