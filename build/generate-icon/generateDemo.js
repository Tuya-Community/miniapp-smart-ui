const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const icons = require('./getIcons');

const cwd = process.cwd();
const tplDir = path.join(cwd, './build/generate-icon/tpl-demo');
const demoOutputDir = path.join(cwd, `./packages/icon/demo`);

fs.copySync(tplDir, demoOutputDir);

const generateDemo = () => {
  const tplWxml = fs.readFileSync(path.join(tplDir, './index.wxml'), {
    encoding: 'utf-8',
  });
  const tplJson = fs.readFileSync(path.join(tplDir, './index.json'), {
    encoding: 'utf-8',
  });

  const compiledWxml = _.template(tplWxml);
  const compiledJson = _.template(tplJson);

  const resultWxml = compiledWxml({ icons });
  const resultJson = compiledJson({ icons });

  fs.writeFileSync(path.join(demoOutputDir, './index.wxml'), resultWxml, {
    encoding: 'utf-8',
  });
  fs.writeFileSync(path.join(demoOutputDir, './index.json'), resultJson, {
    encoding: 'utf-8',
  });
};

module.exports = generateDemo;
