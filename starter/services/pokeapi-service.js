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
