import { PackageBuilder, PackageOutput } from './package';

import * as cliProgress from 'cli-progress';
import * as fs from 'fs';
import * as path from 'path';

import { Dependency } from './dependency';

// tslint:disable:no-console

function ensurefile(dir: string, ...segments: string[]) {
  const file = path.resolve(dir, ...segments);
  // @ts-ignore
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
}

function hasFiles(dir: string, ...names: string[]) {
  for (const name of names) {
    const file = path.resolve(dir, name);

    if (!fs.existsSync(file)) {
      return false;
    }
  }

  return true;
}

function copyEntries(output: any, input: any, key: string) {
  const map = input[key];

  if (map != null) {
    for (const idx of map) {
      output[idx] = [key, map[idx]];
    }
  }
}

function merge(a: any, b: any) {
  if (b != null) {
    // @ts-ignore
    for (const [key, value] of Object.entries(b)) {
      if (typeof value === 'object') {
        if (typeof a[key] === 'object') {
          merge(a[key], value);
          continue;
        }
      } else if (value instanceof Array) {
        if (a[key] instanceof Array) {
          a[key].push(value);
          continue;
        }
      }

      a[key] = value;
    }
  }
}

export class Nx {
  public scope: string;

  public baseDir: string;

  public package: any;

  public nx: any;

  public workspace: any;

  public dependencies: { [key: string]: Dependency } = {};

  public projects: string[] = [];

  constructor(public output: string) {
    let dir = process.cwd();
    let projectType = undefined;

    for (;;) {
      if (hasFiles(dir, 'workspace.json', 'package.json', 'nx.json')) {
        projectType = 'workspace';
      } else if (hasFiles(dir, 'angular.json', 'package.json', 'nx.json')) {
        projectType = 'angular';
      }
      if (projectType) {
        this.baseDir = dir;
        this.package = this.readJSON('package.json');
        this.nx = this.readJSON('nx.json');
        this.workspace = this.readJSON(projectType + '.json');
        this.scope = ('@' + this.nx.npmScope) as string;

        copyEntries(this.dependencies, this.package, 'peerDependencies');
        copyEntries(this.dependencies, this.package, 'devDependencies');
        copyEntries(this.dependencies, this.package, 'dependencies');

        for (const key in this.workspace.projects) {
          if (this.workspace.projects[key].projectType === 'library') {
            this.projects.push(key);
            this.dependencies[`${this.scope}/${key}`] = {
              type: 'dependencies',
              version: this.package.version,
            };
          }
        }

        return;
      }

      const parent = path.resolve(dir, '..');

      if (parent === dir) {
        throw new Error('No valid nx workspace found');
      }

      dir = parent;
    }
  }

  public async bundleAll() {
    return this.bundleMany(...this.projects);
  }

  public async bundleMany(...names: string[]) {
    for (const name of names) {
      await this.bundle(name);
    }
  }

  public async bundle(name: string) {
    const importName = `${this.scope}/${name}`;

    const libsDir = this.nx.workspaceLayout.libsDir
      ? this.nx.workspaceLayout.libsDir
      : 'libs';
    const projectDir = path.join(libsDir, name);

    const progressBar = new cliProgress.SingleBar(
      {
        format: `${importName}: {message}`,
        fps: 25,
      },
      cliProgress.Presets.shades_classic
    );

    progressBar.start(0, 0, {
      message: 'Starting',
    });

    const outputPath = path.resolve(
      this.baseDir,
      this.output,
      this.scope,
      name
    );

    const warnings: string[] = [];

    let n = 1;

    const output: PackageOutput = {
      message: (...text) => {
        progressBar.update(n++, {
          message: text.join(' '),
        });
      },
      warning: (text) => {
        warnings.push(text);
      },
      emit: (file, content) => {
        file = path.resolve(outputPath, file);
        ensurefile(file);
        fs.writeFileSync(file, content, { encoding: 'utf-8' });
      },
      package: (pkg) => {
        merge(pkg, this.tryJSON('package-template.json'));
        merge(
          pkg,
          this.tryJSON(path.join(projectDir, 'package-template.json'))
        );

        const file = path.resolve(outputPath, 'package.json');
        fs.writeFileSync(file, JSON.stringify(pkg, null, 2), {
          encoding: 'utf-8',
        });
      },
    };

    const project = new PackageBuilder(output, (dep) => this.dependency(dep));

    await project.bundle({
      baseDir: this.baseDir,
      dir: path.join(this.baseDir, projectDir),
      importName,
      input: 'index.ts',
      name,
      srcpath: 'src',
      tsconfig: 'tsconfig.lib.json',
      version: this.package.version as string,
    });

    progressBar.update(n++, {
      message: 'Done',
    });

    progressBar.stop();

    if (warnings.length !== 0) {
      console.log(`${warnings.length} warning(s):`);
      warnings.forEach((w) => console.log('  ', w));
    }
  }

  public dependency(name: string) {
    return this.dependencies[name];
  }

  private tryJSON(dir: string) {
    const file = path.resolve(this.baseDir, dir);

    if (fs.existsSync(file)) {
      const json = fs.readFileSync(file, 'utf-8');
      return JSON.parse(json);
    }

    return null;
  }

  private readJSON(dir: string) {
    const file = path.resolve(this.baseDir, dir);
    const json = fs.readFileSync(file, 'utf-8');
    return JSON.parse(json);
  }
}
