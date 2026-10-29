// Fixed top navigation. Turns solid on scroll, shows the active profile's
// avatar with a sign-out menu, and hosts the search box.

import { activeProfile, signOut } from "../store.js";
import { esc } from "../util.js";

const LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg";

export function renderNav(active = "home") {
  const p = activeProfile();
  const nav = document.createElement("nav");
  nav.className = "nav";
  nav.innerHTML = `
    <a href="browse.html" aria-label="Home">
      <img src="${LOGO}" alt="Netflix" style="width:92px" />
    </a>
    <div class="hidden md:flex gap-4" id="nav-links">
      ${link("home", "Home", active)}
      ${link("tv", "TV Shows", active)}
      ${link("movie", "Movies", active)}
      ${link("new", "New & Popular", active)}
      ${link("mylist", "My List", active)}
    </div>

    <!-- Mobile "Browse" dropdown -->
    <div class="relative md:hidden" id="mobile-browse">
      <button class="flex items-center gap-1 text-sm text-white" id="mobile-browse-btn">
        Browse <span class="material-symbols-outlined text-base">arrow_drop_down</span>
      </button>
      <div class="absolute left-0 mt-2 w-44 bg-black/95 border border-white/10 rounded hidden" id="mobile-menu">
        ${["home:Home", "tv:TV Shows", "movie:Movies", "new:New & Popular", "mylist:My List"]
          .map((p) => {
            const [k, lbl] = p.split(":");
            return `<a href="browse.html#${k}" class="block px-4 py-2 text-sm hover:bg-white/10" data-nav="${k}">${lbl}</a>`;
          })
          .join("")}
      </div>
    </div>

    <div class="flex items-center gap-3" style="margin-left:auto">
      <div class="relative flex items-center">
        <span class="material-symbols-outlined cursor-pointer" id="search-icon">search</span>
        <input id="search-input" placeholder="Titles, people, genres"
          class="bg-black/70 border border-white/30 text-white text-sm rounded px-2 py-1 ml-1 w-0 opacity-0 transition-all duration-300 outline-none" />
      </div>
      <div class="relative" id="profile-menu">
        <div class="w-8 h-8 rounded flex items-center justify-center font-bold cursor-pointer"
             style="background:${p ? p.color : "#555"}">${
    p ? esc(p.name[0].toUpperCase()) : "?"
  }</div>
        <div class="absolute right-0 mt-2 w-44 bg-black/90 border border-white/10 rounded hidden"
             id="profile-dropdown">
          <a href="profiles.html" class="block px-4 py-2 text-sm hover:bg-white/10">Switch Profiles</a>
          <a href="#" id="signout" class="block px-4 py-2 text-sm hover:bg-white/10">Sign out of Netflix</a>
        </div>
      </div>
    </div>`;

  document.body.prepend(nav);
  wire(nav);
  return nav;
}

function link(key, label, active) {
  return `<a href="browse.html#${key}" class="navlink${
    active === key ? " active" : ""
  }" data-nav="${key}">${label}</a>`;
}

function wire(nav) {
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });

  // Profile dropdown
  const dd = nav.querySelector("#profile-dropdown");
  nav.querySelector("#profile-menu").addEventListener("click", (e) => {
    e.stopPropagation();
    dd.classList.toggle("hidden");
  });
  document.addEventListener("click", () => dd.classList.add("hidden"));
  nav.querySelector("#signout").addEventListener("click", (e) => {
    e.preventDefault();
    signOut();
    location.href = "index.html";
  });

  // Mobile Browse dropdown
  const mMenu = nav.querySelector("#mobile-menu");
  const mBtn = nav.querySelector("#mobile-browse-btn");
  if (mBtn) {
    mBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mMenu.classList.toggle("hidden");
    });
    document.addEventListener("click", () => mMenu.classList.add("hidden"));
  }

  // Expanding search box
  const icon = nav.querySelector("#search-icon");
  const input = nav.querySelector("#search-input");
  icon.addEventListener("click", () => {
    input.classList.toggle("w-0");
    input.classList.toggle("opacity-0");
    input.classList.toggle("w-52");
    input.classList.toggle("opacity-100");
    if (!input.classList.contains("w-0")) input.focus();
  });
}
