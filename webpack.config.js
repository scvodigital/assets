const globby = require('globby');

const siteConfigPaths = globby.sync('sites/**/webpack.config.js');
const configs = siteConfigPaths.map(path => {
  const modulePath = './' + path.replace(/\.js$/, '');
  const config = require(modulePath);
  return config;
});

module.exports = configs;
