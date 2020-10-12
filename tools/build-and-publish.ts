import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

function hasFiles(dir: string, ...names: string[]) {
  for (const name of names) {
    const file = path.resolve(dir, name);

    if (!fs.existsSync(file)) {
      return false;
    }
  }

  return true;
}

function getProcessType(dir) {
  if (hasFiles(dir, 'workspace.json', 'package.json', 'nx.json')) {
    return 'workspace';
  } else if (hasFiles(dir, 'angular.json', 'package.json', 'nx.json')) {
    return 'angular';
  } else {
    return null;
  }
}

function updateLibraryPackage(lib: string, workspace: any) {
  const targetPath = path.resolve(workspace.projects[lib].root, 'package.json');
  const sourcePath = './tools/base.package.json';

  writeInFile(targetPath, sourcePath);
}

function writeInFile(targetPath: string, sourcePath: string) {
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

export class init {
  public nx: any;

  public baseDir: string;
  private workspace: any;
  public libraries: string[] = [];

  private readJSON(dir: string) {
    const file = path.resolve(this.baseDir, dir);
    const json = fs.readFileSync(file, 'utf-8');
    return JSON.parse(json);
  }

  constructor() {
    let dir = process.cwd();
    const workspaceType = getProcessType(dir);
    if (workspaceType) {
      this.baseDir = dir;
      this.nx = this.readJSON('nx.json');
      this.workspace = this.readJSON(`${workspaceType}.json`);

      // Collect Libraries
      for (const key in this.workspace.projects) {
        if (this.workspace.projects[key].projectType === 'library') {
          this.libraries.push(key);
        }
      }

      writeInFile('./tools/base.package.json', './package.json');

      console.log('\nUpdating: ');
      this.libraries.forEach((lib) => {
        console.log('- ', lib);
        updateLibraryPackage(lib, this.workspace);
      });

      console.log('\nFormat: ');
      execSync('nx format:write');

      console.log('\nBuilding');
      this.libraries.forEach((lib) => {
        console.log('- ', lib);
        execSync('nx build ' + lib);
      });
    }
  }
}

new init();
