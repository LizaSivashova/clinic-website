import { useCallback, useState } from 'react';

const TOKEN_KEY = 'app_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Auth helper around a short-lived access token (localStorage) plus an
 * httpOnly refresh cookie managed by the server.
 *
 * `apiFetch` attaches the Bearer access token and, on a 401, transparently
 * tries POST /api/admin/refresh once (the refresh cookie is sent automatically
 * with credentials: 'include'); on success it retries the original request,
 * otherwise it signs the user out.
 */
export function useAuth() {
  const [token, setTok] = useState(() => getToken());

  const login = useCallback((newToken) => {
    setToken(newToken);
    setTok(newToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch {
      /* ignore network errors on logout */
    }
    clearToken();
    setTok(null);
    window.location.href = '/admin/login';
  }, []);

  const apiFetch = useCallback(async (url, options = {}, retried = false) => {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        Authorization: `Bearer ${getToken() || ''}`,
      },
    });

    if (res.status === 401 && !retried) {
      // Try to silently refresh the access token, then retry once.
      const r = await fetch('/api/admin/refresh', { method: 'POST', credentials: 'include' });
      if (r.ok) {
        const data = await r.json();
        const next = data.accessToken || data.token;
        setToken(next);
        setTok(next);
        return apiFetch(url, options, true);
      }
      clearToken();
      window.location.href = '/admin/login';
      throw new Error('unauthorized');
    }

    if (res.status === 401) {
      clearToken();
      window.location.href = '/admin/login';
      throw new Error('unauthorized');
    }
    return res;
  }, []);

  return { token, isAuthed: !!token, login, logout, apiFetch };
}
