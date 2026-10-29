// Offline fallback catalog. Used when VITE_TMDB_API_KEY is absent or a request
// fails. Posters are intentionally null so cards render self-contained gradient
// tiles (no network needed) — see renderCard() in components/card.js.

const mk = (id, title, type, year, rating, overview) => ({
  id,
  type,
  title,
  year,
  rating,
  overview,
  poster: null,
  backdrop: null,
  sample: true,
});

export const SAMPLE_ROWS = {
  trending: [
    mk(1, "Stranger Things", "tv", "2016", 86, "A small town uncovers supernatural mysteries and government experiments."),
    mk(2, "Money Heist", "tv", "2017", 83, "A criminal mastermind leads a daring heist on the Royal Mint of Spain."),
    mk(3, "The Witcher", "tv", "2019", 79, "A solitary monster hunter struggles to find his place in a world of beasts and men."),
    mk(4, "Wednesday", "tv", "2022", 82, "Wednesday Addams navigates her years at Nevermore Academy."),
    mk(5, "Dark", "tv", "2017", 84, "A missing child sets four families on a frantic search for answers."),
    mk(6, "Squid Game", "tv", "2021", 78, "Cash-strapped players accept an invitation to compete in deadly children's games."),
  ],
  originals: [
    mk(10, "The Crown", "tv", "2016", 85, "The reign of Queen Elizabeth II from the 1940s to modern times."),
    mk(11, "Narcos", "tv", "2015", 84, "The rise and fall of the Medellín drug cartel."),
    mk(12, "Ozark", "tv", "2017", 83, "A financial adviser launders money for a Mexican cartel."),
    mk(13, "Black Mirror", "tv", "2011", 83, "An anthology exploring a twisted, high-tech near future."),
    mk(14, "The Umbrella Academy", "tv", "2019", 82, "A dysfunctional family of superheroes reunites to solve a mystery."),
  ],
  hindi: [
    mk(20, "Sacred Games", "tv", "2018", 80, "A Mumbai cop receives a call from a crime lord with a warning."),
    mk(21, "Delhi Crime", "tv", "2019", 85, "The Delhi police investigate a brutal crime under intense scrutiny."),
    mk(22, "Dangal", "movie", "2016", 82, "A former wrestler trains his daughters to become world-class athletes."),
    mk(23, "Gangs of Wasseypur", "movie", "2012", 83, "A sprawling saga of crime, power and revenge in coal-mining country."),
    mk(24, "3 Idiots", "movie", "2009", 84, "Two friends search for their long-lost companion from engineering college."),
  ],
  movies: [
    mk(30, "Inception", "movie", "2010", 83, "A thief who steals corporate secrets through dream-sharing technology."),
    mk(31, "The Dark Knight", "movie", "2008", 90, "Batman faces the Joker, a criminal mastermind bent on chaos."),
    mk(32, "Interstellar", "movie", "2014", 86, "Explorers travel through a wormhole in search of a new home for humanity."),
    mk(33, "Parasite", "movie", "2019", 85, "A poor family schemes to become employed by a wealthy household."),
    mk(34, "The Matrix", "movie", "1999", 82, "A hacker learns the shocking truth about his reality."),
  ],
  tv: [
    mk(40, "Breaking Bad", "tv", "2008", 92, "A chemistry teacher turned methamphetamine producer."),
    mk(41, "Better Call Saul", "tv", "2015", 88, "The transformation of a struggling lawyer into Saul Goodman."),
    mk(42, "Peaky Blinders", "tv", "2013", 85, "A gangster family epic set in 1900s Birmingham, England."),
    mk(43, "The Queen's Gambit", "tv", "2020", 83, "An orphaned chess prodigy rises to the top of the game."),
  ],
};

export const SAMPLE_DETAIL = {
  id: 1,
  type: "tv",
  title: "Stranger Things",
  year: "2016",
  rating: 86,
  overview:
    "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
  poster: null,
  backdrop: null,
  genres: ["Sci-Fi", "Horror", "Drama"],
  runtime: 51,
  seasons: [],
  cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour"],
  similar: SAMPLE_ROWS.trending.slice(1, 6),
  trailerKey: null,
  sample: true,
};
