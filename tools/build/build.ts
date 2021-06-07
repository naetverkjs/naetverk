import { execSync } from 'child_process';
import * as fs from 'fs';
import { rollup } from 'rollup';
import { getProcessType, readJSON } from '../utils/utils';

const buildConfig = require('./build.config');
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
        'connection-plugin',
        'history-plugin',
        'keyboard-plugin',
        'lifecycle-plugin',
        'selection-plugin',
      ];
      this.builder();
    }
  }

  async builder() {
    console.log('Building Libraries \n\n');
    for (let i = 0; i < this.libraries.length; i++) {
      let lib = this.libraries[i];
      this.spinner.start(`Building Library - ${chalk.blue(lib)}`);
      await this.buildLibraryNx(lib);
      this.spinner.succeed();
    }
  }

  async exportFormat(opt: any, library: string, config: any, pkg: any) {
    this.spinner.text = `Building Library - ${chalk.blue(
      library
    )} : ${chalk.yellow(opt.format)}`;

    let targetConfig = buildConfig(config.rollup, pkg, opt);
    let bundle = await rollup(targetConfig);

    await bundle.generate(targetConfig.output);
    await bundle.write(targetConfig.output);
  }

  /**
   * Current NX default builder that uses webpack.
   * @param {string} library
   * @returns {Promise<void>}
   */
  async buildLibraryNx(library: string) {
    execSync(`nx run-many --target=build --projects=${library} --prod`, {
      stdio: 'pipe',
    });
  }

  async buildLibrary(library: string) {
    let configPath = `${process.cwd()}/packages/${library}/build.config.js`;
    let packagePath = `${process.cwd()}/packages/${library}/package.json`;

    let config = require(configPath).default;
    let pkg = require(packagePath);

    // Export all the defined formats
    for (let opt of config.exportFormats) {
      await this.exportFormat(opt, library, config, pkg);
    }

    // Export the types
    if (config.exportTypes) {
      await this.exportTypes(library, config);
    }

    // Copy package.json
    this.copyPackageFile(library, config);
  }

  private async exportTypes(library: string, config: any) {
    try {
      // Create types
      this.spinner.text = `Building Library - ${chalk.blue(
        library
      )} : ${chalk.yellow('types')}`;

      execSync(
        `tsc ${process.cwd()}/${
          config.rollup.input
        } --target es5 --declaration --outDir ${process.cwd()}/dist/package/${
          config.rollup.name
        } --downlevelIteration --emitDeclarationOnly --skipLibCheck`,
        {
          stdio: 'pipe',
        }
      );
    } catch (e) {
      console.error(e.toString());
      this.spinner.text = `Building Library - ${chalk.blue(
        library
      )} : ${chalk.red('types failed')}`;
    }
  }

  copyPackageFile(library: string, config: any) {
    let src = `${process.cwd()}/packages/${library}/package.json`;
    let dest = `${process.cwd()}/dist/package/${
      config.rollup.name
    }/package.json`;
    fs.copyFileSync(src, dest);
  }
}

new init();
