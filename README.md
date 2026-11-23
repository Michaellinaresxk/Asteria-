# weight-on-space

Take a look at your weight on other planets to learn more about how gravity works and be amazed at how much, or how little, you weigh on other worlds.

## Live preview

<https://weight-on-space.web.app/>

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Preview production build

```
npm run preview
```

### Lints and fixes files

```
npm run lint
```

## NASA API key (recommended)

The astronomy calendar (near-Earth asteroids) and the photo gallery use public NASA APIs. Without configuration they use `DEMO_KEY`, which is limited to **10 requests per hour per IP**. For a reliable experience, get a free key at <https://api.nasa.gov/> and create a `.env.local` file (git-ignored):

```
VITE_NASA_API_KEY=your_key_here
```

The photo gallery also uses Wikimedia Commons, which needs no key. Near-Earth asteroid data is requested one week at a time and cached, so normal browsing stays well below the `DEMO_KEY` limit.
