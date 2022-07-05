import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
const getConfig = (en, pf) => {
  var pfName = pf ? '.including-polyfills' : '';
  return {
    input: pf ? 'lib/esm-including-polyfills/index.js' : pkg.module,
    output: {
      file: en === 'dev' ? 'dist/react-dyn-tabs' + pfName + '.umd.js' : 'dist/react-dyn-tabs' + pfName + '.umd.min.js',
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
      const _plugins = [nodeResolve({preferBuiltins: false}), commonjs()];
      if (en === 'prod') {
        _plugins.push(terser());
      }
      return _plugins;
    })(),
    external: function (id) {
      return /prop-types$|react$|react-dom$|.test.js$|.js.snap$|.css$/g.test(id);
    },
  };
};
export default [getConfig('dev'), getConfig('prod'), getConfig('dev', true), getConfig('prod', true)];
