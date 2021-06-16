import { CommentType } from '@naetverkjs/comments';

export interface IComment {
  id: number;
  text: string;
  position: [number, number];

  links?: any;
  type?: CommentType;
  width?: number;
  height?: number;
}
