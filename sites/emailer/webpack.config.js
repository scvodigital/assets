const path = require('path');

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
  ];

	if (!process.env.TRAVIS) {
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
      './sites/' + site + '/main.js', 
    ],
    output: {
      filename: 'build/' + site + '/main-' + package.version + '.js',
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