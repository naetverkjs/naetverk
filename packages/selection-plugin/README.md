# selection-plugin

> _This plugin is based on the [WellerQu/rete-selection-plugin](https://github.com/WellerQu/rete-selection-plugin)_

Plugin to render a selection rectangle to allow the multiselection of nodes

### Installation

```js
import { SelectionPlugin } from '@naetverkjs/selection';

editor.use(SelectionPlugin);
```

### Parameters

#### Default

```ts
editor.use(SelectionPlugin, {
  enabled: true,
  offset: {
    x: 0,
    y: 0,
  },
  selectorClass: null,
});
```

- **enabled**:
  Enables or Disables the Plugin
- **offset**:
  The drawing of the rectangle is dependent on the drawing area.
  If this area is moved, the introduction of an offset can be necessary.
- **selectorClass**:
  Allows the extension of the default class of the selection area which is `selection-area`
