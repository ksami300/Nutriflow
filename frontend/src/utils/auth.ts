const AUTH_TOKEN_KEY = "token";
const AUTH_COOKIE_NAME = "token";

const isBrowser = typeof window !== "undefined";

const getCookie = (name: string) => {
  if (!isBrowser) return null;
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1] || null;
};

export const setToken = (token: string) => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // ignore storage failures in restricted browsers
  }
};

export const getToken = () => {
  if (!isBrowser) return null;
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) || getCookie(AUTH_COOKIE_NAME) || null
  );
};

export const removeToken = () => {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore storage failures
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure`;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};