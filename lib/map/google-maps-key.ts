export function getGoogleMapsPublicKey() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return "";
  return key.trim();
}
