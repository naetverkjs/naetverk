const babel = require('rollup-plugin-babel');
const Case = require('case');
const regenerator = require('rollup-plugin-regenerator');
const { uglify } = require('rollup-plugin-uglify');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

/**
 * Generates the banner
 * @param pkg
 * @returns {string}
 */
const banner = (pkg) => {
  const { name, version, author, license } = pkg;
  return `/*!\n* ${name} v${version} \n* (c) ${new Date().getFullYear()} ${author} \n* Released under the ${license} license.\n*/`;
};

/**
 * The rollup default module configuration
 **/
module.exports = (
  {
    input,
    name,
    plugins = [],
    globals = {},
    babelPlugins = [],
    babelPresets = [],
    extensions = ['.js'],
    ...options
  },
  pkg,
  { suffix, format, minify = false, polyfill = false }
) => ({
  input,
  output: {
    file: `dist/package/${name}/${Case.kebab(name)}.${suffix}.js`,
    name,
    format,
    sourcemap: true,
    banner: banner(pkg),
    globals,
    exports: 'named',
  },
  watch: {
    include: 'src/**',
    chokidar: false,
  },
  external: Object.keys(globals),
  plugins: [
    ...plugins,
    commonjs(),
    resolve({
      extensions,
    }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [require('@babel/preset-env'), ...babelPresets],
      plugins: [
        require('@babel/plugin-proposal-class-properties'),
        require('@babel/plugin-proposal-object-rest-spread'),
        ...babelPlugins,
      ],
      extensions,
    }),
    ...(minify
      ? [
          uglify({
            output: {
              preamble: banner(pkg),
            },
          }),
        ]
      : []),
    ...(polyfill ? [regenerator()] : []),
  ],
  ...options,
});
