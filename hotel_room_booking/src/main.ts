import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { API_BASE_URL } from './app/api.tokens';

(async () => {
  const baseUrl = await loadApiBaseUrl();
  await bootstrapApplication(App, {
    ...appConfig,
    providers: [
      ...(appConfig.providers ?? []),
      { provide: API_BASE_URL, useValue: baseUrl },
    ],
  });
})().catch((err) => console.error(err));

async function loadApiBaseUrl(): Promise<string> {
  // Served from `public/appsettings.env` (see `angular.json` assets configuration)
  const fallback = 'https://localhost:7167';

  try {
    const res = await fetch('appsettings.env', { cache: 'no-store' });
    if (!res.ok) return fallback;

    const text = await res.text();
    const map = parseEnv(text);
    return map['API_BASE_URL']?.trim() || fallback;
  } catch {
    return fallback;
  }
}

function parseEnv(envText: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of envText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    out[key] = value;
  }
  return out;
}
