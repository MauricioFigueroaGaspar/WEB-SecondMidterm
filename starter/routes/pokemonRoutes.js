import express from 'express';
import { getPokemonList } from '../services/pokeapi-service.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Pokemon API is running',
  });
});

router.get('/', async (req, res, next) => {
  try {
    const catalog = await getPokemonList();
    res.json(catalog);
  } catch (error) {
    next(error);
  }
});

export default router;
