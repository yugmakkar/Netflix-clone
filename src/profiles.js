// "Who's watching?" screen. Lists profiles, lets you add/remove them, and on
// selection plays the Netflix intro sound (the click is the user gesture that
// satisfies browser autoplay policies) before entering the browse app.

import "./app.css";
import {
  profiles,
  addProfile,
  removeProfile,
  setActiveProfile,
  isSignedIn,
} from "./store.js";
import { esc } from "./util.js";

if (!isSignedIn()) location.replace("forms.html");

const root = document.getElementById("profiles-root");
let managing = false;

function render() {
  const list = profiles();
  root.innerHTML = `
    <h1 class="text-3xl md:text-5xl font-light mb-8">Who's watching?</h1>
    <div class="flex flex-wrap gap-5 justify-center max-w-3xl">
      ${list.map(profileTile).join("")}
      ${list.length < 5 ? addTile() : ""}
    </div>
    <button id="manage" class="mt-10 border border-gray-500 text-gray-400 px-6 py-2 tracking-wide hover:text-white hover:border-white">
      ${managing ? "Done" : "Manage Profiles"}
    </button>`;
  wire();
}

function profileTile(p) {
  return `
    <div class="profile-tile group cursor-pointer" data-id="${p.id}">
      <div class="relative w-24 h-24 md:w-32 md:h-32 rounded-md flex items-center justify-center text-4xl font-bold group-hover:ring-4 ring-white transition"
           style="background:${p.color}">
        ${esc(p.name[0].toUpperCase())}
        ${p.kids ? `<span class="material-symbols-outlined absolute bottom-1 right-1 text-base bg-black/50 rounded-full p-0.5">child_care</span>` : ""}
        ${managing ? `<button class="remove absolute -top-2 -right-2 bg-black border border-white/40 rounded-full w-7 h-7 flex items-center justify-center" data-id="${p.id}"><span class="material-symbols-outlined text-base">delete</span></button>` : ""}
      </div>
      <p class="mt-2 text-gray-400 group-hover:text-white">${esc(p.name)}</p>
    </div>`;
}

function addTile() {
  return `
    <div id="add-tile" class="cursor-pointer flex flex-col items-center justify-center">
      <div class="w-24 h-24 md:w-32 md:h-32 rounded-md bg-neutral-800 flex items-center justify-center hover:bg-neutral-700">
        <span class="material-symbols-outlined text-5xl text-gray-400">add_circle</span>
      </div>
      <p class="mt-2 text-gray-400">Add Profile</p>
    </div>`;
}

function wire() {
  document.getElementById("manage").onclick = () => {
    managing = !managing;
    render();
  };

  const addEl = document.getElementById("add-tile");
  if (addEl) addEl.onclick = showAddForm;

  if (managing) {
    root.querySelectorAll(".remove").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (profiles().length > 1) {
          removeProfile(btn.dataset.id);
          render();
        }
      };
    });
    return; // in manage mode, tiles don't enter the app
  }

  root.querySelectorAll(".profile-tile").forEach((tile) => {
    tile.onclick = () => enter(tile.dataset.id);
  });
}

function showAddForm() {
  root.innerHTML = `
    <h1 class="text-3xl font-light mb-6">Add Profile</h1>
    <div class="flex flex-col items-center gap-4">
      <input id="pname" placeholder="Name" maxlength="20"
        class="bg-neutral-800 border border-white/20 rounded px-4 py-3 text-lg w-64 outline-none" />
      <label class="flex items-center gap-2 text-gray-300">
        <input type="checkbox" id="pkids" class="w-4 h-4 accent-red-600" /> Kids profile
      </label>
      <div class="flex gap-3 mt-2">
        <button id="save" class="btn btn-play">Continue</button>
        <button id="cancel" class="btn btn-ghost">Cancel</button>
      </div>
    </div>`;
  document.getElementById("cancel").onclick = render;
  document.getElementById("save").onclick = () => {
    const name = document.getElementById("pname").value.trim();
    if (!name) return;
    addProfile(name, document.getElementById("pkids").checked);
    render();
  };
  document.getElementById("pname").focus();
}

function enter(id) {
  setActiveProfile(id);
  // Play the intro sting, then go to browse. Resolve even if audio is blocked.
  const audio = new Audio("/images/Netflix-Intro-Sound-Effect.mp3");
  audio.volume = 0.6;
  const go = () => location.assign("browse.html");
  audio.addEventListener("ended", go, { once: true });
  audio.play().then(
    () => setTimeout(go, 3800), // safety in case 'ended' doesn't fire
    () => go() // autoplay blocked → just proceed
  );
}

render();
