// Polyfill seguro para entornos HTTP (S3 website) donde crypto.randomUUID no existe
(function () {
  // Asegura que exista crypto
  if (typeof globalThis.crypto !== "object") {
    globalThis.crypto = {};
  }

  // Si ya existe, no hacemos nada
  if (typeof globalThis.crypto.randomUUID === "function") return;

  function fallbackUUID() {
    try {
      const buf = new Uint8Array(16);
      if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === "function") {
        globalThis.crypto.getRandomValues(buf);
      } else {
        // último recurso no-criptográfico
        for (let i = 0; i < 16; i++) buf[i] = (Math.random() * 256) | 0;
      }
      // UUID v4
      buf[6] = (buf[6] & 0x0f) | 0x40;
      buf[8] = (buf[8] & 0x3f) | 0x80;
      const hex = [...buf].map(b => b.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    } catch {
      return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
    }
  }

  globalThis.crypto.randomUUID = fallbackUUID;
})();
