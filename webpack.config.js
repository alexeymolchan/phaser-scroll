const path = require('path');
const webpack = require('webpack');
const appRoot = require('app-root-path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: path.join(appRoot.path, 'src/index.js'),
  output: {
    path: path.join(appRoot.path, 'dist'),
    filename: '[name].[hash].js'
  },
  externals: {
    FBInstant: 'FBInstant'
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|woff|woff2|eot|ttf|otf|aac|ogg|m4a)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name][hash:6].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          name: 'assets/[name].[ext]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        resolve: { extensions: ['.js'] },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false, targets: { browsers: ['last 2 versions', 'Android >= 4'] } }]
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-syntax-object-rest-spread',
            ]
          },
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.join(appRoot.path, 'src'), path.join(appRoot.path, 'node_modules')]
  },
  mode: process.env.NODE_ENV,
  node: {
    constants: false
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all'
        }
      }
    },
  },
  devServer: {
    contentBase: path.join(appRoot.path, 'dist'),
    port: 8765,
    hot: true,
    stats: 'errors-only',
    publicPath: '/',
    historyApiFallback: true,
    host: '0.0.0.0'
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: false
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(appRoot.path, 'src/index.html'),
      hash: true,
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true
      }
    })
  ]
};
