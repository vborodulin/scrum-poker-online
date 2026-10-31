const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const path = require('path');
const shortid = require('shortid');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const BUILD_ID = shortid();

module.exports = {
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, './server/index.ts'),
  mode: 'none',
  node: {
    __dirname: true,
    __filename: true,
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './server/build'),
  },
  optimization: {
    minimize: false,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@auth': path.resolve(__dirname, './server/domains/auth'),
      '@core': path.resolve(__dirname, './server/core'),
      '@metrics': path.resolve(__dirname, './server/domains/metrics'),
      '@models': path.resolve(__dirname, './server/models'),
      '@pokerSessions': path.resolve(__dirname, './server/domains/pokerSessions'),
      '@cardDecks': path.resolve(__dirname, './server/domains/cardDecks'),
      '@routes': path.resolve(__dirname, './server/routes'),
      '@config': path.resolve(__dirname, './server/config'),
      '@spaces': path.resolve(__dirname, './server/domains/spaces'),
      '@stats': path.resolve(__dirname, './server/domains/stats'),
      '@users': path.resolve(__dirname, './server/domains/users'),
      '@socket': path.resolve(__dirname, './server/socket'),
    },
    modules: ['node_modules', 'server/node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: ['/node_modules/'],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_ID,
    }),
    new SentryWebpackPlugin({
      authToken: '286b204f021c44f5a6c0ce9ba88e626401b4bcc1ae33444ea612050116a8a233',
      org: 'chpokify',
      project: 'server-dev',
      include: './server/build',
      ignore: ['node_modules', 'webpack.config.js'],
      release: BUILD_ID,
    }),
  ],
};
