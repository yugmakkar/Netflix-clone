// Curated, legally free full-length films hosted on the Internet Archive.
// Every identifier and MP4 filename below was verified against
// https://archive.org/metadata/<id> — do NOT swap in IDs from memory, they rot.
//
// These are public-domain / expired-copyright titles the Archive distributes
// freely. This is the only source in the app that plays a COMPLETE film; TMDB
// titles play their YouTube trailer (we don't host or pirate studio content).

const ARCHIVE = "https://archive.org";

const film = ({ id, archiveId, file, title, year, genre, overview, poster }) => ({
  id,
  archiveId,
  type: "movie",
  free: true, // marks a fully-playable title vs. a trailer-only one
  title,
  year,
  genre,
  overview,
  // Real Wikipedia poster; the Archive thumbnail is a frame grab, so prefer the
  // poster and fall back to services/img only if none is given.
  poster: poster || `${ARCHIVE}/services/img/${archiveId}`,
  backdrop: poster || `${ARCHIVE}/services/img/${archiveId}`,
  videoUrl: `${ARCHIVE}/download/${archiveId}/${file}`,
});

export const FREE_FILMS = [
  film({
    id: "f-notld",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/91/Night_of_the_Living_Dead_%281968%29_poster.jpg",
    archiveId: "Night.Of.The.Living.Dead_1080p",
    file: "NightOfTheLivingDead.mp4",
    title: "Night of the Living Dead",
    year: "1968",
    genre: "Horror",
    overview:
      "A ragtag group of strangers barricade themselves in a farmhouse as the recently dead rise to attack the living. George A. Romero's genre-defining classic.",
  }),
  film({
    id: "f-hgf",
    poster: "https://upload.wikimedia.org/wikipedia/commons/2/21/His_Girl_Friday_%281940_poster%29_crop.jpg",
    archiveId: "his_girl_friday",
    file: "his_girl_friday.mp4",
    title: "His Girl Friday",
    year: "1940",
    genre: "Comedy",
    overview:
      "A newspaper editor schemes to keep his ace reporter ex-wife from remarrying in Howard Hawks' lightning-fast screwball comedy.",
  }),
  film({
    id: "f-general",
    poster: "https://upload.wikimedia.org/wikipedia/commons/0/0c/The_General_%281926%29_-_Movie_Poster_2.png",
    archiveId: "TheGeneral",
    file: "The_General_512kb.mp4",
    title: "The General",
    year: "1926",
    genre: "Comedy",
    overview:
      "Buster Keaton's silent masterpiece: a train engineer chases his stolen locomotive — and his sweetheart — through enemy lines.",
  }),
  film({
    id: "f-nosferatu",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/90/Nosferatu_poster_%28Albin_Grau%2C_1922%29_1.jpg",
    archiveId: "nosferatu_1922",
    file: "nosferatu_1922.mp4",
    title: "Nosferatu",
    year: "1922",
    genre: "Horror",
    overview:
      "The original vampire film. F. W. Murnau's unauthorized Dracula adaptation remains one of cinema's most haunting silent works.",
  }),
  film({
    id: "f-gulliver",
    poster: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Gullivers_travel_poster_3.jpg",
    archiveId: "GulliversTravels720p_652",
    file: "GulliversTravels.mp4",
    title: "Gulliver's Travels",
    year: "1939",
    genre: "Animation",
    overview:
      "Fleischer Studios' lavish animated feature follows Gulliver as he brokers peace between two warring kingdoms of tiny people.",
  }),
  film({
    id: "f-atm",
    poster: "https://upload.wikimedia.org/wikipedia/en/7/7a/The-amazing-transparent-man-movie-poster-md.jpg",
    archiveId: "TheAmazingTransparentMan1960",
    file: "the-amazing-transparent-man.mp4",
    title: "The Amazing Transparent Man",
    year: "1960",
    genre: "Sci-Fi",
    overview:
      "A mad scientist turns an escaped convict invisible to steal the materials for an invisible army. Directed by Edgar G. Ulmer.",
  }),
  film({
    id: "f-drh",
    poster: "https://upload.wikimedia.org/wikipedia/en/7/7b/Da-uomo-a-uomo-italian-movie-poster-md.jpg",
    archiveId: "DeathRidesAHorse",
    file: "DeathRidesAHorse1967.mp4",
    title: "Death Rides a Horse",
    year: "1967",
    genre: "Western",
    overview:
      "A young gunslinger and a grizzled ex-con pursue the same band of outlaws for revenge in this stylish spaghetti western.",
  }),
];

export function freeFilmById(id) {
  return FREE_FILMS.find((f) => f.id === id) || null;
}

// Genres considered safe for kids profiles.
const KID_SAFE = new Set(["Animation", "Comedy"]);

export function freeFilmsRow({ kids = false } = {}) {
  const items = kids ? FREE_FILMS.filter((f) => KID_SAFE.has(f.genre)) : FREE_FILMS;
  return { title: "Free Full Movies · Public Domain", items };
}
