import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pokemonRoutes from './routes/pokemonRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { AppError } from './utils/appError.js';

const app = express();
const PORT = process.env.PORT || 3001;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(currentDirectory, 'public')));

app.use('/api/pokemon', pokemonRoutes);

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Cannot find route ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
