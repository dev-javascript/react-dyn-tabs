import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';
import nodeResolve from '@rollup/plugin-node-resolve';
const getConfig = (en) => ({
  input: pkg.module,
  output: {
    file: en === 'dev' ? 'dist/react-dyn-tabs.umd.js' : 'dist/react-dyn-tabs.umd.min.js',
    format: 'umd',
    name: 'useDynTabs',
    globals: {
      'prop-types': 'PropTypes',
      'react-dom': 'ReactDOM',
      react: 'React',
    },
    sourcemap: true,
  },
  plugins: (function () {
    const _plugins = [nodeResolve({preferBuiltins: false})];
    if (en === 'prod') {
      _plugins.push(terser());
    }
    return _plugins;
  })(),
  external: function (id) {
    return /prop-types$|react$|react-dom$|.test.js$|.js.snap$|.css$/g.test(id);
  },
});
export default [getConfig('dev'), getConfig('prod')];
