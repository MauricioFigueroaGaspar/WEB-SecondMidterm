# AI Usage Log

This log records specific questions I asked an AI assistant while building the Pokedex and how I applied the answers.

## 1. Building catalog images without extra API requests

**Question:** PokeAPI's `/pokemon` list endpoint only returns each Pokemon's name and resource URL, not its sprite. How can I show an image in the catalog without making a detail request for all 1351 Pokemon?

**Help received:** The assistant pointed out that the Pokemon ID can be extracted from the resource URL. That ID can be used to build the official artwork URL from the public PokeAPI sprites repository, avoiding thousands of additional requests.

**What I applied:** `services/pokeapi-service.js` now extracts the ID from each result and returns `{ id, name, image }` for every catalog entry.

## 2. Caching the full Pokemon catalog

**Question:** The full Pokemon list is large but rarely changes. Is it reasonable to cache it in memory, and how can I avoid caching a failed request?

**Help received:** The assistant recommended a module-level cache that is populated only after a successful PokeAPI response. If the request fails, the error is passed to the error middleware and the cache remains empty, so a later request can try again.

**What I applied:** `getPokemonList()` now stores the normalized catalog in memory after the first successful request and reuses it on later calls.

## 3. Connecting the existing card renderer to the catalog response

**Question:** The backend returns an object with `count` and `results`, but the existing frontend renderer expects a list. How should I connect them without rewriting the renderer?

**Help received:** The assistant suggested reading `data.results` from the response and passing that array to the existing `renderCatalog()` function. The current frontend already supports both a raw array and the `{ results }` shape, so only the endpoint needed to change.

**What I applied:** `loadCatalog()` now requests `/api/pokemon` and renders the returned Pokemon list using the existing card creation code.

## Victor JACQUINOT--FEGA part:

## 4. Understanding the project after cloning it

**Question:** My teammate had already done a lot of work on the project before I cloned it. Can you give me a full analysis and description of the project so I understand how everything works before I continue?

**Help received:** The assistant went through the whole repository and explained how the parts fit together. `server.js` serves the `public/` folder and mounts the API routes. `routes/pokemonRoutes.js` defines the endpoints, and `services/pokeapi-service.js` calls PokeAPI and caches the catalog. `middleware/errorMiddleware.js` and `utils/appError.js` send errors back as JSON. On the frontend, `app.js` calls our backend and renders the catalog grid and the detail modal. It also showed me what was still missing compared to the assignment: the search, the detail endpoint, Next/Previous with wrap-around, and some fields in the modal.

**What I applied:** I used this overview to decide what to build next, and I added my changes to the existing structure without rewriting my teammate's code.

## 5. Checking my idea for the search bar filters

**Question:** I wanted to check that my plan for the search bar was right: send the search text to our backend as a query parameter and filter the Pokemon list there, matching part of a name as well as the full name. Is this a good approach?

**Help received:** The assistant confirmed the approach and gave me some advice:
- Filter the catalog that is already cached instead of calling PokeAPI on every search.
- Convert the text to lowercase and trim it, so `Pika ` still matches `pikachu`.
- If the text is a number, search by Pokemon ID instead of by name.
- Return a 404 when nothing matches, because `app.js` already shows the error screen (with the button back to the full catalog) when it gets a 404.

**What I applied:** I added `searchPokemon()` to `services/pokeapi-service.js` and handled `GET /api/pokemon?search=...` in `routes/pokemonRoutes.js`. In `app.js`, `loadCatalog()` now adds the `search` parameter to the request when there is a search text.

## 6. Making the page look like a Pokedex from the games

**Question:** I wanted the page to look like the Pokedex device from the Pokemon games, not like a normal website. What could I change in the frontend to get that look, using only Bootstrap and my own CSS?

**Help received:** The assistant gave me a list of ideas:
- Turn the whole page into a red Pokedex device with a dark border and rounded corners.
- Add the indicator lights at the top: one big blue light and three small red, yellow and green ones.
- Show the catalog inside a light "screen" with a black border, like the device's display.
- Add a Pokeball icon made in CSS next to the title.
- Use a rounder font (Poppins from Google Fonts) and a light dotted background behind the device.
- Give the cards rounded corners and a small hover effect, and put each Pokemon image on a grey circle.
- Give each Pokemon type its own color, as in the games, and use the first type to color the modal header.
- Replace the starter template's labels (Age, Features, Characteristics) with Pokedex ones (Experience, Abilities, Moves), and show height and weight with units (m, kg).

The assistant also helped me build some of these parts directly:
- **Pokeball:** I didn't know how to draw a Pokeball in CSS, so the assistant wrote the `.pokeball` class for me. It is a round element with a border and a gradient that makes the white halves and the black band in the middle.
- **Font:** I asked it to find a better font than the default one. It suggested Poppins and added it for me (the Google Fonts link in `index.html` and the `font-family` in `styles.css`).
- **Sizes and measurements:** I asked it for the sizes of the different elements (lights, frame and screen borders, rounded corners, card images, the circle behind the image in the modal). I kept some of its values because they looked good, and I changed others to make them bigger. For example, the black border around the Pokemon list was too thin, so I made it thicker.
- **HTML structure:** I had trouble getting everything in the right place on the page, so the assistant helped me organize `index.html`. Everything now sits inside the `pokedex-frame`. The top row uses Bootstrap's grid for the lights, the title and the search bar, and below it are the loading spinner, the error screen, the catalog inside the `pokedex-screen`, and the footer. The old navbar was removed, and its title and search bar were moved into the device.

**What I applied:** With the assistant's help on the structure, I rebuilt the layout of `index.html` around a `pokedex-frame` and a `pokedex-screen` using Bootstrap's grid. I added the lights, the Pokeball and the type colors in `styles.css`, and adjusted the sizes as described above. I only made small changes to `app.js`: it now adds the type color classes to the badges and the modal header and adds the units to height and weight.

## 7. Writing the README

**Question:** Can you write a clean `README.md` with a short description of the project, how to run it, the features and endpoints I listed for you, the project structure, and a link to this AI usage file?

**Help received:** The assistant wrote the README in that structure, using the features and endpoints I gave it. It also added the requirements (Node.js 18+ and an internet connection) and the `npm run dev` option.
