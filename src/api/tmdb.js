// --- TMDB data layer -------------------------------------------------------
// All catalog data (titles, posters, trailers) comes from The Movie Database.
// The key is read from VITE_TMDB_API_KEY. Only VITE_-prefixed vars are exposed
// to the browser bundle by Vite, so nothing else in .env leaks to the client.
//
// If no key is present the app still runs: every fetch falls back to the
// bundled sample data in sampleData.js, so a fresh `git clone` renders.

import {
  SAMPLE_ROWS,
  SAMPLE_DETAIL,
  sampleByGenre,
  sampleTop10,
} from "./sampleData.js";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const BASE = "https://api.themoviedb.org/3";

export const IMG = "https://image.tmdb.org/t/p";
export const hasKey = () => Boolean(API_KEY);

// Poster/backdrop helper that survives null paths (TMDB omits art for some titles).
const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='342' height='513'>
       <rect width='100%' height='100%' fill='#1a1a1a'/>
       <text x='50%' y='50%' fill='#555' font-family='Arial' font-size='22'
             text-anchor='middle' dominant-baseline='middle'>No Image</text>
     </svg>`
  );

export function img(path, size = "w500") {
  return path ? `${IMG}/${size}${path}` : PLACEHOLDER;
}

// Thin cache so re-opening a row/modal doesn't re-hit the network.
const cache = new Map();

async function get(path, params = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("include_adult", "false"); // keep it SFW everywhere
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const key = url.toString();
  if (cache.has(key)) return cache.get(key);

  const res = await fetch(key);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data = await res.json();
  cache.set(key, data);
  return data;
}

// Normalize a TMDB record into the shape the UI uses everywhere.
export function normalize(item) {
  const type = item.media_type || (item.first_air_date ? "tv" : "movie");
  return {
    id: item.id,
    type,
    title: item.title || item.name || "Untitled",
    overview: item.overview || "",
    poster: item.poster_path,
    backdrop: item.backdrop_path,
    rating: item.vote_average ? Math.round(item.vote_average * 10) : null,
    year: (item.release_date || item.first_air_date || "").slice(0, 4),
    genreIds: item.genre_ids || [],
  };
}

// Genre ids safe for kids search (Animation, Family, Kids). Comedy (35) is
// intentionally excluded here: many adult comedies carry it, and genuine kids
// shows already carry 16/10762, so they still pass.
export const KID_GENRE_IDS = new Set([16, 10751, 10762]);

const list = (data) =>
  (data.results || [])
    .filter((r) => (r.media_type ? r.media_type !== "person" : true))
    .map(normalize);

// --- Row builders ----------------------------------------------------------
// Each resolves to { title, items[] }. On any failure (no key, network, rate
// limit) it returns the matching sample row so the UI never shows a blank.

// `sample` is either a key into SAMPLE_ROWS or a function returning items.
async function row(title, fetcher, sample) {
  try {
    if (!hasKey()) throw new Error("no key");
    const items = await fetcher();
    if (!items.length) throw new Error("empty");
    return { title, items };
  } catch {
    const items =
      typeof sample === "function" ? sample() : SAMPLE_ROWS[sample] || [];
    return { title, items };
  }
}

export const rows = {
  trending: () =>
    row("Trending Now", async () => list(await get("/trending/all/week")), "trending"),

  top10Today: () =>
    row(
      "Top 10 Movies & Shows Today",
      async () => list(await get("/trending/all/day")).slice(0, 10),
      sampleTop10
    ),

  netflixOriginals: () =>
    row(
      "Netflix Originals",
      async () =>
        list(
          await get("/discover/tv", {
            with_networks: "213",
            sort_by: "popularity.desc",
          })
        ),
      "originals"
    ),

  hindi: () =>
    row(
      "Indian Movies & Shows",
      async () =>
        list(
          await get("/discover/movie", {
            with_original_language: "hi",
            sort_by: "popularity.desc",
            region: "IN",
          })
        ),
      "hindi"
    ),

  trendingMovies: () =>
    row("Popular Movies", async () => list(await get("/movie/popular")), "movies"),

  trendingTV: () =>
    row("Popular TV Shows", async () => list(await get("/tv/popular")), "tv"),

  genre: (name, id, kind = "movie") =>
    row(
      name,
      async () =>
        list(
          await get(`/discover/${kind}`, {
            with_genres: id,
            sort_by: "popularity.desc",
          })
        ),
      () => sampleByGenre(id)
    ),
};

// --- Detail + search -------------------------------------------------------
export async function detail(type, id) {
  try {
    if (!hasKey()) throw new Error("no key");
    const data = await get(`/${type}/${id}`, {
      append_to_response: "videos,credits,similar,content_ratings,release_dates",
    });
    const trailer = pickTrailer(data.videos?.results || []);
    return {
      ...normalize(data),
      type,
      genres: (data.genres || []).map((g) => g.name),
      runtime: data.runtime || (data.episode_run_time || [])[0] || null,
      seasons: (data.seasons || []).filter((s) => s.season_number > 0),
      cast: (data.credits?.cast || []).slice(0, 8).map((c) => c.name),
      similar: list(data.similar || { results: [] }).slice(0, 12),
      trailerKey: trailer?.key || null,
    };
  } catch {
    // Demo/offline: show the actual clicked title (not a fixed placeholder).
    const found = Object.values(SAMPLE_ROWS)
      .flat()
      .find((i) => String(i.id) === String(id) && i.type === type);
    if (!found) return SAMPLE_DETAIL;
    return {
      ...SAMPLE_DETAIL,
      ...found,
      genres: [],
      runtime: null,
      seasons: [],
      cast: [],
      similar: Object.values(SAMPLE_ROWS).flat().filter((i) => i.id !== found.id).slice(0, 8),
      trailerKey: null,
    };
  }
}

export async function episodes(tvId, season) {
  try {
    if (!hasKey()) throw new Error("no key");
    const data = await get(`/tv/${tvId}/season/${season}`);
    return (data.episodes || []).map((e) => ({
      number: e.episode_number,
      name: e.name,
      overview: e.overview,
      still: e.still_path,
      runtime: e.runtime,
    }));
  } catch {
    return [];
  }
}

export async function search(query) {
  if (!query.trim()) return [];
  try {
    if (!hasKey()) throw new Error("no key");
    const data = await get("/search/multi", { query });
    return list(data);
  } catch {
    const q = query.toLowerCase();
    return Object.values(SAMPLE_ROWS)
      .flat()
      .filter((i) => i.title.toLowerCase().includes(q));
  }
}

function pickTrailer(videos) {
  const yt = videos.filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ||
    yt.find((v) => v.type === "Trailer") ||
    yt.find((v) => v.type === "Teaser") ||
    yt[0]
  );
}
