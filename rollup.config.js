import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
const getConfig = ({en, inputPath = '', outputFile = 'rc-dyn-tabs', outputName = 'useDynTabs', pf = false}) => {
  var pfName = pf ? '.including-polyfills' : '';
  return {
    input: `lib/${pf ? 'esm-including-polyfills' : 'esm'}/${inputPath}index.js`,
    output: {
      file: `dist/${outputFile}${pfName}.umd${en === 'dev' ? '' : '.min'}.js`,
      format: 'umd',
      name: outputName,
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
export default [
  getConfig({en: 'dev'}),
  getConfig({en: 'prod'}),
  getConfig({en: 'dev', pf: true}),
  getConfig({en: 'prod', pf: true}),
  getConfig({
    en: 'dev',
    outputFile: 'rc-dyn-tabs-responsive-plugin',
    outputName: 'ReactDynTabs_ResponsivePlugin',
    inputPath: 'modules/responsive/',
  }),
  getConfig({
    en: 'prod',
    outputFile: 'rc-dyn-tabs-responsive-plugin',
    outputName: 'ReactDynTabs_ResponsivePlugin',
    inputPath: 'modules/responsive/',
  }),
  getConfig({
    en: 'dev',
    pf: true,
    outputFile: 'rc-dyn-tabs-responsive-plugin',
    outputName: 'ReactDynTabs_ResponsivePlugin',
    inputPath: 'modules/responsive/',
  }),
  getConfig({
    en: 'prod',
    pf: true,
    outputFile: 'rc-dyn-tabs-responsive-plugin',
    outputName: 'ReactDynTabs_ResponsivePlugin',
    inputPath: 'modules/responsive/',
  }),
];
