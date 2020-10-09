# history-plugin
> _This Plugin is based on the [retejs/history-plugin](https://github.com/retejs/history-plugin)_

Plugin that adds the ability to revert actions


### Installation

**Import**

```ts
import { HistoryPlugin } from '@naetverkjs/history';

editor.use(HistoryPlugin);
```

**Configuration**

```ts
editor.use(HistoryPlugin, { keyboard: true });
```

**Available commands**

```ts
editor.trigger('undo');
editor.trigger('redo');
```

**Custom History Actions**

```ts
import { Action } from '@naetverkjs/history';

export class YourAction extends HistoryAction {
  constructor() {
    super();
  }
  undo() {
    ///
  }
  redo() {
    ///
  }
}

editor.trigger('addhistory', new YourAction());
```

**_Example:_** Add text field changes to history

```ts
class FieldChangeAction extends HistoryPlugin.HistoryAction {
  constructor(prev, next, set) {
    super();
    this.prev = prev;
    this.next = next;
    this.set = set;
  }
  undo() {
    this.set(this.prev);
  }
  redo() {
    this.set(this.next);
  }
}

// inside a "change" method of your Control (called by user action)
// this.value - value before changing
// next - new value
// (v) => this.set(v) - change value of Field by undo/redo
this.emitter.trigger(
  'addhistory',
  new FieldChangeAction(this.value, next, (v) => this.set(v))
);
```
