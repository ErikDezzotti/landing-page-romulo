const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    main: "./script.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      util: require.resolve("util/"),
      url: require.resolve("url/"),
      querystring: require.resolve("querystring-es3"),
      http: require.resolve("stream-http"),
      zlib: require.resolve("browserify-zlib"),
      assert: require.resolve("assert/"),
      fs: false,
      net: false,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ["console.log"],
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["imagemin-mozjpeg", { quality: 80 }],
              ["imagemin-pngquant", { quality: [0.6, 0.8] }],
              ["imagemin-gifsicle", { interlaced: true }],
              ["imagemin-svgo", { plugins: [{ removeViewBox: false }] }],
            ],
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset",
      },
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
