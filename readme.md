# Image Tiling Tool

> tiling images with nodejs for leaflet tiles map

## Note

For ease of calculation,  The image size must be to the nth power of 2

```js
const zoom = 7  // zoom range [3,7]
const tileSize = 1024 / Math.pow(2, zoom - 3)  // 
```

## Run

```
npm install && node index.js

```