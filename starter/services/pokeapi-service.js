import axios from 'axios';
import { AppError } from '../utils/appError.js';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const CATALOG_LIMIT = 1351;
const OFFICIAL_ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

let catalogCache = null;

const extractIdFromUrl = (url) => {
  const segments = url.split('/').filter(Boolean);
  return Number(segments.at(-1));
};

const buildCatalogEntry = ({ name, url }) => {
  const id = extractIdFromUrl(url);

  return {
    id,
    name,
    image: `${OFFICIAL_ARTWORK_URL}/${id}.png`,
  };
};

export const getPokemonList = async () => {
  if (catalogCache) {
    return catalogCache;
  }

  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon`, {
      params: {
        limit: CATALOG_LIMIT,
        offset: 0,
      },
      timeout: 10000,
    });

    catalogCache = {
      count: response.data.count,
      results: response.data.results.map(buildCatalogEntry),
    };

    return catalogCache;
  } catch (error) {
    throw new AppError('Could not retrieve the Pokemon catalog', 502);
  }
};

export const searchPokemon = async (query) => {
  const catalog = await getPokemonList();
  const text = query.toLowerCase().trim();

  // A number searches by ID, anything else searches by name
  if (!isNaN(text)) {
    return catalog.results.filter((pokemon) => pokemon.id === Number(text));
  }

  return catalog.results.filter((pokemon) => pokemon.name.includes(text));
};

// Finds the previous and next Pokemon in the catalog (wraps around at the ends)
const findNeighbourIds = (results, id) => {
  const index = results.findIndex((pokemon) => pokemon.id === id);

  let prevIndex = index - 1;
  if (prevIndex < 0) {
    prevIndex = results.length - 1;
  }

  let nextIndex = index + 1;
  if (nextIndex >= results.length) {
    nextIndex = 0;
  }

  return {
    prevId: results[prevIndex].id,
    nextId: results[nextIndex].id,
  };
};

const buildPokemonDetail = (data, prevId, nextId) => {
  return {
    id: data.id,
    name: data.name,
    image: `${OFFICIAL_ARTWORK_URL}/${data.id}.png`,
    experience: data.base_experience,
    // PokeAPI gives height in decimetres and weight in hectograms
    height: data.height / 10,
    weight: data.weight / 10,
    types: data.types.map((item) => item.type.name),
    abilities: data.abilities.map((item) => item.ability.name),
    moves: data.moves.map((item) => item.move.name),
    prevId,
    nextId,
  };
};

export const getPokemonDetail = async (identifier) => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${identifier.toLowerCase()}`, {
      timeout: 10000,
    });

    const catalog = await getPokemonList();
    const { prevId, nextId } = findNeighbourIds(catalog.results, response.data.id);

    return buildPokemonDetail(response.data, prevId, nextId);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new AppError(`Pokemon "${identifier}" was not found`, 404);
    }
    throw new AppError('Could not retrieve the Pokemon details', 502);
  }
};
