import { FrameTypes } from './frame-types.interface';
import { CommentType } from './comment-type.enum';

export interface IComment {
  id: number;
  text: string;
  position: [number, number];

  links?: any;
  type?: CommentType;
  width?: number;
  height?: number;
  frameType?: FrameTypes;
}
