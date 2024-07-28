const webpack = require('webpack');
const {version, name} = require('./package');
const path = require('path');

module.exports = {
  title: name,
  template: {
    head: {
      meta: [
        {
          name: 'description',
          content:
            'react-dyn-tabs : create responsive and dynamic tabs, supports ARIA accessibility and provides complete control over tab management using hook.',
        },
      ],
    },
  },
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
  styleguideDir: 'demo',
  require: [
    path.join(__dirname, './example/stories/styles.css'),
    path.join(__dirname, './example/stories/font-awesome-4.7.0/css/font-awesome.min.css'),
  ],
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
    {
      name: 'Responsive (vertical)',
      content: 'example/stories/responsive(vertical)/README.md',
    },
    {
      name: 'Vertical',
      content: 'example/stories/vertical/README.md',
    },
    {
      name: 'rtl',
      content: 'example/stories/rtl/README.md',
    },
    {
      name: 'disable tab',
      content: 'example/stories/disable/README.md',
    },
    {
      name: 'closable',
      content: 'example/stories/closable/README.md',
    },
    {
      name: 'icon',
      content: 'example/stories/icon/README.md',
    },
    {
      name: 'close selected tab',
      content: 'example/stories/close-selected-tab/README.md',
    },
    {
      name: 'Pass children to Tablist',
      content: 'example/stories/passChildrenToTablist/README.md',
    },
    {
      name: 'change options',
      content: 'example/stories/change-options/README.md',
    },
    {
      name: 'Change Tab Data',
      content: 'example/stories/change-tab-data/README.md',
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
