#!/usr/bin/env node
import * as yargs from 'yargs';
import { Nx } from './nx';

// tslint:disable: no-empty
// tslint:disable-next-line:no-unused-expression
yargs
  .scriptName('ntvk-publisher')
  .options({
    output: {
      alias: 'o',
      default: 'dist',
      demandOption: false,
      describe: 'Target directory of the bundle',
      type: 'string',
    },
  })
  .command(
    'all',
    'Build and bundle all libraries',
    () => {},
    (argv) => {
      console.log('Build all', argv);
      // return new Nx(argv.output).bundleAll();
    }
  )
  .command(
    'build <projects...>',
    'Build and bundle multiple libraries',
    (cargs) => {
      cargs.positional('projects', {
        describe: 'project name',
      });
    },
    (argv) => {
      console.log('Build many', argv);
      // return new Nx(argv.output).bundleMany(...(argv.projects as string[]));
    }
  )
  .command(
    'publish-all',
    'Publish all libraries',
    () => {},
    (argv) => {
      return new Nx(argv.output).publishAll();
    }
  )
  .command(
    'publish <projects...>',
    'Publish multiple libraries',
    (cargs) => {
      cargs.positional('projects', {
        describe: 'name of the project',
      });
    },
    (argv) => {
      return new Nx(argv.output).publishMany(...(argv.projects as string[]));
    }
  )

  .command(
    'unpublish-all',
    'Unpublish the latest version of all libraries',
    () => {},
    (argv) => {
      return new Nx(argv.output).unpublishAll();
    }
  )

  .command(
    'unpublish <projects...>',
    'Unpublish multiple libraries',
    (cargs) => {
      cargs.positional('projects', {
        describe: 'name of the project',
      });
    },
    (argv) => {
      return new Nx(argv.output).unpublishMany(...(argv.projects as string[]));
    }
  )

  .usage('$0 <cmd> [args]')
  .version('0.0.1')
  .help()
  .demandCommand()
  .strict().argv;
