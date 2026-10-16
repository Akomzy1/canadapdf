export type Consent = 'granted' | 'denied';
export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem('jr-consent');
    if (!raw) return null;
    const saved = JSON.parse(raw);
    return saved?.choice === 'granted' && Number.isFinite(saved.timestamp) ? 'granted' : 'denied';
  } catch { return 'denied'; }
}
export function saveConsent(choice: Consent): boolean {
  try { localStorage.setItem('jr-consent', JSON.stringify({ choice, timestamp: Date.now() })); return true; }
  catch { return false; }
}
