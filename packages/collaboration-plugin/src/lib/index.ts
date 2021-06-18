import { CollaborationOptions } from './interfaces/collaboration-options.interface';

export const CollaborationPlugin = {
  name: 'collaboration',
  install,
};

export function install(editor, options: CollaborationOptions) {
  console.log('Collaboration Plugin Initialized');
}
