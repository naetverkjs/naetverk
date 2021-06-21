import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { getProcessType, readJSON } from '../utils/utils';
import ora = require('ora');

/**
 * Updates the library packages from the base package
 * @param {string} lib
 * @param workspace
 */
function updateLibraryPackage(lib: string, workspace: any) {
  const targetPath = path.resolve(workspace.projects[lib].root, 'package.json');
  const sourcePath = './tools/base.package.json';

  updatePackageFile(targetPath, sourcePath);
}

function updatePackageFile(targetPath: string, sourcePath: string) {
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

  const peerDependencies = targetContent['peerDependencies'];
  if (peerDependencies) {
    peerDependencies['@naetverkjs/naetverk'] = targetContent['version'];
  }
  console.log(peerDependencies);

  /*
  targetContent['peerDependencies'] = {
    '@naetverkjs/naetverk': '0.8.5',
  };
*/

  fs.writeFileSync(targetPath, JSON.stringify(targetContent));
}

export class init {
  public nx: any;

  public baseDir: string;
  public libraries: string[] = [];

  private readonly workspace: any;

  constructor() {
    let dir = process.cwd();
    const workspaceType = getProcessType(dir);
    if (workspaceType) {
      this.baseDir = dir;
      this.nx = readJSON(this.baseDir, 'nx.json');
      this.workspace = readJSON(this.baseDir, `${workspaceType}.json`);

      // Traverse though workspace and filter for libraries
      Object.keys(this.workspace.projects).forEach((key) => {
        if (this.workspace.projects[key].projectType === 'library') {
          this.libraries.push(key);
        }
      });

      const spinner = ora();
      updatePackageFile('./tools/base.package.json', './package.json');

      console.log('Writing data in to package.json file');
      this.libraries.forEach((lib) => {
        spinner.start(lib);
        updateLibraryPackage(lib, this.workspace);
        spinner.succeed();
      });

      execSync('nx format:write', { stdio: 'pipe' });
    }
  }
}

new init();
