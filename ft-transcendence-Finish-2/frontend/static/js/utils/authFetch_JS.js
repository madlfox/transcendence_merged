import { navigateTo } from "../index.js";

export async function authFetch(url, options = {}) {


  /*const allowAnonymous = [
    "/api/record_PvPong_match",
    "/api/record_AIpong_match",
    "/api/record_tournament",
    "/api/profile"
  ];
  
  if ((response.status === 401 || response.status === 403) && allowAnonymous.some(p => url.endsWith(p))) {
    console.warn("authFetch: anonymous access to protected endpoint:", url);
    return response; // don't throw
  }*/


  const token = localStorage.getItem("auth_token");

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...options.headers,
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (
    !isFormData &&
    headers["Content-Type"] === "application/json" &&
    (options.method === "POST" || options.method === "PUT") &&
    !options.body
  ) {
    options.body = JSON.stringify({});
  }

  console.log("authFetch sending:", {
    url,
    token,
    headers
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401 || response.status === 403) {
      console.warn("authFetch: unauthorized request", url);
    }

    return response;
  } catch (err) {
    console.error("authFetch fetch error:", err);
    return new Response(null, { status: 500 });
  }
}



/*// utils/authFetch.js
import { navigateTo } from "../index.js";

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    console.warn("authFetch called with no token on URL:", url);
    console.trace();  // <-- this prints the call stack
  }
  
  const protectedRoutes = [
    "/api/record_PvPong_match",
    "/api/record_AIpong_match",
    "/api/record_tournament",
    "/api/profile",
    "/api/friends_list",
    "/api/signUpBack",
    "/api/signInBack",
    "/api/profileBack",
    "/api/signOutBack",
    "/api/userAvatarBack",
    "/api/updateUserBack",
    "/api/usersListBack",
    "/api/friendsBack",
    "/api/pong",
    "/api/pongStats",
    "/api/verify-2fa",
    "/api/setup-2fa",
    "/api/enable-2fa",
    "/api/googleLoginBack"
  ];

  const isProtected = protectedRoutes.some(p => url.endsWith(p));

  // Redirect only if the endpoint is protected and token is missing
  if (!token && isProtected) {
    console.warn("No auth token — redirecting to signin");
    navigateTo("/signin");
    throw new Error("Missing auth token");
  }

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...options.headers,
    ...(token && { "Authorization": `Bearer ${token}` })
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (
    !isFormData &&
    headers["Content-Type"] === "application/json" &&
    (options.method === "POST" || options.method === "PUT") &&
    !options.body
  ) {
    options.body = JSON.stringify({});
  }

  console.log("authFetch sending:", {
    url,
    token: localStorage.getItem("auth_token"),
    headers
  });

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    console.warn("authFetch: unauthorized request", url);
    if (isProtected) {
      localStorage.removeItem("auth_token");
      navigateTo("/signin");
    }
    throw new Error("Unauthorized or 2FA not verified");
  }

  return response;
}*/



/*// utils/authFetch.js
import { navigateTo } from "../index.js";

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    navigateTo("/signin");
    throw new Error("Missing auth token");
  }

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`
  };

  // Set default Content-Type for JSON if not a FormData
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // 🛠 Fix: If JSON request has no body, set body = "{}"
  if (
    !isFormData &&
    headers["Content-Type"] === "application/json" &&
    (options.method === "POST" || options.method === "PUT") &&
    !options.body
  ) {
    options.body = JSON.stringify({});
  }

  console.log("authFetch sending:", {
    url,
    token: localStorage.getItem("auth_token"),
    headers
  });
  const response = await fetch(url, {
    ...options,
    headers
  });

    if (response.status === 401 || response.status === 403) {
    console.warn("authFetch: unauthorized request", url);
    if (!url.endsWith("/record_PvPong_match") &&
        !url.endsWith("/record_AIpong_match") &&
        !url.endsWith("/record_tournament")) {
      localStorage.removeItem("auth_token");
      navigateTo("/signin");
    }
    throw new Error("Unauthorized or 2FA not verified");
  }

  return response;
}*/
