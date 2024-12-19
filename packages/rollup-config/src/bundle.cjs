const nodeResolve = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const image = require('@rollup/plugin-image');
const commonjs = require('@rollup/plugin-commonjs');

/**
 * @type {import('rollup').RollupOptions}
 */
const bundle = {
  input: Object.fromEntries(
    globSync(input).reduce((acc, file) => {
      const passed = getIsFilePassed(path.join(packageDir, file), exclude);

      if (!passed) {
        return acc;
      }

      return [
        ...acc,
        [path.relative('src', file.slice(0, file.length - path.extname(file).length)), `${packageDir}/${file}`],
      ];
    }, [])
  ),
  plugins: [json(), commonjs(), image(), nodeResolve()],
};

module.exports = bundle;
