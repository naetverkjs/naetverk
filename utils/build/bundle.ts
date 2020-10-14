import { PackageOutput } from './package';

import * as typescript from '@rollup/plugin-typescript';
import * as path from 'path';
import * as rollup from 'rollup';
import * as uglifyjs from 'uglify-js';

export type BundleEmitter = (
  name: string,
  content: string | Uint8Array
) => void;

export interface BundleOptions {
  baseDir: string;

  dir: string;

  name: string;

  importName: string;

  version: string;

  tsconfig: string;

  input: string;

  srcpath: string;
}

// tslint:disable-next-line:max-classes-per-file
export class Bundle {
  public static async build(
    output: PackageOutput,
    options: BundleOptions,
    target: string,
    format: 'es' | 'umd',
    minify = false
  ): Promise<Bundle> {
    output.message(
      'Bundling',
      options.name,
      'for target',
      target,
      'and format',
      format
    );

    const srcpath = path.resolve(options.dir, options.srcpath);

    const rollupInput = await rollup.rollup({
      external: (id) => {
        return !(
          id.startsWith('.') ||
          id.startsWith('/') ||
          id === '\0typescript-helpers'
        );
      },
      input: path.resolve(options.dir, options.srcpath, options.input),
      onwarn: (warning) =>
        output.warning(
          `${options.importName}(${target}/${format}): ${warning.message}`
        ),
      plugins: [
        (typescript as any)({
          declaration: true,
          declarationMap: true,
          inlineSourceMap: true,
          inlineSources: true,
          outDir: '.',
          target,
          tsconfig: path.resolve(options.dir, options.tsconfig),
        }),
      ],
    });

    output.message(
      'Generating code for',
      options.name,
      'for target',
      target,
      'and format',
      format
    );

    const rollupOutput = await rollupInput.generate({
      dir: '.',
      format,
      globals: (id) => id,
      name: options.importName,
      sourcemap: true,
    });

    let imports: string[] = [];

    let minifyOutput;

    for (const asset of rollupOutput.output) {
      if (asset.type === 'chunk') {
        if (minifyOutput == null) {
          const map = asset.map!;

          imports = asset.imports;

          map.sources = map.sources.map((file) =>
            path.join(options.importName, path.relative(options.dir, file))
          );

          if (minify) {
            output.message('Minifying ', options.name);

            minifyOutput = uglifyjs.minify(asset.code, {
              sourceMap: {
                content: {
                  file: map.file,
                  mappings: map.mappings,
                  names: map.names,
                  sources: map.sources,
                  sourcesContent: map.sourcesContent,
                  version: map.version.toString(),
                },
              },
            });
          }
        } else {
          throw new Error(`Project ${options.name} has multiple chunks`);
        }
      } else {
        asset.fileName = path.relative(srcpath, asset.fileName);
      }
    }

    return new Bundle(imports, rollupOutput, minifyOutput);
  }

  private constructor(
    public imports: string[],
    private rollupOutput: rollup.RollupOutput,
    private minifyOutput?: uglifyjs.MinifyOutput
  ) {}

  emitChunk(name: string, emitter: BundleEmitter) {
    for (const chunk of this.rollupOutput.output) {
      if (chunk.type === 'chunk') {
        const mapname = `${name}.js.map`;
        const ref = `\n//# sourceMappingURL=${mapname}`;
        emitter(`${name}.js`, chunk.code + ref);
        emitter(mapname, JSON.stringify(chunk.map));
      }
    }
  }

  emitMinify(name: string, emitter: BundleEmitter) {
    if (this.minifyOutput != null) {
      const mapname = `${name}.min.js.map`;
      const ref = `\n//# sourceMappingURL=${mapname}`;
      emitter(`${name}.min.js`, this.minifyOutput.code + ref);
      emitter(mapname, JSON.stringify(this.minifyOutput.map));
    }
  }

  emitAssets(emitter: BundleEmitter) {
    for (const asset of this.rollupOutput.output) {
      if (asset.type === 'asset') {
        emitter(asset.fileName, asset.source);
      }
    }
  }
}
