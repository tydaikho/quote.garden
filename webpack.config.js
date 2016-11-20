var path = require('path');
var webpack = require('webpack');

module.exports = {
  resolve: {
    root: [
      path.resolve('./docs')
    ]
  },
  entry: {
    // these are where webpack looks
    // for dependency trees to build
    all: './docs/all/app.jsx',
    edit: './docs/edit/app.jsx',
    index: './docs/index/app.jsx',
    random: './docs/random/app.jsx',
  },
  output: {
    // this is where individual built chunks live
    filename: 'docs/[name]/bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(
      // this is where the common built chunk lives
      'docs/shared/bundle.js'
    ),
    new webpack.DefinePlugin({
      // this tells react to use its production mode
      'process.env': {'NODE_ENV': JSON.stringify('production')}
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.SourceMapDevToolPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      // this tells uglify to stfu about react
      compress: { warnings: false },
    }),
  ],
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};