import {Node} from '@naetverkjs/naetverk';

declare module '@naetverkjs/naetverk/src/lib/events' {
  export interface EventsTypes {
    undo: void;
    redo: void;
    addhistory: void;
  }
}
