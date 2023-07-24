import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
const Config = ({en, inputPath = '', outputFile = 'rc-dyn-tabs-core', outputName = 'useDynTabs', pf = false}) => {
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
  },
  ConfigFactory = (op) => [
    Config({en: 'dev', ...op}),
    Config({en: 'prod', ...op}),
    Config({en: 'dev', pf: true, ...op}),
    Config({en: 'prod', pf: true, ...op}),
  ];
export default ConfigFactory().concat(
  ConfigFactory({
    outputFile: 'more-button-plugin',
    outputName: 'MoreButtonPlugin',
    inputPath: 'plugins/moreButtonPlugin/',
  }),
);
