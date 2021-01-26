import * as fs from 'fs';
import * as path from 'path';

export function hasFiles(dir: string, ...names: string[]): boolean {
  for (const name of names) {
    const file = path.resolve(dir, name);

    if (!fs.existsSync(file)) {
      return false;
    }
  }

  return true;
}

export function getProcessType(dir): string | null {
  if (hasFiles(dir, 'workspace.json', 'package.json', 'nx.json')) {
    return 'workspace';
  } else if (hasFiles(dir, 'angular.json', 'package.json', 'nx.json')) {
    return 'angular';
  } else {
    return null;
  }
}

export function readJSON(baseDir: string, dir: string): string {
  const file = path.resolve(baseDir, dir);
  const json = fs.readFileSync(file, 'utf-8');
  return JSON.parse(json);
}
