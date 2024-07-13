const webpack = require('webpack');
const {version} = require('./package');
const path = require('path');

module.exports = {
  title: 'React Dyn Tabs',
  getComponentPathLine(componentPath) {
    return ``;
  },
  components: 'example/stories/**/*.{jsx,js,tsx}',
  moduleAliases: {
    'react-dyn-tabs': path.resolve(__dirname, './'),
  },
  // assetsDir: "example/stories/assets",
  sections: [
    {
      name: 'Examples',
      content: 'example/stories/minimal-usage/README.md',
      components: 'example/stories/**/*.jsx',
      sectionDepth: 1,
    },
  ],
  styleguideComponents: {},
  pagePerSection: true,
  defaultExample: true,
  usageMode: 'expand',
  version,
  webpackConfig: {
    plugins: [
      new webpack.DefinePlugin({
        process: {
          env: JSON.stringify({
            ...process.env,
          }),
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
      noParse: /\.(scss)/,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.json'],
    },
  },
};
