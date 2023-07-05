const path = require('path');
const pkg = require('./package.json');
const libraryName = pkg.name;
module.exports = (env) => {
  const isProduction = env === 'production';
  return {
    entry: {'rc-dyn-tabs-core': './src/index.js', 'rc-dyn-tabs-responsive-plugin': './src/modules/responsive/index.js'},
    output: {
      filename: `[name].umd${isProduction ? '.min' : ''}.js`,
      path: path.resolve(__dirname, 'build'),
      library: libraryName,
      libraryTarget: 'umd',
      publicPath: '/build/',
      umdNamedDefine: true,
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    mode: env,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      alias: {
        assets: path.resolve(__dirname, 'assets'),
      },
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
        root: 'ReactDOM',
      },
    },
  };
};
