const path = require('path');
const globby = require('globby');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const JsonIncWebpackPlugin = require('../../json-inc-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FileWatcherWebpackPlugin = require('filewatcher-webpack-plugin');

const package = require('../../package.json');

function getConfig(site, library) {
  const plugins = [
    new CopyWebpackPlugin([
      {
        from: '**/*',
        to: './build/' + site,
        context: './sites/' + site + '/assets/'
      }
    ], { debug: 'warning' }),
    new JsonIncWebpackPlugin({
      pattern: './sites/' + site + '/**/*.inc.json',
      output: './build/' + site
    }),
    new HardSourceWebpackPlugin(),
  ];

  if (process.env.TRAVIS) {
    plugins.push(new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 5,
        sourceMap: true
      }
    }));
    plugins.push(new CompressionPlugin({
      filename(path) {
        return path.replace(/\.gz$/, '');
      },
      exclude: /-site\.json$/
    }));
  } else {
    plugins.push(new FileWatcherWebpackPlugin({
      watchFileRegex: ['./sites/' + site + '/configuration/**/*', './sites/' + site + '/assets/**/*'],
			onAddDirCallback: (path) => { },
			onReadyCallback: () => { }
    }));
	}

  const config = {
    watchOptions: {
      ignored: ['node_modules', 'build'],
      aggregateTimeout: 300
    },
    entry: [
      ...globby.sync('./sites/' + site + '/scss/*-main.scss'),
      './sites/' + site + '/main.js',
    ],
    output: {
      filename: 'build/' + site + '/main-VERSION.js',
      library: library,
      libraryTarget: 'var'
    },
    module: {
      rules: [
        {
          test: /\/([a-z0-9-_]*?)-main\.scss$/,
          use: [{
              loader: 'file-loader',
              options: {
                regExp: /\/([a-z0-9-_]*?)-main\.scss$/,
                name: 'build/' + site + '/sub-sites/[1]/main-VERSION.css',
              },
            },
            {
              loader: 'extract-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer()],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: ['./node_modules'],
              },
            }
          ],
        },
        {
          test: require.resolve('jquery'),
          use: [
            {
              loader: 'expose-loader',
              options: 'jQuery'
            },
            {
              loader: 'expose-loader',
              options: '$'
            }
          ]
        },
        {
          test: require.resolve('string'),
          use: [
            {
              loader: 'expose-loader',
              options: 'S'
            }
          ]
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env'],
            compact: false
          }
        }
      ]
    },
    plugins: plugins,
    devtool: "source-map"
  };

  return config;
}

module.exports = getConfig('fundingscotland', 'FundingScotland');