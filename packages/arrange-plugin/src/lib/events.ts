import { Node } from '@naetverkjs/naetverk';

declare module '@naetverkjs/naetverk/src/lib/events' {
  export interface EventsTypes {
    arrange: Node[];
  }
}
