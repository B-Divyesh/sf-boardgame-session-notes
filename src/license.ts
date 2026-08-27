const SLUG = 'boardgame-session-notes';
const KEY = `sb_license:${SLUG}`;
const VERDICT = `${KEY}:verdict`;
const BILLING_BASE = (import.meta.env.VITE_BILLING_BASE as string | undefined) || 'https://api.sociobot.in';

type Verdict = { valid: boolean; checkedAt: number };

export function checkoutUrl(): string {
  return `${BILLING_BASE}/api/v1/products/${SLUG}/checkout`;
}

export function captureLicenseFromUrl(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  localStorage.setItem(KEY, token);
  localStorage.setItem(VERDICT, JSON.stringify({ valid: true, checkedAt: 0 }));
  url.searchParams.delete('license');
  history.replaceState({}, '', url.pathname + url.search + url.hash);
  return true;
}

export function hasCachedUnlock(): boolean {
  const token = localStorage.getItem(KEY);
  if (!token) return false;
  try {
    return (JSON.parse(localStorage.getItem(VERDICT) || '') as Verdict).valid;
  } catch {
    return true;
  }
}

export function saveLicense(token: string): void {
  localStorage.setItem(KEY, token.trim());
  localStorage.setItem(VERDICT, JSON.stringify({ valid: true, checkedAt: 0 }));
}

export async function verifyLicense(force = false): Promise<boolean | null> {
  const token = localStorage.getItem(KEY);
  if (!token) return false;
  let cached: Verdict | undefined;
  try { cached = JSON.parse(localStorage.getItem(VERDICT) || ''); } catch { /* verify below */ }
  if (!force && cached?.checkedAt && Date.now() - cached.checkedAt < 86_400_000) return cached.valid;
  try {
    const response = await fetch(`${BILLING_BASE}/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification unavailable');
    const result = await response.json() as { valid?: boolean };
    const verdict = { valid: result.valid === true, checkedAt: Date.now() };
    localStorage.setItem(VERDICT, JSON.stringify(verdict));
    return verdict.valid;
  } catch {
    return null;
  }
}
