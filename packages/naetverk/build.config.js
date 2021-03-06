export default {
  rollup: {
    input: 'packages/naetverk/src/index.ts',
    name: 'naetverk',
    babelPresets: [require('@babel/preset-typescript')],
    extensions: ['.js', '.ts'],
    onwarn: (error) => {
      if (!error.message.includes('(will be ignored)')) {
        console.error(error.message);
      }
    },
  },
  exporter: 'naetverk',
  exportTypes: true,
  exportFormats: [
    { suffix: 'min', format: 'umd', minify: true, polyfill: true },
    { suffix: 'esm', format: 'es' },
    { suffix: 'es6', format: 'es' },
    { suffix: 'common', format: 'cjs' },
  ],
};
