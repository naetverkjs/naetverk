import * as fs from 'fs';
import * as path from 'path';

export function hasFiles(dir: string, ...names: string[]) {
  for (const name of names) {
    const file = path.resolve(dir, name);

    if (!fs.existsSync(file)) {
      return false;
    }
  }

  return true;
}

export function getProcessType(dir) {
  if (hasFiles(dir, 'workspace.json', 'package.json', 'nx.json')) {
    return 'workspace';
  } else if (hasFiles(dir, 'angular.json', 'package.json', 'nx.json')) {
    return 'angular';
  } else {
    return null;
  }
}

export function writeInFile(targetPath: string, sourcePath: string) {
  const targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  const transferFields = [
    'version',
    'repository',
    'keywords',
    'author',
    'license',
    'bugs',
  ];

  for (const field of transferFields) {
    targetContent[field] = sourceContent[field];
  }
  fs.writeFileSync(targetPath, JSON.stringify(targetContent));
}
