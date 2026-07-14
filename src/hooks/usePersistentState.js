import { useState, useEffect, useRef } from "react";

// Hard cap so a runaway chat history (or any other persisted value) can't
// silently blow past localStorage's ~5MB quota and start failing writes.
const MAX_STORED_BYTES = 500_000;

/**
 * Drop-in replacement for useState that persists to localStorage.
 * Read/write are both wrapped in try/catch because localStorage can throw
 * (private browsing, quota exceeded, disabled storage, corrupted JSON, etc).
 * On any failure we fall back to in-memory state only, and surface the
 * failure via the returned `storageError` so the UI can show a warning
 * instead of silently losing persistence.
 */
export function usePersistentState(key, initialValue) {
  if (typeof key !== "string" || !key.trim()) {
    // Fail loudly here -- a bad key is a programming error, not a runtime
    // condition users can hit, so we don't want to silently no-op it.
    throw new Error("usePersistentState requires a non-empty string key");
  }

  const [storageError, setStorageError] = useState(null);

  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return initialValue;
      return JSON.parse(stored);
    } catch (err) {
      console.error(`usePersistentState: failed to read "${key}"`, err);
      setStorageError(`Couldn't load saved data for "${key}". Starting fresh.`);
      return initialValue;
    }
  });

  // Avoid writing to storage on the very first render (we just read it).
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    try {
      const serialized = JSON.stringify(value);
      if (serialized.length > MAX_STORED_BYTES) {
        // Don't attempt the write -- better to warn and keep the in-memory
        // value than to throw a QuotaExceededError mid-render cycle.
        setStorageError(
          `Saved data for "${key}" got too large and wasn't persisted. Older entries may be lost on refresh.`
        );
        return;
      }
      window.localStorage.setItem(key, serialized);
      setStorageError(null);
    } catch (err) {
      console.error(`usePersistentState: failed to write "${key}"`, err);
      const message =
        err && err.name === "QuotaExceededError"
          ? `Storage is full — changes to "${key}" weren't saved.`
          : `Couldn't save changes for "${key}". Your data may not persist.`;
      setStorageError(message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  return [value, setValue, storageError];
}
