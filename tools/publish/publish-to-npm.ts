import { execSync } from 'child_process';
import { getProcessType, readJSON } from '../utils/utils';
import ora = require('ora');

const chalk = require('chalk');

require('@babel/register')({
  presets: [require('@babel/preset-env').default],
  ignore: [/node_modules/],
});

export class init {
  public nx: any;
  public baseDir: string;
  public libraries: string[] = [];
  public spinner = ora({ spinner: 'dots2' });

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
          if (!key.includes('renderer')) {
            this.libraries.push(key);
          }
        }
      });

      // Overwrite:
      // This is the list of configured and ready to build libraries.
      this.libraries = [
        'naetverk',
        'angular-renderer',
        'area-plugin',
        'arrange-plugin',
        'comment-plugin',
        'connection-plugin',
        'history-plugin',
        'keyboard-plugin',
        'lifecycle-plugin',
        'selection-plugin',
      ];
      this.publish();
    }
  }

  async publish() {
    console.log('Publish Libraries \n\n');
    for (let i = 0; i < this.libraries.length; i++) {
      let lib = this.libraries[i];
      this.spinner.start(`Publish Library - ${chalk.blue(lib)}`);
      await this.buildLibraryNx(lib);
      this.spinner.succeed();
    }
  }

  /**
   * Current NX default builder that uses webpack.
   * @param {string} library
   * @returns {Promise<void>}
   */
  async buildLibraryNx(library: string) {
    execSync(`npm publish dist/packages/${library}`, {
      stdio: 'pipe',
    });
  }
}

new init();
