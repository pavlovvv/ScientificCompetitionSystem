type AuthResponseDto = { accessToken: string; refreshToken: string };
type ExceptionDto = { message: string };
const API_BASE = import.meta?.env?.VITE_API_URL ?? '/api';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

const getTokens = () => ({
  accessToken: localStorage.getItem(ACCESS_KEY) || '',
  refreshToken: localStorage.getItem(REFRESH_KEY) || '',
});

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

const setTokens = (t: AuthResponseDto) => {
  localStorage.setItem(ACCESS_KEY, t.accessToken);
  localStorage.setItem(REFRESH_KEY, t.refreshToken);
};

const json = (body?: unknown) =>
  body !== undefined
    ? { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }
    : { headers: { 'Content-Type': 'application/json' } };

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  opts?: { retry?: boolean },
): Promise<T> => {
  const { accessToken } = getTokens();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    ...json(body),
    headers: {
      ...json(body).headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (res.ok) {
    if (res.status === 204) return undefined as T;
    const data = (await res.json()) as T;
    return data;
  }

  if (
    res.status === 401 &&
    (opts?.retry ?? true) &&
    path !== '/auth/login' &&
    path !== '/auth/refresh'
  ) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return request<T>(method, path, body, { retry: false });
    }
  }

  let msg = `HTTP ${res.status}`;
  try {
    const err = (await res.json()) as ExceptionDto;
    if (err?.message) msg = err.message;
  } catch {
    /* ignore */
  }
  throw new Error(msg);
};

export const login = async (email: string, password: string): Promise<AuthResponseDto> => {
  const data = await request<AuthResponseDto>(
    'POST',
    '/auth/login',
    { email, password },
    { retry: false },
  );
  setTokens(data);
  return data;
};

export const refreshTokens = async (): Promise<boolean> => {
  const { refreshToken } = getTokens();
  if (!refreshToken) return false;
  try {
    const data = await request<AuthResponseDto>(
      'POST',
      '/auth/refresh',
      { refreshToken },
      { retry: false },
    );
    setTokens(data);
    return true;
  } catch {
    clearTokens();
    return false;
  }
};

export const getMe = async <T>(): Promise<T> => {
  return request<T>('GET', '/users/me');
};
