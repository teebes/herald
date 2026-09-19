export function safeLoginRedirect(value: unknown): string {
  if (typeof value !== "string" || !/^\/(?!\/)/.test(value)
      || /[\\\x00-\x1f]/.test(value)) return "/lobby";
  return value;
}

export function coreAuthorizationRequest(query: Record<string, unknown>) {
  const keys = ["response_type", "client_id", "redirect_uri", "state",
    "code_challenge", "code_challenge_method"] as const;
  const params: Record<string, string> = {};
  for (const key of keys) {
    if (typeof query[key] !== "string" || !query[key]) {
      throw new Error("This Core sign-in link is incomplete. Please start again from Core.");
    }
    params[key] = query[key] as string;
  }
  if (params.response_type !== "code" || params.code_challenge_method !== "S256"
      || !/^[A-Za-z0-9_-]{43}$/.test(params.code_challenge)
      || !/^[A-Za-z0-9_-]{22,256}$/.test(params.state)
      || params.client_id.length > 128 || params.redirect_uri.length > 2048) {
    throw new Error("This Core sign-in link is invalid. Please start again from Core.");
  }
  return params;
}

export async function authorizeCore(
  query: Record<string, unknown>,
  post: (url: string, data: Record<string, string>) => Promise<{ data: { redirect_url: string } }>,
) {
  const params = coreAuthorizationRequest(query);
  const response = await post("auth/core/authorize/", params);
  const target = new URL(response.data.redirect_url);
  if (!response.data.redirect_url.startsWith(params.redirect_uri + "?")
      || target.searchParams.get("state") !== params.state
      || !/^[A-Za-z0-9_-]{43}$/.test(target.searchParams.get("code") || "")) {
    throw new Error("Core sign-in could not be completed. Please start again from Core.");
  }
  return response.data.redirect_url;
}
