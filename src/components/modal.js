// Detail modal: opened from any card. Shows the billboard, Play / My List /
// trailer actions, metadata, cast, episode picker (TV) and "More Like This".

import { detail, episodes, img } from "../api/tmdb.js";
import { freeFilmById } from "../api/freeFilms.js";
import { esc, watchUrl } from "../util.js";
import { toggleMyList, inMyList } from "../store.js";
import { cardHtml } from "./card.js";

let backdrop;

export async function openModal(ref) {
  // Free films have all their data locally — no TMDB round-trip.
  const data = ref.free ? freeFilmById(ref.id) : null;
  mount(skeleton());

  const d = data || (await detail(ref.type, ref.id));
  if (!backdrop) return; // closed while loading
  render(d);
}

function skeleton() {
  return `<div class="modal"><div class="modal-hero" style="background:#222">
    <div class="flex items-center justify-center w-full" style="aspect-ratio:16/9">
      <div class="spinner"></div></div></div></div>`;
}

function render(d) {
  const inList = inMyList(d);
  const bg = d.backdrop
    ? d.backdrop.startsWith("http")
      ? d.backdrop
      : img(d.backdrop, "w1280")
    : d.poster && d.poster.startsWith("http")
    ? d.poster
    : "";

  backdrop.querySelector(".modal").innerHTML = `
    <div class="modal-hero" style="background-image:url('${bg}')">
      <button class="absolute top-3 right-3 btn-circle" id="modal-close">
        <span class="material-symbols-outlined">close</span></button>
      <div class="relative z-10 p-6 pb-4">
        <h1 class="text-3xl md:text-4xl font-extrabold mb-4">${esc(d.title)}</h1>
        <div class="flex items-center gap-3 flex-wrap">
          <a class="btn btn-play" href="${watchUrl(d)}">
            <span class="material-symbols-outlined">play_arrow</span> Play</a>
          <button class="btn btn-circle" id="modal-list" title="My List">
            <span class="material-symbols-outlined">${inList ? "check" : "add"}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="p-6 pt-2 grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <div class="flex items-center gap-3 text-sm mb-3">
          ${d.rating ? `<span class="text-green-500 font-semibold">${d.rating}% Match</span>` : ""}
          ${d.year ? `<span>${esc(d.year)}</span>` : ""}
          ${d.runtime ? `<span>${fmtRuntime(d.runtime)}</span>` : ""}
          ${d.free ? `<span class="badge" style="position:static">FREE FULL MOVIE</span>` : ""}
        </div>
        <p class="text-sm leading-relaxed">${esc(d.overview) || "No description available."}</p>
      </div>
      <div class="text-sm space-y-2 text-gray-300">
        ${d.cast?.length ? `<p><span class="text-gray-500">Cast:</span> ${esc(d.cast.join(", "))}</p>` : ""}
        ${d.genres?.length ? `<p><span class="text-gray-500">Genres:</span> ${esc(d.genres.join(", "))}</p>` : (d.genre ? `<p><span class="text-gray-500">Genre:</span> ${esc(d.genre)}</p>` : "")}
      </div>
    </div>
    ${d.seasons?.length ? seasonSection(d) : ""}
    ${d.similar?.length ? similarSection(d.similar) : ""}
  `;

  wire(d);
}

function fmtRuntime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function seasonSection(d) {
  const opts = d.seasons
    .map((s) => `<option value="${s.season_number}">Season ${s.season_number}</option>`)
    .join("");
  return `
    <div class="px-6 pb-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xl font-semibold">Episodes</h3>
        <select id="season-select" class="bg-neutral-800 border border-white/20 rounded px-3 py-1 text-sm">${opts}</select>
      </div>
      <div id="episode-list" class="space-y-2"><div class="spinner"></div></div>
    </div>`;
}

function similarSection(items) {
  return `
    <div class="px-6 pb-8">
      <h3 class="text-xl font-semibold mb-3">More Like This</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        ${items.map((i) => cardHtml(i)).join("")}
      </div>
    </div>`;
}

function wire(d) {
  backdrop.querySelector("#modal-close").onclick = closeModal;

  const listBtn = backdrop.querySelector("#modal-list");
  if (listBtn)
    listBtn.onclick = () => {
      const now = toggleMyList(d);
      listBtn.querySelector("span").textContent = now ? "check" : "add";
    };

  const sel = backdrop.querySelector("#season-select");
  if (sel) {
    const load = async () => {
      const box = backdrop.querySelector("#episode-list");
      box.innerHTML = `<div class="spinner"></div>`;
      const eps = await episodes(d.id, sel.value);
      box.innerHTML = eps.length
        ? eps
            .map(
              (e) => `
        <div class="flex gap-4 p-3 rounded hover:bg-white/5 border-b border-white/10">
          <div class="text-gray-400 font-semibold w-6">${e.number}</div>
          <img src="${e.still ? img(e.still, "w300") : ""}" class="w-28 rounded object-cover bg-neutral-800" style="aspect-ratio:16/9" onerror="this.style.visibility='hidden'">
          <div class="flex-1">
            <div class="flex justify-between"><span class="font-medium">${esc(e.name)}</span>
            ${e.runtime ? `<span class="text-gray-400 text-sm">${e.runtime}m</span>` : ""}</div>
            <p class="text-sm text-gray-400 mt-1 line-clamp-2">${esc(e.overview)}</p>
          </div>
        </div>`
            )
            .join("")
        : `<p class="text-gray-400 text-sm">Episode details unavailable.</p>`;
    };
    sel.onchange = load;
    load();
  }
}

function mount(html) {
  closeModal();
  backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = html;
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.body.appendChild(backdrop);
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", onEsc);
}

function onEsc(e) {
  if (e.key === "Escape") closeModal();
}

export function closeModal() {
  if (backdrop) {
    backdrop.remove();
    backdrop = null;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onEsc);
  }
}
