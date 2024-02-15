# Herald, frontend for Written Realms

Herald is the code for the game of https://writtenrealms.com, as well as its world editor. It is
written in [Vue.js](https://vuejs.org/), using [TypeScript](https://www.typescriptlang.org/) and
[SASS](https://sass-lang.com/).

## Docker setup

```
docker build -t herald .
docker run --rm -p 8080:80 herald
```

Then visit http://localhost:8080/ in your browser

## NPM Project setup

If you want to set up the project directly in your environment, you can install it normally with NPM. Note version 14 is NPM is required for the build to succeed.

```
npm install
```

### Compiles and hot-reloads for development

To connect the frontend to writtenrealms.com, use:

```
npm run serve
```

To connect the frontend to your local development server, use:

```
npm run serve-local
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```
