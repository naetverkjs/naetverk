import { CollaborationOptions } from './interfaces/collaboration-options.interface';

export const CollaborationPlugin = {
  name: 'collaboration',
  install,
};

export function install(editor, options: CollaborationOptions) {

  // TODO Setup Connection

  console.log('Collaboration Plugin Initialized');
}
