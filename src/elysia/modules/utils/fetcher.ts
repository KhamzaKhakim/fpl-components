export function apiFetcher<API>(baseUrl: string) {
  return {
    async fetch<Path extends keyof API & string>(
      path: Path,
    ): Promise<API[Path]> {
      const res = await globalThis.fetch(`${baseUrl}${path}`, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error(`[${res.status}] ${res.statusText} — ${path}`);
      }

      return res.json() as Promise<API[Path]>;
    },
  };
}

export type RouteMap<R extends string, T> = {
  [K in R]: T;
};
