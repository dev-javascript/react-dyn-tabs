const path = require('path');
const pkg = require('./package.json');
module.exports = (env) => {
  const isProduction = env === 'production';
  return {
    entry: {
      'react-dyn-tabs': './src/index.js',
      'more-button-plugin': './src/plugins/moreButtonPlugin/index.js',
    },
    output: {
      filename: `[name].umd${isProduction ? '.min' : ''}.js`,
      path: path.resolve(__dirname, 'build'),
      library: pkg.name,
      libraryTarget: 'umd',
      publicPath: '/build/',
      umdNamedDefine: true,
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    mode: 'development',
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
