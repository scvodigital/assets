const fs = require('fs');
const path = require('path');
const util = require('util');
const { JsonInc } = require('@scvo/json-inc');

function JsonIncWebpackPlugin(options = {}) {
  const apply = async (compiler) => {
    const jsonInc = new JsonInc({});
    const outDir = path.dirname(compiler.options.output.filename)
    for (const entry of compiler.options.entry) {
      if (!entry.endsWith('inc.json')) continue;
      try {
        const cwd = path.dirname(entry);
        const filename = path.basename(entry).replace('.inc.json', '.json');
        const contents = fs.readFileSync(entry).toString();
        const json = await jsonInc.transpile(contents, cwd);
        const filepath = path.join(outDir, filename);

        compiler.plugin('emit', async (compilation, callback) => {
          compilation.assets[filepath] = {
            source: function() {
              return Buffer.from(json);
            },
            size: function() {
              return Buffer.from(json).length;
            }
          };

          callback();
        });
      } catch(err) {
        console.error('Failed to build JSON.inc file', entry, err);
      }
    }
  }

  return {
    apply
  };
}

JsonIncWebpackPlugin['default'] = JsonIncWebpackPlugin;
module.exports = JsonIncWebpackPlugin;
