type RuntimeEnv = {
  apiBaseUrl?: string;
};

declare global {
  interface Window {
    __env?: RuntimeEnv;
  }
}

export function getApiBaseUrl(): string {
  return window.__env?.apiBaseUrl || 'http://localhost:3005';
}

