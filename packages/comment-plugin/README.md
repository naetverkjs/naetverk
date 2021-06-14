# comment-plugin

This library was generated with [Nx](https://nx.dev).

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

The Area Plugin adds a background layer. If you have the `z-index` of your comments to low - they will not be
selectable anymore.

Snapp If you have the snap option enabled:

```
  snap: { dynamic: true, size: 16 },
```

The position of the nodes are not updated like the surrounding frames
