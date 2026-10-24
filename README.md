# Pokedex - Midterm II

A Pokedex web app built with **Node.js**, **Express** and **Bootstrap**, using data from [PokeAPI v2](https://pokeapi.co/).

The frontend never talks to PokeAPI directly: it calls our own Express server, which gets the data from PokeAPI and sends back only what the page needs.

## Features

- **Catalog:** shows every Pokemon with its image, number and name.
- **Search:** search a Pokemon by name (full or partial, e.g. `pika`) or by number (e.g. `25`). If nothing matches, an error screen appears with a button to go back to the full catalog.
- **Details:** click a Pokemon card to see its image, name, types, experience, height, weight, abilities and moves.
- **Next / Previous:** move through the Pokemon one at a time with the buttons or the left/right arrow keys. At the end of the list it goes back to the start, and from the first Pokemon it goes to the last one.
- **Default image:** if a Pokemon image is missing, a default image is shown instead.

## Requirements

- [Node.js](https://nodejs.org/) (version 18 or newer)
- An internet connection (the server gets the data from PokeAPI)

## How to run

```bash
cd starter
npm install
npm start
```

Then open **http://localhost:3001** in your browser.

To restart the server automatically when you edit a file, use `npm run dev` instead of `npm start`.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pokemon` | Full list of Pokemon (`id`, `name`, `image`) |
| GET | `/api/pokemon?search=pika` | Pokemon whose name contains the text, or whose number matches. Returns 404 if none match |
| GET | `/api/pokemon/:idOrName` | Details of one Pokemon, plus the `prevId` and `nextId` used by the Next/Previous buttons. Returns 404 if it does not exist |
| GET | `/api/pokemon/health` | Checks that the server is running |

## Project structure

```
starter/
├── server.js                       # Starts the Express server
├── routes/pokemonRoutes.js         # API routes
├── services/pokeapi-service.js     # Calls to PokeAPI
├── middleware/errorMiddleware.js   # Sends errors back as JSON
├── utils/appError.js               # Custom error class
└── public/                         # Frontend (HTML, CSS, JS)
    ├── index.html
    ├── css/styles.css
    └── js/app.js
```

## AI usage

See [AI_LOG.md](AI_LOG.md) for the questions we asked an AI assistant and how we used the answers.
