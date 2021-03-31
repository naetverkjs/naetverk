export default {
  input: 'packages/naetverk/src/index.ts',
  name: 'arrange-plugin',
  babelPresets: [require('@babel/preset-typescript')],
  extensions: ['.js', '.ts'],
  onwarn: (error) => {
    if (error.message.includes('(will be ignored)')) {
      return;
    } else {
      console.error(error.message);
    }
  },
};
