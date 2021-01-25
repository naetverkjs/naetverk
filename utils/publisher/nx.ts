import { execSync } from 'child_process';
import * as fs from 'fs';
import { Dependency } from '../build/dependency';
import { getProcessType, readJSON } from '../utilities';
import path = require('path');

const chalk = require('chalk');

export class Nx {
  public scope: string;

  public baseDir: string;

  public package: any;

  public nx: any;

  public workspace: any;

  public dependencies: { [key: string]: Dependency } = {};

  public libraries: string[] = [];

  constructor(public output: string) {
    let dir = process.cwd();
    const workspaceType = getProcessType(dir);

    if (workspaceType) {
      this.baseDir = dir;
      this.nx = readJSON(dir, 'nx.json');
      this.workspace = readJSON(dir, `${workspaceType}.json`);
      this.package = readJSON(dir, `package.json`);
      this.scope = ('@' + this.nx.npmScope) as string;

      // Collect Libraries
      for (const key in this.workspace.projects) {
        if (this.workspace.projects[key].projectType === 'library') {
          this.libraries.push(key);
        }
      }
    }
  }

  publishMany(...names: string[]) {
    process.stdout.write(chalk.yellow('Publish ') + ' \n');
    names.forEach((lib) => {
      this.publish(lib);
    });
  }

  publishAll() {
    process.stdout.write(
      chalk.yellow('Publish all ') + this.package.version + ' \n'
    );
    this.libraries.forEach((lib) => {
      this.publish(lib);
    });
  }

  publish(lib) {
    process.stdout.write(' - ' + chalk.yellow(lib));
    const libPath = `dist/packages/${lib}`;
    try {
      if (fs.existsSync(libPath)) {
        const libdata = readJSON(
          this.baseDir,
          path.join(libPath, 'package.json')
        );
        const libName = libdata.name;
        process.stdout.write(chalk.blue(libdata.version));
        const buffer = this.systemSync(`npm view ${libName} --json`);

        if (JSON.parse(buffer).version === libdata.version) {
          process.stdout.write(chalk.red(' x ') + 'Already Published' + ' \n');
        } else {
          // Actually do the command
          this.systemSync(`npm publish dist/packages/${lib} --access public`);
          process.stdout.write(chalk.greenBright(' ✓') + ' \n');
        }
      } else {
        process.stdout.write(
          `${chalk.yellowBright(` -`)} Skipped - Folder missing
`
        );
      }
    } catch (error) {
      process.stdout.write(
        `${chalk.red(
          ' x'
        )} The package does not exist or was build with ivy. Trying anyway \n`
      );
      this.systemSync(`npm publish dist/packages/${lib} --access public`);
    }
  }

  unpublishMany(...names: string[]) {
    process.stdout.write(
      chalk.yellow('Unpublish ') + this.package.version + ' \n'
    );
    names.forEach((lib) => {
      this.unpublish(lib.replace('-plugin', ''));
    });
  }

  unpublishAll() {
    process.stdout.write(
      chalk.yellow('Unpublish all ') + this.package.version + ' \n'
    );
    this.libraries.forEach((lib) => {
      this.unpublish(lib.replace('-plugin', ''));
    });
  }

  unpublish(lib) {
    process.stdout.write(' - ' + chalk.yellow(lib));
    try {
      const buffer = this.systemSync(`npm view ${this.scope}/${lib} --json`);
      if (JSON.parse(buffer).version !== this.package.version) {
        process.stdout.write(chalk.red(' x') + ' Wrong version' + ' \n');
      } else {
        // Actually do the command
        this.systemSync(
          `npm unpublish ${this.scope}/${lib}@${this.package.version}`
        );
        process.stdout.write(chalk.greenBright(' ✓') + ' \n');
      }
    } catch (error) {
      process.stdout.write(
        chalk.red(' x') + ' The package does not exist' + ' \n'
      );
    }
  }

  systemSync(cmd) {
    try {
      return execSync(cmd, {
        stdio: 'pipe',
      }).toString();
    } catch (error) {
      throw error;
    }
  }

  facit(buildMsg) {
    process.stdout.write(' Results: \n');
    this.libraries.forEach((lib) => {
      process.stdout.write(' - ' + chalk.yellow(lib));
      console.log(buildMsg[lib].version);
    });
  }
}
