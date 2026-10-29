// Browse SPA. Hash-routed views (home / tv / movie / new / mylist) plus a live
// search overlay. Each view is a set of content rows; the home view also shows
// a hero billboard. Guards the route: no session/profile => redirect.

import "./app.css";
import { rows, search as tmdbSearch, hasKey, img, KID_GENRE_IDS } from "./api/tmdb.js";
import { freeFilmsRow } from "./api/freeFilms.js";
import { renderNav } from "./components/nav.js";
import { renderRow, wireCardClicks } from "./components/card.js";
import { openModal } from "./components/modal.js";
import {
  activeProfile,
  isSignedIn,
  myList,
  continueRow,
  toggleMyList,
  inMyList,
} from "./store.js";
import { esc, watchUrl, debounce } from "./util.js";

// --- route guard -----------------------------------------------------------
if (!isSignedIn()) location.replace("forms.html");
else if (!activeProfile()) location.replace("profiles.html");

const app = document.getElementById("app");
const kids = activeProfile()?.kids;

renderNav(viewFromHash());
setupBanner();
wireCardClicks(openModal);
wireSearch();

function viewFromHash() {
  return (location.hash.replace("#", "") || "home");
}

// --- view definitions: which rows each page shows --------------------------
// Family genres only when the active profile is a kids profile.
const ROW_SETS = {
  home: () => [
    continueRowDef(),
    rows.trending(),
    rows.top10Today(),
    rows.netflixOriginals(),
    Promise.resolve(freeFilmsRow()),
    rows.hindi(),
    rows.genre("Action", "28"),
    rows.genre("Comedies", "35"),
    rows.genre("Horror", "27", "movie"),
    myListRowDef(),
  ],
  tv: () => [
    rows.trendingTV(),
    rows.netflixOriginals(),
    rows.genre("Crime TV", "80", "tv"),
    rows.genre("Sci-Fi & Fantasy", "10765", "tv"),
    rows.genre("Kids TV", "10762", "tv"),
  ],
  movie: () => [
    rows.trendingMovies(),
    Promise.resolve(freeFilmsRow()),
    rows.hindi(),
    rows.genre("Action", "28"),
    rows.genre("Romance", "10749"),
    rows.genre("Animation", "16"),
  ],
  new: () => [rows.trending(), rows.top10Today(), rows.trendingMovies(), rows.trendingTV()],
  mylist: () => [myListRowDef(true)],
};

const KIDS_ROWS = () => [
  rows.genre("Animation", "16"),
  rows.genre("Family", "10751"),
  rows.genre("Kids TV", "10762", "tv"),
  Promise.resolve(freeFilmsRow({ kids: true })),
];

function continueRowDef() {
  const items = continueRow();
  return Promise.resolve(items.length ? { title: "Continue Watching", items } : null);
}
function myListRowDef(empty = false) {
  const items = myList();
  if (!items.length)
    return Promise.resolve(
      empty ? { title: "My List", items: [], _emptyMsg: true } : null
    );
  return Promise.resolve({ title: "My List", items });
}

// --- router ----------------------------------------------------------------
async function route() {
  const view = viewFromHash();
  document.querySelectorAll("[data-nav]").forEach((a) =>
    a.classList.toggle("active", a.dataset.nav === view)
  );
  window.scrollTo(0, 0);

  app.innerHTML = `<div class="flex justify-center py-32"><div class="spinner"></div></div>`;

  const rowDefs = kids ? KIDS_ROWS() : (ROW_SETS[view] || ROW_SETS.home)();

  // Resolve rows in parallel; the hero uses the first real row.
  const resolved = await Promise.all(rowDefs);
  if (viewFromHash() !== view) return; // navigated away while loading

  app.innerHTML = "";
  const heroItem =
    view === "home" && !kids ? firstHeroCandidate(resolved) : null;
  if (heroItem) renderHero(heroItem);
  else app.style.paddingTop = "80px";

  const container = document.createElement("div");
  container.className = "pt-4";
  if (heroItem) container.style.marginTop = "-8vw";
  app.appendChild(container);

  let rendered = 0;
  resolved.forEach((r, i) => {
    if (!r) return;
    if (r._emptyMsg && !r.items.length) {
      container.insertAdjacentHTML(
        "beforeend",
        `<p class="px-[4%] text-gray-400 py-10">You haven't added anything to your list yet.</p>`
      );
      return;
    }
    renderRow(container, r, { top10: /Top 10/.test(r.title) });
    rendered++;
  });

  if (!rendered && !heroItem)
    container.innerHTML = `<p class="px-[4%] text-gray-400 py-10">Nothing to show here yet.</p>`;
}

function firstHeroCandidate(resolved) {
  // Skip personalized rows — their slimmed items have no overview for the hero.
  const skip = /Continue Watching|My List/;
  const row = resolved.find(
    (r) => r && !skip.test(r.title) && r.items && r.items.some((i) => i.backdrop || i.poster)
  );
  if (!row) return null;
  return row.items.find((i) => i.backdrop) || row.items[0];
}

// --- hero billboard --------------------------------------------------------
function renderHero(item) {
  const bg = item.backdrop
    ? item.backdrop.startsWith("http")
      ? item.backdrop
      : img(item.backdrop, "w1280")
    : item.poster?.startsWith("http")
    ? item.poster
    : img(item.poster, "w780");

  const hero = document.createElement("section");
  hero.className = "hero";
  // Blurred full-bleed backdrop (works with portrait posters) + a crisp poster
  // card on the right, like a Netflix billboard.
  hero.innerHTML = `
    <div class="hero-bg" style="background-image:url('${bg}')"></div>
    <img class="hero-poster" src="${bg}" alt="${esc(item.title)}"
         onerror="this.style.display='none'">
    <div class="hero-content">
      <h1 class="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">${esc(item.title)}</h1>
      <p class="text-sm md:text-lg mb-5 line-clamp-3 drop-shadow">${esc(item.overview || "")}</p>
      <div class="flex gap-3">
        <a class="btn btn-play" href="${watchUrl(item)}">
          <span class="material-symbols-outlined">play_arrow</span> Play</a>
        <button class="btn btn-ghost" id="hero-info">
          <span class="material-symbols-outlined">info</span> More Info</button>
      </div>
    </div>`;
  app.appendChild(hero);
  hero.querySelector("#hero-info").onclick = () =>
    openModal({ id: item.id, type: item.type, free: item.free, archiveId: item.archiveId });
}

// --- setup banner (no API key) --------------------------------------------
function setupBanner() {
  if (hasKey()) return;
  const el = document.getElementById("setup-banner");
  el.innerHTML = `
    <div class="fixed bottom-4 right-4 z-[70] max-w-xs bg-neutral-900 border border-yellow-600/50 rounded-lg p-4 text-sm shadow-xl">
      <p class="font-semibold text-yellow-500 mb-1">Demo mode</p>
      <p class="text-gray-300">No TMDB key set — showing sample data. Add <code class="text-white">VITE_TMDB_API_KEY</code> to <code class="text-white">.env</code> for the live catalog.</p>
      <button class="mt-2 text-gray-400 underline" onclick="this.closest('div').remove()">Dismiss</button>
    </div>`;
}

// --- search overlay --------------------------------------------------------
function wireSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;
  const run = debounce(async (q) => {
    if (!q.trim()) {
      route();
      return;
    }
    app.innerHTML = `<div class="flex justify-center py-32"><div class="spinner"></div></div>`;
    let results = await tmdbSearch(q);
    // Kids profiles: keep only titles tagged with a family-safe genre (when
    // genre data is available; sample data carries none, so it passes through).
    if (kids)
      results = results.filter(
        (r) => !r.genreIds?.length || r.genreIds.some((g) => KID_GENRE_IDS.has(g))
      );
    if (document.getElementById("search-input").value.trim() !== q.trim()) return;
    app.style.paddingTop = "80px";
    app.innerHTML = "";
    if (!results.length) {
      app.innerHTML = `<p class="px-[4%] pt-24 text-gray-400">No results for "${esc(q)}".</p>`;
      return;
    }
    const container = document.createElement("div");
    container.className = "pt-20 px-[4%]";
    container.innerHTML = `<h2 class="row-title mb-4">Results for "${esc(q)}"</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" id="results"></div>`;
    app.appendChild(container);
    import("./components/card.js").then(({ cardHtml }) => {
      container.querySelector("#results").innerHTML = results
        .map((i) => cardHtml(i))
        .join("");
    });
  }, 350);

  input.addEventListener("input", (e) => run(e.target.value));
}

// --- kick off (after all const definitions are initialized) ----------------
window.addEventListener("hashchange", route);
route();
