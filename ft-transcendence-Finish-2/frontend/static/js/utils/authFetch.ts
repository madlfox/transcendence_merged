import { navigateTo } from "../index";

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("auth_token");

  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let body = options.body;

  if (
    !isFormData &&
    headers.get("Content-Type") === "application/json" &&
    (options.method === "POST" || options.method === "PUT")
  ) {
    if (!body) {
      body = JSON.stringify({});
    } else if (typeof body === "object" && !(body instanceof Blob)) {
      body = JSON.stringify(body);
    }
  }

  const headersLog: Record<string, string> = {};
  headers.forEach((value, key) => {
    headersLog[key] = value;
  });

  console.log("authFetch sending:", {
    url,
    token,
    headers: headersLog
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body
    });

    if (response.status === 401 || response.status === 403) {
      console.warn("authFetch: unauthorized request", url);
      // Optional: navigateTo("/login");
    }

    return response;
  } catch (err) {
    console.error("authFetch fetch error:", err);
    return new Response(null, { status: 500 });
  }
}



/*import { navigateTo } from "../index";

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("auth_token");

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...options.headers,
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };

  
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let body = options.body;

  if (
    !isFormData &&
    headers["Content-Type"] === "application/json" &&
    (options.method === "POST" || options.method === "PUT")
  ) {
    if (!body) {
      body = JSON.stringify({});
    } else if (typeof body === "object" && !(body instanceof Blob)) {
      body = JSON.stringify(body);
    }
  }

  console.log("authFetch sending:", {
    url,
    token,
    headers
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body
    });

    if (response.status === 401 || response.status === 403) {
      console.warn("authFetch: unauthorized request", url);
      // Optional: navigateTo('/login');
    }

    return response;
  } catch (err) {
    console.error("authFetch fetch error:", err);
    return new Response(null, { status: 500 });
  }
}*/



/*import { navigateTo } from "../index.js";


interface AuthFetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, any> | null;
}

export async function authFetch(url: string, options: AuthFetchOptions = {}): Promise<Response> {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    navigateTo("/signin");
    throw new Error("Missing auth token");
  }

  const isFormData = options.body instanceof FormData;

  const headers: Headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

    if (!isFormData && !headers.has("Content-Type")) 
    headers.set("Content-Type", "application/json");
  
  if (
    !isFormData &&
    headers.get("Content-Type") === "application/json" &&
    (options.method === "POST" || options.method === "PUT")
  ) {
    if (options.body && typeof options.body === "object") {
      options.body = JSON.stringify(options.body);
    } else if (!options.body) {
      options.body = JSON.stringify({});
    }
  }


  const headersObj: Record<string, string> = {};
  headers.forEach((value, key) => {
    headersObj[key] = value;
  });

  console.log("authFetch sending:", {
    url,
    token: localStorage.getItem("auth_token"),
    headers: headersObj
  });

  try {
    const requestInit: RequestInit = {
      ...options,
      headers,
      body: options.body instanceof FormData ? options.body : options.body ? String(options.body) : null
    };

    const response = await fetch(url, requestInit);

    if (response.status === 401 || response.status === 403) {
      console.warn("authFetch: unauthorized request", url);
      if (
        !url.endsWith("/record_PvPong_match") &&
        !url.endsWith("/record_AIpong_match") &&
        !url.endsWith("/record_tournament")
      ) {
        localStorage.removeItem("auth_token");
        navigateTo("/signin");
      }
      throw new Error("Unauthorized or 2FA not verified");
    }

    return response;
  } catch (error) {
    console.error("authFetch error:", error);
    throw error;
  }
}*/



/*import { navigateTo } from "../index.js";


interface AuthFetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, any> | null;
}

export async function authFetch(url: string, options: AuthFetchOptions = {}): Promise<Response> {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    navigateTo("/signin");
    throw new Error("Missing auth token");
  }

  const isFormData = options.body instanceof FormData;

  const headers: Headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

    if (!isFormData && !headers.has("Content-Type")) 
    headers.set("Content-Type", "application/json");
  
  if (
    !isFormData &&
    headers.get("Content-Type") === "application/json" &&
    (options.method === "POST" || options.method === "PUT")
  ) {
    if (options.body && typeof options.body === "object") {
      options.body = JSON.stringify(options.body);
    } else if (!options.body) {
      options.body = JSON.stringify({});
    }
  }


  const headersObj: Record<string, string> = {};
  headers.forEach((value, key) => {
    headersObj[key] = value;
  });

  console.log("authFetch sending:", {
    url,
    token: localStorage.getItem("auth_token"),
    headers: headersObj
  });

  try {
    const requestInit: RequestInit = {
      ...options,
      headers,
      body: options.body instanceof FormData ? options.body : options.body ? String(options.body) : null
    };

    const response = await fetch(url, requestInit);

    if (response.status === 401 || response.status === 403) {
      console.warn("authFetch: unauthorized request", url);
      if (
        !url.endsWith("/record_PvPong_match") &&
        !url.endsWith("/record_AIpong_match") &&
        !url.endsWith("/record_tournament")
      ) {
        localStorage.removeItem("auth_token");
        navigateTo("/signin");
      }
      throw new Error("Unauthorized or 2FA not verified");
    }

    return response;
  } catch (error) {
    console.error("authFetch error:", error);
    throw error;
  }
}*/
