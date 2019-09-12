const path = require('path');

const JsonIncWebpackPlugin = require('../../json-inc-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

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
  ];

  if (!process.env.TRAVIS) {
    plugins.push(new ExtraWatchWebpackPlugin({
      files: ['./sites/' + site + '/configuration/**/*', './sites/global/**/*', './sites/' + site + '/assets/**/*']
    }));
	}

  const config = {
    watchOptions: {
      ignored: ['node_modules', 'build'],
      aggregateTimeout: 300
    },
    entry: [
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
          test: /\.js$/,
          loader: 'babel-loader' + (!process.env.TRAVIS ? '?cacheLoader' : ''),
          query: {
            presets: ['@babel/preset-env'],
            compact: false
          }
        }
      ]
    },
    plugins: plugins
  };

  return config;
}

module.exports = getConfig('wp-indexer', 'WordpressIndexer');