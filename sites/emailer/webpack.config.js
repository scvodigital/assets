const path = require('path');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const JsonIncWebpackPlugin = require('../../json-inc-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

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
  ];

	if (!process.env.TRAVIS) {
    plugins.push(new ExtraWatchWebpackPlugin({
      files: ['./sites/' + site + '/configuration/**/*', './sites/global/**/*', './sites/' + site + '/assets/**/*']
    }));
	}

  const config = {
    watchOptions: {
      ignored: [function(path) {
        return path.indexOf('/lib/') === -1 && path.indexOf('/emailer/') === -1;
      }],
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
      rules: [ ],
    },
    plugins: plugins
  };

  return config;
}

module.exports = getConfig('emailer', 'Emailer');