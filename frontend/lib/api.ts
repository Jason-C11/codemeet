async function send(
  method: string,
  url: string,
  data?: any,
  cookie?: string,
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (cookie) {
    headers["Cookie"] = cookie;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
    credentials: "include",
  });

  const contentType = res.headers.get("content-type");

  const payload =
    contentType && contentType.includes("application/json")
      ? await res.json()
      : await res.text();

  if (!res.ok) {
    throw payload;
  }

  return payload;
}

// Auth ======
export async function signup(
  username: string,
  email: string,
  password: string,
) {
  return send("POST", "/api/auth/signup", { username, email, password });
}

export async function login(email: string, password: string) {
  return send("POST", "/api/auth/login", { email, password });
}

export async function logout() {
  return send("POST", "/api/auth/logout");
}

export async function checkAuth() {
  return send("GET", "/api/auth/check");
}

// Problems ======
export async function getAllProblems() {
  return send("GET", "/api/problems/");
}

export async function getProblemById(problemId: string) {
  return send("GET", `/api/problems/${problemId}`);
}
