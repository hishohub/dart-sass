//pathの処理
const path = require('path');
//cssを取り出す
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
//不要なjsファイルを生成しない
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
//AA用
const asciify = require('asciify');

module.exports = () => {
  const MODE = process.env.NODE_ENV;
  const IS_DEVELOPMENT = MODE === 'development';
  const IS_PRODUCTION = MODE === 'production';

  console.log(`CURRENT MODE ${MODE}`);

  asciify('Dart Sass', {
    font: 'standard',
    color: 'red',
  }, (err, msg) => {
    if (err) return;
    console.log(msg);
  });

  return {
    mode: MODE,
    devtool: IS_DEVELOPMENT ? 'inline-source-map' : false,
    entry: {
      style: './scss/style'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/css'),
    },
    resolve: {
      alias: {
        scss: path.resolve(__dirname, 'src/scss/'),
      },
      extensions: ['.js', '.scss'],
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
                //Dart SASSを使う
                implementation: require('sass', {
                  outputStyle: 'expanded',
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
      new FixStyleOnlyEntriesPlugin(), //jsを取り除く
      new ExtractCssChunks({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
  }
};
