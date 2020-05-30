var HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path')
const isProd = process.env.NOFE_ENV === 'production'
const isDev = !isProd
const jsLoaders = () => {
  const loaders = [ 
    {
    loader: 'babel-loader',
    options: {
    presets: ['@babel/preset-env']
   }
  }
 ]

 if (isDev) {
  loaders.push('eslint-loader')
 }

 return loaders
}

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill','./index.js'],
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src/core')
        }
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
      port: 8081,
      hot: isDev
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            template: 'index.html',
            minify: {
              removeComments: isProd,
              collapseWhitespace: isProd
            }
        }),

        new CopyPlugin({
            patterns: [
              { from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist') }
            ],
        }),
    ],
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: isDev,
                reloadAll: true
              }
              },
              'css-loader',
              'sass-loader'
            ],
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: jsLoaders()
          }
        ]
    }
}