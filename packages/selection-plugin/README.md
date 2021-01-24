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
});
```

- **enabled**:
  Enables or Disables the Plugin
