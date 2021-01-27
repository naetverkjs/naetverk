import { rollup } from 'rollup';
import { getProcessType, readJSON } from '../utils/utils';
const buildConfig = require('./build.config');
import ora = require('ora');

require('@babel/register')({
  presets: [require('@babel/preset-env').default],
  ignore: [/node_modules/],
});

let opts = [
  { suffix: 'min', format: 'umd', minify: true, polyfill: true },
  { suffix: 'esm', format: 'es' },
  { suffix: 'common', format: 'cjs' },
];

async function buildLibrary(library: string, baseDir: string) {
  return new Promise(async (resolve) => {
    let configPath = `${process.cwd()}/packages/${library}/build.config.js`;
    let packagePath = `${process.cwd()}/packages/${library}/package.json`;

    let config = require(configPath).default;
    let pkg = require(packagePath);

    console.log(config);
    console.log(pkg);

    for (let opt of opts) {
      let targetConfig = buildConfig(config, pkg, opt);
      let bundle = await rollup(targetConfig);

      await bundle.generate(targetConfig.output);
      await bundle.write(targetConfig.output);
    }

    setTimeout(() => {
      resolve();
    }, 100);
  });
}

export class init {
  public nx: any;
  public baseDir: string;
  public libraries: string[] = [];
  public spinner = ora();

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

      // Overwrite:
      this.libraries = ['naetverk'];
      this.builder();
    }
  }

  async builder() {
    console.log('Building Packages');
    for (let i = 0; i < this.libraries.length; i++) {
      let lib = this.libraries[i];
      this.spinner.start(lib);
      await buildLibrary(lib, this.baseDir);
      this.spinner.succeed();
    }
  }
}

new init();
