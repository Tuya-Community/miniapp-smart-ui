const fs = require('fs-extra');
const path = require('path');

const cwd = process.cwd();

const getIcons = fs
  .readdirSync(path.resolve(cwd, './build/generate-icon/svg'))
  .filter((v) => v.endsWith('.svg'))
  .map((v) => v.replace('.svg', ''));

module.exports = getIcons;
