const webpack = require('webpack');
const {version} = require('./package');
const path = require('path');

module.exports = {
  title: 'react-dyn-tabs',
  getComponentPathLine(componentPath) {
    return ``;
  },
  components: 'example/stories/**/*.{jsx,js,tsx}',
  moduleAliases: {
    'react-dyn-tabs': path.resolve(__dirname, './'),
  },
  ribbon: {
    // Link to open on the ribbon click (required)
    url: 'https://github.com/dev-javascript/react-dyn-tabs',
    // Text to show on the ribbon (optional)
    text: 'Fork me on GitHub',
  },
  // assetsDir: "example/stories/assets",
  sections: [
    {
      name: 'Minimal Usage',
      content: 'example/stories/minimal-usage/README.md',
      sectionDepth: 1,
    },
    {
      name: 'Simple Manipulation',
      content: 'example/stories/simple-manipulation/README.md',
      //components: 'example/stories/**/*.jsx',
      sectionDepth: 1,
    },
    {
      name: 'Responsive',
      content: 'example/stories/responsive/README.md',
      //components: 'example/stories/**/*.jsx',
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
