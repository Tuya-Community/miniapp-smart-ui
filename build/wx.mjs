import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  clearRjs();
  tansI18();
  clearErrorCSS();
  deleteFolderRecursive(path.join(__dirname, `../example/dist/area/demo`));
  // copySvg();
  // tansSvgImport();
}

function clearRjs() {
  const rjsList = ['normal-slider', 'circle'];
  rjsList.forEach(item => {
    const indexJsonPath = path.join(__dirname, `../example/dist/${item}/index.json`);
    fs.writeFileSync(
      indexJsonPath,
      `{
  "component": true,
  "usingComponents": {}
}`,
      'utf-8'
    );
  });

  const indexRjsPath = path.join(__dirname, `../example/dist/circle/index.js`);
  const str = fs.readFileSync(indexRjsPath, 'utf-8');
  const replacedData = str.replace(`import Render from './index.rjs';`, '');
  fs.writeFileSync(indexRjsPath, replacedData, 'utf-8');
}

function tansI18() {
  const stringPath = path.join(__dirname, `../example/i18n/strings.json`);
  const stringStr = fs.readFileSync(stringPath, 'utf-8');
  let strJson = {
    zh: {},
  };
  try {
    strJson = JSON.parse(stringStr); // 解析JSON字符串为对象
  } catch (parseErr) {
    reject(`无法解析JSON数据: ${filePath}, 错误: ${parseErr}`);
  }
  const pagesPath = path.join(__dirname, `../example/pages`);

  function replaceI18(targetPath, regex = /@I18n\.t\('([^']+)'\)/g, isAddPoint) {
    try {
      fs.statSync(targetPath).isFile();
    } catch (err) {
      // console.log('不存在：', targetPath);
      return;
    }
    const str = fs.readFileSync(targetPath, 'utf-8');
    const replacedData = str.replace(regex, (match, key) => {
      const value = strJson.zh[key] || key;
      return isAddPoint ? `'${value}'` : value; // 如果字典中有匹配值，使用替换值，否则原样返回
    });
    fs.writeFileSync(targetPath, replacedData, 'utf-8');
  }

  // 读取指定目录下的所有文件
  fs.readdir(pagesPath, (err, files) => {
    if (err) {
      console.error(`无法读取目录: ${err.message}`);
      return;
    }

    files.forEach(file => {
      if (!fs.statSync(path.join(pagesPath, file)).isDirectory()) return;
      const indexJsonPath = path.join(pagesPath, file, 'index.json');
      replaceI18(indexJsonPath);
    });
  });

  const distPath = path.join(__dirname, `../example/dist`);
  // 读取指定目录下的所有文件
  fs.readdir(distPath, (err, files) => {
    if (err) {
      console.error(`无法读取目录: ${err.message}`);
      return;
    }

    files.forEach(file => {
      if (!fs.statSync(path.join(distPath, file)).isDirectory()) return;
      const indexPath = path.join(distPath, file, 'demo', 'index.js');
      const wxmlPath = path.join(distPath, file, 'demo', 'index.wxml');
      replaceI18(indexPath, /I18n\.t\('([^']+)'\)/g, true);
      replaceI18(wxmlPath, /{{I18n\.t\('([^']+)'\)}}/g);
      replaceI18(wxmlPath, /I18n\.t\('([^']+)'\)/g, true);
    });
  });

  const configPath = path.join(__dirname, `../example/config.js`);
  replaceI18(configPath, /I18n\.t\('([^']+)'\)/g, true);
}

function clearErrorCSS() {
  const circleCss = path.join(__dirname, `../example/dist/circle/index.wxss`);
  const circleDemoCss = path.join(__dirname, `../example/dist/circle/demo/index.wxss`);
  fs.writeFileSync(circleCss, '.flex{}', 'utf-8');
  fs.writeFileSync(circleDemoCss, '.flex{}', 'utf-8');
}

function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const currentPath = path.join(dirPath, file);

      if (fs.lstatSync(currentPath).isDirectory()) {
        // 递归删除子文件夹
        deleteFolderRecursive(currentPath);
      } else {
        // 删除文件
        fs.unlinkSync(currentPath);
      }
    });

    // 目录为空后删除目录
    fs.rmdirSync(dirPath);
    console.log(`已删除文件夹：${dirPath}`);
  } else {
    // console.log(`文件夹不存在：${dirPath}`);
  }
}

function copySvg() {
  // 用法示例：指定源文件夹和目标文件夹路径
  const srcFolderPath = path.join(__dirname, '../node_modules/@tuya-miniapp/icons/dist/svg');
  const srcConfigFolderPath = path.join(
    __dirname,
    '../node_modules/@tuya-miniapp/icons/dist/config.js'
  );
  const destConfigFolderPath = path.join(__dirname, '../example/dist/svg/config.js');

  const destFolderPath = path.join(__dirname, '../example/dist/svg');

  // 执行拷贝
  copyFolderRecursive(srcFolderPath, destFolderPath);
  copyFolderRecursive(srcConfigFolderPath, destConfigFolderPath);
}

/**
 * 检查两个文件是否相同
 * @param {string} file1 - 第一个文件路径
 * @param {string} file2 - 第二个文件路径
 * @returns {boolean} - 文件是否完全一致
 */
function areFilesIdentical(file1, file2) {
  const file1Content = fs.readFileSync(file1, 'utf8');
  const file2Content = fs.readFileSync(file2, 'utf8');
  return file1Content === file2Content;
}

/**
 * 递归地将源文件夹拷贝到目标目录
 * @param {string} src - 源文件夹路径
 * @param {string} dest - 目标文件夹路径
 */
function copyFolderRecursive(src, dest) {
  // 创建目标文件夹如果它不存在
  if (!dest.endsWith('.js') && !fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  const isDirectory = fs.lstatSync(src).isDirectory();
  if (!isDirectory) {
    const srcPath = src;
    const destPath = dest;
    // 检查目标位置是否已有相同文件
    const shouldCopyFile = !fs.existsSync(destPath) || !areFilesIdentical(srcPath, destPath);
    if (shouldCopyFile) {
      fs.copyFileSync(srcPath, destPath);
    }
    return;
  }
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    if (fs.lstatSync(srcPath).isDirectory()) {
      // 递归拷贝所有子文件夹
      copyFolderRecursive(srcPath, destPath);
    } else {
      // 检查目标位置是否已有相同文件
      const shouldCopyFile = !fs.existsSync(destPath) || !areFilesIdentical(srcPath, destPath);
      if (shouldCopyFile) {
        fs.copyFileSync(srcPath, destPath);
        // console.log(`已复制文件: ${srcPath} 到 ${destPath}`);
      } else {
        // console.log(`跳过文件: ${srcPath} (目标文件 ${destPath} 已存在且相同)`);
      }
    }
  });
}

function tansSvgImport() {
  const distPath = path.join(__dirname, `../example/dist`);

  function replaceImport(indexPath, prePath = '../') {
    try {
      fs.statSync(indexPath).isFile();
    } catch (err) {
      return;
    }
    let str = fs.readFileSync(indexPath, 'utf-8');
    if (str.includes("import iconsConfig from '@tuya-miniapp/icons/dist/config';")) {
      str = str.replace(
        "import iconsConfig from '@tuya-miniapp/icons/dist/config';",
        `import iconsConfig from '${prePath}/svg/config.js'`
      );
    }
    const regex = /import\s+(\w+)\s+from\s+'@tuya-miniapp\/icons\/dist\/svg\/(\w+)';/g;
    const replacedData = str.replaceAll(regex, (match, moduleName, fileName) => {
      return `import ${moduleName} from '${prePath}svg/${fileName}.js';`;
    });
    fs.writeFileSync(indexPath, replacedData, 'utf-8');
  }
  // 读取指定目录下的所有文件
  fs.readdir(distPath, (err, files) => {
    if (err) {
      console.error(`无法读取目录: ${err.message}`);
      return;
    }

    files.forEach(file => {
      if (!fs.statSync(path.join(distPath, file)).isDirectory()) return;
      if (file === 'toast') {
        const indexPath = path.join(distPath, file, 'icons.js');
        replaceImport(indexPath);
      }
      const indexPath = path.join(distPath, file, 'index.js');
      const indexDemoPath = path.join(distPath, file, '/demo/index.js');
      replaceImport(indexPath);
      replaceImport(indexDemoPath, '../../');
    });
  });
}

run();
