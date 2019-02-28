const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const chalk = require("chalk");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

require("dotenv").load();

const projectPath = path.resolve(__dirname);
const srcPath = path.join(__dirname, "src");
const distPath = path.join(__dirname, "dist");
const devPath = path.join(__dirname, "src");
const publicPath = path.join(__dirname, "public");
const port = 5000;

const getLessConfig = (modules = false) => {
  return ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: [
      {
        loader: "typings-for-css-modules-loader",
        options: {
          camelCase: true,
          modules,
          localIdentName: "[local]--[hash:base64:5]",
          namedExport: true
        }
      },
      {
        loader: "postcss-loader",
        options: {
          plugins: loader => [require("autoprefixer")]
        }
      },
      {
        loader: "less-loader",
        options: { javascriptEnabled: true }
      }
    ]
  });
};

module.exports = {
  mode: "development",
  watch: true,
  entry: {
    main: [
      "react-hot-loader/patch",
      `webpack-dev-server/client?http://localhost:${port}`,
      "webpack/hot/only-dev-server",
      path.resolve(devPath, "index.tsx")
      // path.resolve(srcPath, 'index.tsx'),
    ]
  },
  output: {
    filename: "[name].bundle.js",
    path: distPath
  },
  devtool: "eval-source-map", // 'source-map'
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [srcPath, devPath],
        exclude: ["/__tests__/"],
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true
            }
          }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.module\.less$/,
        use: getLessConfig(true)
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: getLessConfig()
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true,
                sourceMap: true,
                camelCase: true
                // localIdentName: '[path][name]__[local]',
              }
            }
          ]
        })
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    modules: ["node_modules"],
    alias: {
      src: path.resolve(srcPath)
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  externals: {},
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({
      filename: "devUI.bundle.css",
      allChunks: true
    }),
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      path: distPath,
      filename: "index.html",
      template: path.resolve(publicPath, "index.html"),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunks: ["main"],
      chunksSortMode: "dependency"
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    // Perform type checking and linting in a separate process to speed up compilation
    new ForkTsCheckerWebpackPlugin({
      async: true,
      watch: srcPath,
      tsconfig: path.resolve(projectPath, "tsconfig.json"),
      tslint: path.resolve(projectPath, "tslint.json")
    }),
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/, /less\.d\.ts$/])
    // new BundleAnalyzerPlugin(),
  ],
  devServer: {
    contentBase: [devPath, projectPath],
    compress: true,
    port,
    hot: true,
    host: "0.0.0.0"
  }
};
