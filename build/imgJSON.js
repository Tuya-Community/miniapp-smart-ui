const fs = require('fs');
const path = require('path');

/**
 * 读取指定目录下的文件名，并在目录中生成或覆盖index.json文件
 *
 * @param {string} inputDir - 要读取的目录路径
 */
function generateIndexJson() {
  const inputDir = path.join(__dirname, '../docs/imgs');
  // 确保输入目录存在
  if (!fs.existsSync(inputDir)) {
    console.error(`目录不存在: ${inputDir}`);
    return;
  }

  // 读取指定目录下的所有文件
  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error(`无法读取目录: ${err.message}`);
      return;
    }

    // 过滤出文件名（排除目录）
    const fileList = files.filter(file => {
      return (
        fs.statSync(path.join(inputDir, file)).isFile() &&
        !['index.json', '.DS_Store'].includes(file)
      );
    });

    // 创建或覆盖 index.json 文件的路径
    const outputPath = path.join(inputDir, 'index.json');

    // 写入index.json文件
    fs.writeFile(outputPath, JSON.stringify(fileList, null, 2), err => {
      if (err) {
        console.error(`创建或覆盖 index.json 失败: ${err.message}`);
        return;
      }
      console.log(`index.json 已创建或覆盖: ${outputPath}`);
    });
  });
}

module.exports = generateIndexJson;
