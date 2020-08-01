const webpack = require('webpack'); //webpack本体
const path = require('path') //pathの処理
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin'); //cssを取り出す
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries'); //不要なjsファイルを生成しない


module.exports = (env,argv) => {
  const MODE = argv.mode;
  const IS_DEVELOPMENT = argv.mode === 'development';//開発中
  const IS_PRODUCTION = argv.mode === 'production';//本番
  return {
    mode: MODE,
    devtool: IS_DEVELOPMENT ? 'inline-source-map' : 'eval',
    entry: {
      style: './scss/style'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname,'dist/css'),
    },
    resolve: {
      alias: {
        scss: path.resolve(__dirname, 'src/scss/'),
      },
      extensions: ['.ts','.js','.tsx','jsx','.scss'],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: ExtractCssChunks.loader, // cssを取り除く
            },
            {
              loader: "css-loader",
              options: {
                url: false,
                sourceMap: true,
              }
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require('sass', { //Dart SASSを使う
                  outputStyle : 'expanded',
                }),
                sassOptions: {
                  fiber: require('fibers'),
                },
              }
            },
          ],
        },
      ]
    },
    plugins: [
      new FixStyleOnlyEntriesPlugin(),
      new ExtractCssChunks({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
  }
};
