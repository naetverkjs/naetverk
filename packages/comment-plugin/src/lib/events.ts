import { Node } from '@naetverkjs/naetverk';
import Comment from './comments/comment';

/**
 * Add the needed event listerner types to the @naetverjks event list
 */
declare module '@naetverkjs/naetverk/src/lib/events' {
  export interface EventsTypes {
    commentselected: any;
    commentcreated: any;
    commentremoved: any;
    syncframes: any;
    addcomment: any;
    removecomment: any;
    editcomment: any;
  }
}

/**
 * Add the comments to the @naetverkjs data type
 */
declare module '@naetverkjs/naetverk/src/lib/core/data' {
  export interface Data {
    comments?: Comment[] | [];
  }
}
