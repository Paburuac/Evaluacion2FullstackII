// Genera un UUID v4 con los mejores fallbacks posibles (sirve en S3 website - HTTP)
export function uid() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const buf = new Uint8Array(16);
      crypto.getRandomValues(buf);
      // variante y versión v4
      buf[6] = (buf[6] & 0x0f) | 0x40;
      buf[8] = (buf[8] & 0x3f) | 0x80;
      const hex = [...buf].map(b => b.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
    }
  } catch (_) {}
  // último recurso (no-criptográfico, pero suficiente para ids locales)
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
