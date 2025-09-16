// src/auth.js
const KEY = "basic_auth_b64"; // WARNING: for dev only!

export const getApiUrl = () => import.meta.env.VITE_API_URL || "http://localhost:5000";

export function setBasicAuth(email, password) {
  const b64 = btoa(`${email}:${password}`);
  localStorage.setItem(KEY, b64);
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function isAuthed() {
  return !!localStorage.getItem(KEY);
}

export function authHeaders() {
  const b64 = localStorage.getItem(KEY);
  return b64 ? { Authorization: `Basic ${b64}` } : {};
}
