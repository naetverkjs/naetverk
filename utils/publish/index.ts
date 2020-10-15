import { execSync } from 'child_process';
import * as cliProgress from 'cli-progress';
import * as fs from 'fs';
import * as path from 'path';
import { getProcessType } from '../utilities';

export class init {
  public nx: any;
  public baseDir: string;
  public libraries: string[] = [];

  private workspace: any;

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

      const progressBar = new cliProgress.SingleBar(
        cliProgress.Presets.shades_classic
      );

      progressBar.start(this.libraries.length, 0);
      let n = 1;
      const buildMsg: Record<string, any>[] = [];
      this.libraries.forEach((lib) => {
        progressBar.update(n++, {
          message: 'Publishing' + lib,
        });

        if (fs.existsSync(`dist/@naetverkjs/${lib}`)) {
          const buffer = execSync(
            `npm publish dist/@naetverkjs/${lib} --access public --dry-run`,
            {
              stdio: 'pipe',
            }
          );
          buildMsg[lib] = buffer.toString();
        } else {
          buildMsg[lib] = 'Folder does not exist';
        }
      });
      progressBar.stop();

      this.libraries.forEach((lib) => {
        console.log(lib + ':');
        console.log(buildMsg[lib]);
      });
    }
  }
}

new init();
