// expo-sqlite needs extra wasm setup on web; the browser's localStorage is enough for a preview.
// It doesn't exist during server rendering, hence the guards.
export const storage = {
  get: (key: string) => (typeof localStorage === 'undefined' ? null : localStorage.getItem(key)),
  set: (key: string, value: string) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  },
};
