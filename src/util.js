// Small shared helpers.

// Escape text before putting it in innerHTML — overviews/titles are external data.
export function esc(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Build the watch-page URL for a title.
export function watchUrl(item) {
  const p = new URLSearchParams({ type: item.type, id: item.id });
  if (item.free) {
    p.set("free", "1");
    if (item.archiveId) p.set("archive", item.archiveId);
  }
  return `watch.html?${p.toString()}`;
}

// Debounce (used by search).
export function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function requireSession(redirect = "forms.html") {
  // Lazy import avoids a circular dependency at module load.
  return import("./store.js").then(({ isSignedIn, activeProfile }) => {
    if (!isSignedIn()) {
      location.replace(redirect);
      return false;
    }
    if (!activeProfile()) {
      location.replace("profiles.html");
      return false;
    }
    return true;
  });
}
