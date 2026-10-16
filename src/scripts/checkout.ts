export function attributedUrl(destination: string, current: string, placement?: string): string {
  if (destination.startsWith('#')) return destination;
  const url = new URL(destination, current);
  const params = new URL(current).searchParams;
  for (const name of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid']) {
    const value = params.get(name);
    if (value !== null && !url.searchParams.has(name)) url.searchParams.set(name, value);
  }
  if (placement && !url.searchParams.has('utm_content')) url.searchParams.set('utm_content', placement);
  return url.toString();
}
