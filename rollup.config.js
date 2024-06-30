// import {terser} from 'rollup-plugin-terser';
// import commonjs from '@rollup/plugin-commonjs';
// import nodeResolve from '@rollup/plugin-node-resolve';
const terser = require('@rollup/plugin-terser');
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const pkg = require('./package.json');
const Config = ({en, inputPath = '', outputFile = 'react-dyn-tabs', outputName = 'useDynTabs', pf = false}) => {
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
        banner:
          '' +
          `/**
 * ${pkg.name} - ${pkg.description}
 *
 * @version v${pkg.version}
 * @homepage ${pkg.homepage}
 * @author ${pkg.author.name} ${pkg.author.email}
 * @license ${pkg.license}
 */`,
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
  ConfigFactory = (op) => [Config({en: 'dev', ...op}), Config({en: 'prod', ...op})];
module.exports = ConfigFactory().concat(
  ConfigFactory({
    outputFile: 'more-button-plugin',
    outputName: 'MoreButtonPlugin',
    inputPath: 'plugins/moreButtonPlugin/',
  }),
);
