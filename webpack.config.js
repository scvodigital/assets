const autoprefixer = require('autoprefixer');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const sites = [
  { site: 'goodmoves', library: 'Goodmoves' },
  { site: 'getinvolved', library: 'GetInvolved' },
]

function main() {
  let toCompile = [];
  if (process.env.SITES) {
    const names = process.env.SITES.split(',');
    sites.forEach(site => {
      if (names.indexOf(site.name) > -1) {
        toCompile.push(site);
      }
    });
  }
  toCompile = toCompile.length > 0 ? toCompile : sites;

  const noCompress = typeof process.env.NO_COMPRESS !== 'undefined' ? Boolean(process.env.NO_COMPRESS) : false;

  console.log('Packing sites:', toCompile);
  console.log('Not Compressing:', noCompress);

  const modules = toCompile.map(site => {
    const config = getConfig(site.site, site.library, noCompress);
    return config;
  });

  return modules;
}

function getConfig(site, library, noCompress) {
  const config = {
    entry: ['./sites/' + site + '/main.scss', './sites/' + site + '/main.js'],
    output: {
      filename: 'build/' + site + '/main.js',
      library: library,
      libraryTarget: 'var'
    },
    module: {
      rules: [{
          test: /\.scss$/,
          use: [{
              loader: 'file-loader',
              options: {
                name: 'build/' + site + '/main.css',
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
            presets: ['es2015'],
          },
        }
      ],
    }
  };

  if (!noCompress) {
    config.plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 5,
          sourceMap: true
        }
      }),
      new CompressionPlugin(),
    ];
  }

  return config;
}

module.exports = main();
