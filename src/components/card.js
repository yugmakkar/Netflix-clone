// Card + row rendering. A card shows poster art, or a gradient title tile when
// there's no art (offline/sample mode or a null TMDB poster). Clicking a card
// opens the detail modal.

import { img } from "../api/tmdb.js";
import { esc } from "../util.js";
import { progressFor } from "../store.js";

// A single card's HTML. `rank` (1-10) renders the big Top-10 numeral.
export function cardHtml(item, { rank } = {}) {
  const pct = progressFor(item);
  // On a broken image, swap in a title tile. Use this.alt (not an inlined
  // title) so titles containing quotes/HTML can't break the handler.
  const art = item.poster
    ? `<img src="${posterSrc(item)}" alt="${esc(item.title)}" loading="lazy"
         onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'tile',textContent:this.alt}))">`
    : `<div class="tile">${esc(item.title)}</div>`;

  const card = `
    <div class="card" data-id="${item.id}" data-type="${esc(item.type)}"${
    item.free ? ' data-free="1"' : ""
  }${item.archiveId ? ` data-archive="${esc(item.archiveId)}"` : ""}>
      ${item.free ? `<span class="badge">FREE</span>` : ""}
      ${art}
      ${pct ? `<div class="progress" style="width:${pct}%"></div>` : ""}
    </div>`;

  // The rank numeral sits OUTSIDE the card, which clips its own overflow.
  return rank
    ? `<div class="top10-item"><span class="rank">${rank}</span>${card}</div>`
    : card;
}

function posterSrc(item) {
  // Absolute URLs (Archive thumbnails, baked-in sample posters) pass through;
  // TMDB items carry a relative path that img() expands.
  if (item.poster?.startsWith("http")) return item.poster;
  return img(item.poster, "w342");
}

// Render a titled row of cards into a container element.
export function renderRow(container, { title, items }, { top10 } = {}) {
  if (!items || !items.length) return;
  const section = document.createElement("section");
  section.className = "row" + (top10 ? " top10" : "");
  section.innerHTML = `
    <h2 class="row-title">${esc(title)}</h2>
    <div class="row-scroller">
      ${items
        .map((it, i) => cardHtml(it, { rank: top10 ? i + 1 : undefined }))
        .join("")}
    </div>`;
  container.appendChild(section);
}

// One global click delegate for every card on the page.
export function wireCardClicks(onOpen) {
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    onOpen({
      id: Number(card.dataset.id) || card.dataset.id,
      type: card.dataset.type,
      free: card.dataset.free === "1",
      archiveId: card.dataset.archive || null,
    });
  });
}
