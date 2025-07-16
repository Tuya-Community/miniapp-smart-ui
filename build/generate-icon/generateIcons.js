const fs = require('fs-extra');
const path = require('path');
const { optimize } = require('svgo');
const { template } = require('lodash');
const icons = require('./getIcons');

const cwd = process.cwd();
const tplDir = path.join(cwd, './build/generate-icon/tpl-impl');
const tplWxml = template(
  `
<smart-icon
  dot="{{ dot }}"
  info="{{ info }}"
  size="{{ size }}"
  color="{{ color }}"
  custom-style="{{ customStyle }}"
  class-prefix="{{ classPrefix }}"
  name="<%= name %>"
/>
`.trim()
);

const generateIcons = () => {
  for (let idx = 0; idx < icons.length; idx++) {
    const icon = icons[idx];
    // const iconName = upperFirst(camelCase(icon));
    const iconOutputDir = path.join(cwd, `./packages/icon-svg/${icon}`);
    const iconOutputWxmlPath = path.join(
      cwd,
      `./packages/icon-svg/${icon}/index.wxml`
    );
    fs.copySync(tplDir, iconOutputDir);

    const iconPath = path.resolve(cwd, `./build/generate-icon/svg/${icon}.svg`);
    const iconContent = fs.readFileSync(iconPath, 'utf8');
    const result = optimize(iconContent, {
      datauri: 'enc',
      plugins: [
        {
          name: 'convertColors',
          params: {
            currentColor: true,
          },
        },
      ],
    });
    const wxmlContent = tplWxml({ name: result.data });
    fs.writeFileSync(iconOutputWxmlPath, wxmlContent, { encoding: 'utf8' });
  }
};

module.exports = generateIcons;
