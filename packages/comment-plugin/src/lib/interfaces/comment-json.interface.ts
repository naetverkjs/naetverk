import { CommentType } from './comment-type.enum';

export interface CommentJSON {
  text: string;
  position: [number, number];
  links: any;

  type?: CommentType;
  width?: number;
  height?: number;
}
