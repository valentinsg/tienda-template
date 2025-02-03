export function generateTrackingCode(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BSY-${timestamp.toString(36).toUpperCase()}-${random}`;
}