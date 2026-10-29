// Offline fallback catalog. Used when VITE_TMDB_API_KEY is absent or a request
// fails. Poster art is real and baked in from keyless sources (TVmaze for TV,
// Wikipedia for film posters) so demo mode looks like a real streaming app with
// no API key. If a URL ever 404s, the card falls back to a title tile.
//
// `g` holds TMDB genre ids so genre rows and the kids filter work offline.

const mk = (id, title, type, year, rating, poster, g, overview) => ({
  id,
  type,
  title,
  year,
  rating,
  poster, // absolute URL (passes straight through img resolution)
  backdrop: poster,
  genreIds: g,
  overview,
  sample: true,
});

const TV = "https://static.tvmaze.com/uploads/images/original_untouched";
const WK = "https://upload.wikimedia.org/wikipedia/en";

export const SAMPLE_ROWS = {
  trending: [
    mk(1, "Stranger Things", "tv", "2016", 86, `${TV}/595/1489169.jpg`, [18, 10765, 9648, 27], "A small town uncovers supernatural mysteries and government experiments."),
    mk(2, "Money Heist", "tv", "2017", 83, `${TV}/430/1076004.jpg`, [80, 18, 53], "A criminal mastermind leads a daring heist on the Royal Mint of Spain."),
    mk(3, "The Witcher", "tv", "2019", 79, `${TV}/594/1486674.jpg`, [10765, 18, 10759], "A solitary monster hunter struggles to find his place in a world of beasts and men."),
    mk(4, "Wednesday", "tv", "2022", 82, `${TV}/586/1466410.jpg`, [10765, 9648, 35], "Wednesday Addams navigates her years at Nevermore Academy."),
    mk(5, "Dark", "tv", "2017", 84, `${TV}/504/1262352.jpg`, [18, 10765, 9648], "A missing child sets four families on a frantic search for answers."),
    mk(6, "Squid Game", "tv", "2021", 78, `${TV}/576/1440521.jpg`, [18, 10759, 9648], "Cash-strapped players accept an invitation to compete in deadly children's games."),
  ],
  originals: [
    mk(10, "The Crown", "tv", "2016", 85, `${TV}/632/1580063.jpg`, [18], "The reign of Queen Elizabeth II from the 1940s to modern times."),
    mk(11, "Narcos", "tv", "2015", 84, `${TV}/498/1246087.jpg`, [80, 18], "The rise and fall of the Medellín drug cartel."),
    mk(12, "Ozark", "tv", "2017", 83, `${TV}/398/996611.jpg`, [80, 18, 53], "A financial adviser launders money for a Mexican cartel."),
    mk(13, "Black Mirror", "tv", "2011", 83, `${TV}/564/1411764.jpg`, [10765, 18, 9648], "An anthology exploring a twisted, high-tech near future."),
    mk(14, "The Umbrella Academy", "tv", "2019", 82, `${TV}/529/1324589.jpg`, [10765, 10759, 35], "A dysfunctional family of superheroes reunites to solve a mystery."),
  ],
  hindi: [
    mk(20, "Sacred Games", "tv", "2018", 80, `${TV}/204/511629.jpg`, [80, 18, 53], "A Mumbai cop receives a call from a crime lord with a warning."),
    mk(21, "Delhi Crime", "tv", "2019", 85, `${TV}/188/470620.jpg`, [80, 18], "The Delhi police investigate a brutal crime under intense scrutiny."),
    mk(22, "Dangal", "movie", "2016", 82, `${WK}/9/99/Dangal_Poster.jpg`, [18, 10751], "A former wrestler trains his daughters to become world-class athletes."),
    mk(23, "Gangs of Wasseypur", "movie", "2012", 83, `${WK}/6/6a/Gangs_of_Wasseypur_poster.jpg`, [28, 80, 18], "A sprawling saga of crime, power and revenge in coal-mining country."),
    mk(24, "3 Idiots", "movie", "2009", 84, `${WK}/d/df/3_idiots_poster.jpg`, [35, 18], "Two friends search for their long-lost companion from engineering college."),
  ],
  movies: [
    mk(30, "Inception", "movie", "2010", 83, `${WK}/2/2e/Inception_%282010%29_theatrical_poster.jpg`, [28, 878, 53, 12], "A thief who steals corporate secrets through dream-sharing technology."),
    mk(31, "The Dark Knight", "movie", "2008", 90, `${WK}/1/1c/The_Dark_Knight_%282008_film%29.jpg`, [28, 80, 18], "Batman faces the Joker, a criminal mastermind bent on chaos."),
    mk(32, "Interstellar", "movie", "2014", 86, `${WK}/b/bc/Interstellar_film_poster.jpg`, [878, 12, 18], "Explorers travel through a wormhole in search of a new home for humanity."),
    mk(33, "Parasite", "movie", "2019", 85, `${WK}/5/53/Parasite_%282019_film%29.png`, [53, 18, 35], "A poor family schemes to become employed by a wealthy household."),
    mk(34, "The Matrix", "movie", "1999", 82, `${WK}/d/db/The_Matrix.png`, [28, 878], "A hacker learns the shocking truth about his reality."),
  ],
  tv: [
    mk(40, "Breaking Bad", "tv", "2008", 92, `${TV}/501/1253519.jpg`, [80, 18, 53], "A chemistry teacher turned methamphetamine producer."),
    mk(41, "Better Call Saul", "tv", "2015", 88, `${TV}/501/1253515.jpg`, [80, 18], "The transformation of a struggling lawyer into Saul Goodman."),
    mk(42, "Peaky Blinders", "tv", "2013", 85, `${TV}/48/122213.jpg`, [80, 18], "A gangster family epic set in 1900s Birmingham, England."),
    mk(43, "The Queen's Gambit", "tv", "2020", 83, `${TV}/510/1275203.jpg`, [18], "An orphaned chess prodigy rises to the top of the game."),
  ],
  // Kid-safe titles so Animation / Family / Kids TV rows and kids search have
  // real, age-appropriate content with no API key.
  kids: [
    mk(50, "Bluey", "tv", "2018", 94, `${TV}/512/1281879.jpg`, [16, 10762, 10751, 35], "A lovable Blue Heeler puppy and her family turn everyday life into play."),
    mk(51, "Peppa Pig", "tv", "2004", 72, `${TV}/569/1423757.jpg`, [16, 10762, 10751], "A cheeky little piggy and her adventures with family and friends."),
    mk(52, "SpongeBob SquarePants", "tv", "1999", 81, `${TV}/594/1486607.jpg`, [16, 10762, 35], "An optimistic sea sponge and his undersea antics in Bikini Bottom."),
    mk(53, "PAW Patrol", "tv", "2013", 68, `${TV}/6/15988.jpg`, [16, 10762, 10751], "A pack of heroic rescue pups led by a tech-savvy boy named Ryder."),
    mk(54, "Avatar: The Last Airbender", "tv", "2005", 92, `${TV}/633/1582667.jpg`, [16, 10762, 10759, 10765], "A young Avatar must master the elements to save a war-torn world."),
    mk(55, "Pokémon", "tv", "1997", 75, `${TV}/630/1576025.jpg`, [16, 10762, 10759], "Ash and Pikachu travel the world to become Pokémon masters."),
  ],
};

const ALL = () => Object.values(SAMPLE_ROWS).flat();

// Items matching a TMDB genre id (used for offline genre rows). Returns [] when
// fewer than 3 match so the row is skipped instead of looking sparse. Kids
// titles are only included for kid genres (Animation/Family/Kids), so e.g. the
// Comedies row doesn't mix SpongeBob with Parasite.
const KID_GENRES = new Set([16, 10751, 10762]);
export function sampleByGenre(id) {
  const gid = Number(id);
  const pool = KID_GENRES.has(gid)
    ? ALL()
    : ALL().filter((i) => !SAMPLE_ROWS.kids.includes(i));
  const matches = pool.filter((i) => (i.genreIds || []).includes(gid));
  return matches.length >= 3 ? matches : [];
}

// A full Top 10 built from the most popular non-kids titles.
export function sampleTop10() {
  return [...SAMPLE_ROWS.trending, ...SAMPLE_ROWS.movies, ...SAMPLE_ROWS.originals]
    .filter((i, idx, arr) => arr.findIndex((x) => x.id === i.id) === idx)
    .slice(0, 10);
}

export const SAMPLE_DETAIL = {
  id: 1,
  type: "tv",
  title: "Stranger Things",
  year: "2016",
  rating: 86,
  poster: `${TV}/595/1489169.jpg`,
  backdrop: `${TV}/595/1489169.jpg`,
  overview:
    "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
  genres: ["Sci-Fi", "Horror", "Drama"],
  runtime: 51,
  seasons: [],
  cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour"],
  similar: SAMPLE_ROWS.trending.slice(1, 6),
  trailerKey: null,
  sample: true,
};
