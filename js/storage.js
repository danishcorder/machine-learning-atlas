/* Safe browser storage. The platform remains fully functional when storage is blocked. */
export const safeStorage = {
  get(key, fallback = null) {
    try { const v = window.localStorage.getItem(key); return v == null ? fallback : v; }
    catch { return fallback; }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value); return true; }
    catch { return false; }
  },
  remove(key) {
    try { window.localStorage.removeItem(key); return true; }
    catch { return false; }
  }
};
