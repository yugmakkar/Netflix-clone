// Client-side persistence for the demo. Everything lives in localStorage —
// there is no backend. "Auth" is a simulated session flag + email only;
// we NEVER store a password (see forms handling).

const KEYS = {
  session: "nf_session",
  profiles: "nf_profiles",
  active: "nf_active_profile",
};

// --- tiny localStorage helpers (quota/private-mode safe) -------------------
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / disabled storage */
  }
}

// --- session ---------------------------------------------------------------
export function signIn(email) {
  write(KEYS.session, { email, at: Date.now() });
}
export function signOut() {
  localStorage.removeItem(KEYS.session);
  localStorage.removeItem(KEYS.active);
}
export function session() {
  return read(KEYS.session, null);
}
export function isSignedIn() {
  return Boolean(session());
}

// --- profiles --------------------------------------------------------------
const DEFAULT_AVATARS = ["#E50914", "#0071eb", "#2ea44f", "#b9a44c", "#9b4de0"];

export function profiles() {
  const p = read(KEYS.profiles, null);
  if (p && p.length) return p;
  // Seed one default profile so first run isn't empty.
  const seed = [{ id: "p1", name: "You", color: DEFAULT_AVATARS[0], kids: false }];
  write(KEYS.profiles, seed);
  return seed;
}

export function addProfile(name, kids = false) {
  const list = profiles();
  const color = DEFAULT_AVATARS[list.length % DEFAULT_AVATARS.length];
  const profile = { id: "p" + Date.now(), name: name || "Guest", color, kids };
  write(KEYS.profiles, [...list, profile]);
  return profile;
}

export function removeProfile(id) {
  write(KEYS.profiles, profiles().filter((p) => p.id !== id));
  localStorage.removeItem(dataKey(id));
}

export function setActiveProfile(id) {
  write(KEYS.active, id);
}
export function activeProfile() {
  const id = read(KEYS.active, null);
  return profiles().find((p) => p.id === id) || null;
}
export function avatars() {
  return DEFAULT_AVATARS;
}

// --- per-profile data (My List + Continue Watching) ------------------------
// Namespaced by profile id so switching profiles swaps all personalization.
function dataKey(profileId) {
  return `nf_data_${profileId}`;
}
function profileData() {
  const p = activeProfile();
  if (!p) return { list: [], continue: [] };
  return read(dataKey(p.id), { list: [], continue: [] });
}
function saveProfileData(data) {
  const p = activeProfile();
  if (p) write(dataKey(p.id), data);
}

export function myList() {
  return profileData().list;
}
export function inMyList(item) {
  return profileData().list.some((i) => i.id === item.id && i.type === item.type);
}
export function toggleMyList(item) {
  const data = profileData();
  const exists = data.list.some((i) => i.id === item.id && i.type === item.type);
  data.list = exists
    ? data.list.filter((i) => !(i.id === item.id && i.type === item.type))
    : [slim(item), ...data.list];
  saveProfileData(data);
  return !exists; // true => now in list
}

// Keep only the fields the rows need, so storage stays small.
function slim(item) {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    poster: item.poster,
    backdrop: item.backdrop,
    year: item.year,
    rating: item.rating,
    free: item.free || false,
    videoUrl: item.videoUrl || null,
    archiveId: item.archiveId || null,
  };
}

// --- Continue Watching -----------------------------------------------------
export function continueRow() {
  return profileData().continue;
}

// Called by the player as it saves progress. seconds/duration in whole seconds.
export function saveProgress(item, seconds, duration) {
  const data = profileData();
  const entry = {
    ...slim(item),
    seconds: Math.floor(seconds),
    duration: Math.floor(duration),
    updated: Date.now(),
  };
  const rest = data.continue.filter(
    (i) => !(i.id === item.id && i.type === item.type)
  );
  // Drop finished titles from the rail (see isFinished threshold).
  data.continue = isFinished(seconds, duration)
    ? rest
    : [entry, ...rest].slice(0, 20);
  saveProfileData(data);
}

export function progressFor(item) {
  const e = continueRow().find((i) => i.id === item.id && i.type === item.type);
  if (!e || !e.duration) return 0;
  return Math.min(100, Math.round((e.seconds / e.duration) * 100));
}

// TODO(human): decide when a title is "finished" and should leave Continue
// Watching. Given seconds watched and total duration (both in seconds, and
// duration may be 0/unknown), return true to drop it from the rail, false to
// keep it. Think about what feels right as a viewer: credits often run the
// last few minutes, so "watched to the very last second" is too strict.
export function isFinished(seconds, duration) {
  // Default so the app runs before you implement this: finished at >=95%.
  if (!duration) return false;
  return seconds / duration >= 0.95;
}
