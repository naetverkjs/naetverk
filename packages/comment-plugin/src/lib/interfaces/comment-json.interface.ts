import { CommentType } from './comment-type.enum';

export interface CommentJSON {
  id: number;
  text: string;
  position: [number, number];
  links: any;

  type?: CommentType;
  width?: number;
  height?: number;
}
