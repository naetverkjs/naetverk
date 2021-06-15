import { KeyMap } from './key-map.interface';

export interface CommentsOptions {
  /**
   * The margin around a comment
   */
  margin?: number;

  /**
   * Disables the browser edit prompt
   */
  disableBuiltInEdit?: boolean;

  /**
   * Sets the creation key map for frame comments
   */
  frameCommentKeys?: KeyMap;

  /**
   * Sets the creation key map for inline comments
   */
  inlineCommentKeys?: KeyMap;

  /**
   * Sets the key map for deletion of comments
   */
  deleteCommentKeys?: KeyMap;

  /**
   * If defined, the comments will snap to the grid
   */
  snapSize?: number | undefined;
}
