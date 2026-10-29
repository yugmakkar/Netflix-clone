// Player page. Two modes:
//   free=1  -> full public-domain film in a native <video> with custom controls
//   else    -> YouTube trailer via the IFrame API (no studio content is hosted)
// Both feed Continue Watching through store.saveProgress().

import "./app.css";
import { detail } from "./api/tmdb.js";
import { freeFilmById } from "./api/freeFilms.js";
import { saveProgress, continueRow, isSignedIn, activeProfile } from "./store.js";
import { esc } from "./util.js";

if (!isSignedIn() || !activeProfile()) location.replace("profiles.html");

const root = document.getElementById("player-root");
const params = new URLSearchParams(location.search);
const type = params.get("type") || "movie";
const id = params.get("id");
const isFree = params.get("free") === "1";

const backBar = `
  <button id="back" class="absolute top-4 left-4 z-30 flex items-center gap-2 text-white/90 hover:text-white">
    <span class="material-symbols-outlined text-3xl">arrow_back</span>
  </button>`;

init();

async function init() {
  if (isFree) return playFreeFilm();
  return playTrailer();
}

function goBack() {
  if (history.length > 1) history.back();
  else location.href = "browse.html";
}
function wireBack() {
  document.getElementById("back").onclick = goBack;
}

// --- resume helper ---------------------------------------------------------
function resumeSeconds(item) {
  const e = continueRow().find((i) => i.id === item.id && i.type === item.type);
  return e && e.seconds ? e.seconds : 0;
}

// --- Full film (native video) ----------------------------------------------
function playFreeFilm() {
  const film = freeFilmById(id);
  if (!film) return fail("This title isn't available.");

  root.innerHTML = `
    ${backBar}
    <div id="title-card" class="absolute top-4 left-16 z-30 text-white/90 text-lg font-semibold drop-shadow">${esc(film.title)} <span class="text-gray-400 font-normal">(${film.year})</span></div>
    <video id="vid" class="w-full h-full" playsinline src="${film.videoUrl}"></video>
    <div id="controls" class="absolute inset-x-0 bottom-0 z-30 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity">
      <input id="seek" type="range" min="0" max="100" value="0" step="0.1" class="w-full accent-red-600 cursor-pointer" />
      <div class="flex items-center gap-4 mt-2 text-white">
        <button id="play" class="material-symbols-outlined text-4xl">play_arrow</button>
        <button id="back10" class="material-symbols-outlined text-3xl">replay_10</button>
        <button id="fwd10" class="material-symbols-outlined text-3xl">forward_10</button>
        <span id="time" class="text-sm tabular-nums">0:00 / 0:00</span>
        <div class="flex items-center gap-1 ml-auto">
          <button id="mute" class="material-symbols-outlined text-3xl">volume_up</button>
          <input id="vol" type="range" min="0" max="1" step="0.05" value="1" class="w-20 accent-white cursor-pointer" />
        </div>
        <button id="full" class="material-symbols-outlined text-3xl">fullscreen</button>
      </div>
    </div>`;
  wireBack();

  const v = document.getElementById("vid");
  const start = resumeSeconds(film);
  if (start) v.addEventListener("loadedmetadata", () => (v.currentTime = start), { once: true });

  wireVideoControls(v, film);

  // Try to autoplay. Unmuted may be blocked (the Play click was on the previous
  // page), so fall back to muted autoplay, then leave paused for the user.
  v.play().catch(() => {
    v.muted = true;
    document.getElementById("mute").textContent = "volume_off";
    v.play().catch(() => {});
  });
}

function wireVideoControls(v, film) {
  const $ = (s) => document.getElementById(s);
  const controls = $("controls");
  const playBtn = $("play");
  const seek = $("seek");
  const timeEl = $("time");
  const muteBtn = $("mute");

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const togglePlay = () => (v.paused ? v.play() : v.pause());
  playBtn.onclick = togglePlay;
  v.onclick = togglePlay;
  v.onplay = () => (playBtn.textContent = "pause");
  v.onpause = () => (playBtn.textContent = "play_arrow");
  // Show total duration as soon as metadata loads (before playback starts).
  v.onloadedmetadata = () => (timeEl.textContent = `0:00 / ${fmt(v.duration)}`);

  $("back10").onclick = () => (v.currentTime -= 10);
  $("fwd10").onclick = () => (v.currentTime += 10);

  v.ontimeupdate = () => {
    if (v.duration) seek.value = (v.currentTime / v.duration) * 100;
    timeEl.textContent = `${fmt(v.currentTime)} / ${fmt(v.duration)}`;
  };
  seek.oninput = () => {
    if (v.duration) v.currentTime = (seek.value / 100) * v.duration;
  };

  muteBtn.onclick = () => {
    v.muted = !v.muted;
    muteBtn.textContent = v.muted ? "volume_off" : "volume_up";
  };
  $("vol").oninput = (e) => {
    v.volume = e.target.value;
    v.muted = v.volume === 0;
  };
  $("full").onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else root.requestFullscreen?.();
  };

  // Auto-hide controls during playback.
  let hideT;
  const show = () => {
    controls.style.opacity = "1";
    document.body.style.cursor = "default";
    clearTimeout(hideT);
    hideT = setTimeout(() => {
      if (!v.paused) {
        controls.style.opacity = "0";
        document.body.style.cursor = "none";
      }
    }, 2600);
  };
  root.addEventListener("mousemove", show);
  show();

  // Save progress periodically + on leave.
  const save = () => saveProgress(film, v.currentTime, v.duration || 0);
  setInterval(() => !v.paused && save(), 5000);
  window.addEventListener("beforeunload", save);

  // Keyboard shortcuts (Netflix-like).
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowLeft":
        v.currentTime -= 5;
        break;
      case "ArrowRight":
        v.currentTime += 5;
        break;
      case "ArrowUp":
        v.volume = Math.min(1, v.volume + 0.1);
        break;
      case "ArrowDown":
        v.volume = Math.max(0, v.volume - 0.1);
        break;
      case "m":
        muteBtn.click();
        break;
      case "f":
        $("full").click();
        break;
      case "Escape":
        if (!document.fullscreenElement) goBack();
        break;
    }
  });
}

// --- Trailer (YouTube IFrame API) ------------------------------------------
async function playTrailer() {
  root.innerHTML = `${backBar}<div class="flex items-center justify-center h-full"><div class="spinner"></div></div>`;
  wireBack();

  const d = await detail(type, id);
  if (!d.trailerKey) return fail(d.title, "No trailer is available for this title.", d);

  root.innerHTML = `
    ${backBar}
    <div id="title-card" class="absolute top-4 left-16 z-30 text-white/90 text-lg font-semibold drop-shadow">${esc(d.title)}</div>
    <div id="yt" class="w-full h-full"></div>`;
  wireBack();

  loadYouTubeApi().then(() => {
    /* global YT */
    const start = resumeSeconds(d);
    const player = new YT.Player("yt", {
      videoId: d.trailerKey,
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        start: start || 0,
      },
      host: "https://www.youtube-nocookie.com",
      events: {
        onReady: (e) => e.target.playVideo(),
        onError: () =>
          fail(d.title, "This trailer can't be embedded. Watch it on YouTube.", d, d.trailerKey),
        onStateChange: (e) => {
          // Save progress while playing (state 1 = playing).
          if (e.data === YT.PlayerState.PLAYING) startYtProgress(player, d);
        },
      },
    });
  });
}

function startYtProgress(player, d) {
  if (player._tracking) return;
  player._tracking = true;
  setInterval(() => {
    try {
      const t = player.getCurrentTime?.();
      const dur = player.getDuration?.();
      if (t && dur) saveProgress(d, t, dur);
    } catch {
      /* player not ready */
    }
  }, 5000);
}

let ytPromise;
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytPromise) return ytPromise;
  ytPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = resolve;
    document.head.appendChild(tag);
  });
  return ytPromise;
}

// --- failure / fallback ----------------------------------------------------
function fail(title, msg = "", d = null, ytKey = null) {
  root.innerHTML = `
    ${backBar}
    <div class="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
      <h1 class="text-2xl font-bold">${esc(typeof title === "string" ? title : "Unavailable")}</h1>
      <p class="text-gray-400 max-w-md">${esc(msg || "This content can't be played.")}</p>
      ${
        ytKey
          ? `<a class="btn btn-play" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${ytKey}"><span class="material-symbols-outlined">open_in_new</span> Watch on YouTube</a>`
          : ""
      }
      <a class="btn btn-ghost" href="browse.html">Back to Browse</a>
    </div>`;
  wireBack();
}
