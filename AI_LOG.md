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
