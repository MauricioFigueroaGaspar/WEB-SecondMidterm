import express from 'express';
import { getPokemonList, searchPokemon, getPokemonDetail } from '../services/pokeapi-service.js';
import { AppError } from '../utils/appError.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Pokemon API is running',
  });
});

router.get('/', async (req, res, next) => {
  try {
    const search = req.query.search;

    if (!search) {
      const catalog = await getPokemonList();
      return res.json(catalog);
    }

    const results = await searchPokemon(search);
    if (results.length === 0) {
      return next(new AppError(`No Pokemon matched "${search}"`, 404));
    }

    res.json({ count: results.length, results });
  } catch (error) {
    next(error);
  }
});

router.get('/:identifier', async (req, res, next) => {
  try {
    const pokemon = await getPokemonDetail(req.params.identifier);
    res.json(pokemon);
  } catch (error) {
    next(error);
  }
});

export default router;
