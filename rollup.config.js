import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
const requirePolyfills = process.env.INCLUDE_POLYFILLS;
export default {
  input: requirePolyfills ? 'lib/esm-including-polyfills/index.js' : 'lib/esm/index.js',
  output: {
    file: requirePolyfills ? 'dist/react-dyn-tabs.including-polyfills.umd.min.js' : 'dist/react-dyn-tabs.umd.min.js',
    format: 'umd',
    name: 'useDynTabs',
    globals: {
      'prop-types': 'PropTypes',
      'react-dom': 'ReactDOM',
      react: 'React',
    },
    sourcemap: true,
  },
  plugins: [terser(), commonjs(), nodeResolve({preferBuiltins: false})],
  external: function (id) {
    return /prop-types$|react$|react-dom$|.test.js$|.js.snap$|.css$/g.test(id);
  },
};
