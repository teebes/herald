# Herald, the frontend for Written Realms.

Herald is the code for the game of https://writtenrealms.com, as well as its world editor. It is
written in [Vue.js](https://vuejs.org/), using [TypeScript](https://www.typescriptlang.org/) and
[SASS](https://sass-lang.com/).

## Development

To run the frontend locally against the production Written Realms backend, install the project and then run it with [Vite](https://vitejs.dev/):

```
npm install
npm run dev
```

### Development against a local backend


If you are running a local copy of the Written Realms backend, update the API and WebSocket endpoints if necessary in `.env.dev` then run:
```
npm install
num run dev-local
```

## Docker setup

To run the frontend in a Docker container, run:

```
docker build -t herald .
docker run --rm -p 5173:80 herald
```
