import { execSync } from 'child_process';
import { rollup } from 'rollup';
import { getProcessType, readJSON } from '../utils/utils';
const buildConfig = require('./build.config');
import ora = require('ora');
const chalk = require('chalk');

require('@babel/register')({
  presets: [require('@babel/preset-env').default],
  ignore: [/node_modules/],
});

let opts = [
  { suffix: 'min', format: 'umd', minify: true, polyfill: true },
  { suffix: 'esm', format: 'es' },
  { suffix: 'common', format: 'cjs' },
];

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
      // this.libraries = ['naetverk'];
      this.builder();
    }
  }

  async builder() {
    console.log('Building Libraries');
    for (let i = 0; i < this.libraries.length; i++) {
      let lib = this.libraries[i];
      this.spinner.start(`Building Library - ${chalk.blue(lib)}`);
      await this.buildLibrary(lib, this.baseDir);
      this.spinner.succeed();
    }
  }

  async buildLibrary(library: string, baseDir: string) {
    let configPath = `${process.cwd()}/packages/${library}/build.config.js`;
    let packagePath = `${process.cwd()}/packages/${library}/package.json`;

    let config = require(configPath).default;
    let pkg = require(packagePath);
    // overwrite
    // opts = []
    for (let opt of opts) {
      this.spinner.text = `Building Library - ${chalk.blue(
        library
      )} : ${chalk.yellow(opt.format)}`;

      let targetConfig = buildConfig(config, pkg, opt);
      let bundle = await rollup(targetConfig);

      await bundle.generate(targetConfig.output);
      await bundle.write(targetConfig.output);
    }

    try {
      // Create types

      this.spinner.text = `Building Library - ${chalk.blue(
        library
      )} : ${chalk.yellow('types')}`;

      const buffer = execSync(
        `tsc ${process.cwd()}/${
          config.input
        } --target es5 --declaration --outDir ${process.cwd()}/dist/package/${
          config.name
        } --downlevelIteration --emitDeclarationOnly`,
        {
          stdio: 'pipe',
        }
      );
      console.log(buffer.toString());
    } catch (e) {
      this.spinner.text = `Building Library - ${chalk.blue(
        library
      )} : ${chalk.red('types failed')}`;    }
  }
}

new init();
