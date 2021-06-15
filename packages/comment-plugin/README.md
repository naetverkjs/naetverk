# comment-plugin

This plugin allows the creation of inline and frame comments.

- Inline comment can be attached to a target node.
- Frame comments allow grouping of nodes.

### Installation

**Import**

```typescript
import { CommentPlugin } from '@naetverkjs/comments';
editor.use(CommentPlugin);
```

**Configuration**

```typescript
editor.use(CommentPlugin, {
  margin: number, // The Margin of the comments. Default: 30
  snapSize: number | undefined, // If defined, the comment will snap to the grid
  // Key Bindings:
  frameCommentKeys: {
    code: 'KeyF',
    shiftKey: true,
    ctrlKey: false,
    altKey: false,
  }, // Default: Shift+F
  inlineCommentKeys: {
    code: 'KeyC',
    shiftKey: true,
    ctrlKey: false,
    altKey: false,
  }, // Default: Shift+C
  deleteCommentKeys: {
    code: 'Delete',
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
  }, // Delete
});
```

**Use**

```typescript
// Creates a frame around the selected nodes with the text as title
editor.trigger('addcomment', { type: 'frame', text, nodes });

// Creates a comment at a given position
editor.trigger('addcomment', { type: 'inline', text, position });

// Removes a comment or all by type
editor.trigger('removecomment', { comment });
editor.trigger('removecomment', { type });
```


### Styling

To display the comments, add the following scss to your component. You can also overwrite this if you want.

```scss
.inline-comment,
.frame-comment {
  font-family: 'Roboto', sans-serif;
  color: black;
  padding: 12px;
  font-size: 80%;
  position: absolute;
  cursor: move;
  border-radius: 3px;
  &:focus {
    outline: none;
    border-color: #f1df97;
  }
}
.inline-comment {
  z-index: 4;
  background: #e7edff;
  border: 2px dashed #aec4ff;
  &.connected {
    border: 2px solid #7489c5;
  }
}
.frame-comment {
  z-index: -1;
  background: rgba(15, 80, 255, 0.2);
  border: 2px solid transparent;
}
```

## Working with other plugins

### Auto-Arrange Plugin

If you use the auto-arrange plugin you need to trigger the `syncframes` call as well - so that the comment position
updates.

```typescript
// Trigger the arrange call
editor.arrange();
// Also sync the comments
editor.trigger('syncframes');
```

### Area Plugin

The Area Plugin adds a background layer. If you have the `z-index` of your comments to low - they will not be selectable
anymore.

Snap: If you have the snap option enabled, the position of the comments are not bind to this value. You have to use
the `snapSize` option of the comment plugin with the same value.
