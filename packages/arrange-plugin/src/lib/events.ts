import { NodeEditor } from '@naetverkjs/naetverk';

declare module '@naetverkjs/naetverk/src/lib/events' {
  export interface EventsTypes {
    arrange: void;
  }
}
