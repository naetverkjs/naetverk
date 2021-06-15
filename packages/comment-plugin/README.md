# comment-plugin

This plugin allows the creation of inline and frame comments.

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
