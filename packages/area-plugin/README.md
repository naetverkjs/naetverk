# area-plugin

Plugin to draw the network on a configurable background with limited zoom and grid snapping

### Installation

**Import**

```js
import { AreaPlugin } from '@naetverkjs/area';

editor.use(AreaPlugin);
```

**Configuration**

```js
editor.use(AreaPlugin, {
  background: 'board-background', // Added css class for the background
  snap: { dynamic: true, size: 16 }, // Should the grid snap
  scaleExtent: { min: 0.1, max: 1 }, // Defines the maximum zoom in and zoom out
  translateExtent: { width: 5000, height: 4000 }, // Defines the board size that limits translation
});
```

**Style Definition**
Add the following scss to your component, it defines the background area grid.  
You can also overwrite this if you want.
```scss
$grid-color: #ccc;
$grid-size: 32px;
$grid-area: $grid-size * 10000;

.board-background {
  display: table;
  z-index: -100;
  position: absolute;
  top: -$grid-area;
  left: -$grid-area;
  width: 2 * $grid-area;
  height: 2 * $grid-area;

  &.default {
    background-size: $grid-size $grid-size;
    background-image: linear-gradient(
        to right,
        $grid-color 1px,
        transparent 1px
      ), linear-gradient(to bottom, $grid-color 1px, transparent 1px);
  }
}
```
