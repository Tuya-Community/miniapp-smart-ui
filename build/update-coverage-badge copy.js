const fs = require('fs');
const path = require('path');

/**
 * 从 coverage-final.json 计算总体覆盖率
 * @param {string} coveragePath - coverage-final.json 文件路径
 * @returns {Object} 包含各种覆盖率百分比的对象
 */
function calculateCoverage(coveragePath) {
  const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));

  let totalStatements = 0;
  let coveredStatements = 0;
  let totalBranches = 0;
  let coveredBranches = 0;
  let totalFunctions = 0;
  let coveredFunctions = 0;
  let totalLines = 0;
  let coveredLines = 0;

  Object.values(coverageData).forEach(fileCoverage => {
    // Statements
    if (fileCoverage.s) {
      Object.values(fileCoverage.s).forEach(count => {
        totalStatements++;
        if (count > 0) coveredStatements++;
      });
    }

    // Branches - 每个分支有多个路径（通常是 true/false 路径）
    if (fileCoverage.b) {
      Object.values(fileCoverage.b).forEach(branch => {
        if (Array.isArray(branch)) {
          // 每个分支路径
          branch.forEach(count => {
            totalBranches++;
            if (count > 0) coveredBranches++;
          });
        }
      });
    }

    // Functions
    if (fileCoverage.f) {
      Object.values(fileCoverage.f).forEach(count => {
        totalFunctions++;
        if (count > 0) coveredFunctions++;
      });
    }

    // Lines - 使用 statementMap 来确定行号，避免重复计算同一行
    if (fileCoverage.statementMap && fileCoverage.s) {
      const linesSet = new Set();
      const coveredLinesSet = new Set();
      Object.keys(fileCoverage.s).forEach(key => {
        const statement = fileCoverage.statementMap[key];
        if (statement && statement.start && statement.start.line) {
          const lineNum = statement.start.line;
          linesSet.add(lineNum);
          if (fileCoverage.s[key] > 0) {
            coveredLinesSet.add(lineNum);
          }
        }
      });
      totalLines += linesSet.size;
      coveredLines += coveredLinesSet.size;
    }
  });

  return {
    statements: totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0,
    branches: totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0,
    functions: totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0,
    lines: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0,
  };
}

/**
 * 更新 README 中的覆盖率徽章
 * @param {string} readmePath - README 文件路径
 * @param {Object} coverage - 覆盖率对象
 */
function updateReadmeBadge(readmePath, coverage) {
  let readmeContent = fs.readFileSync(readmePath, 'utf8');

  // 使用 statements 覆盖率作为主要指标（这是最常见的做法）
  const coveragePercent = coverage.statements.toFixed(2);

  // 根据覆盖率选择颜色
  let color = 'red';
  if (coverage.statements >= 80) color = 'green';
  else if (coverage.statements >= 60) color = 'yellow';
  else if (coverage.statements >= 40) color = 'orange';

  // 创建 shields.io 徽章 URL
  const badgeUrl = `https://img.shields.io/badge/coverage-${coveragePercent}%25-${color}`;
  const badgeMarkdown = `![coverage](${badgeUrl})`;

  // 查找现有的覆盖率徽章（如果存在）
  const badgePattern = /!\[coverage\]\(https:\/\/img\.shields\.io\/badge\/coverage-[\d.]+%25-\w+\)/;

  if (badgePattern.test(readmeContent)) {
    // 替换现有的徽章
    readmeContent = readmeContent.replace(badgePattern, badgeMarkdown);
  } else {
    // 在 npm 徽章后面添加覆盖率徽章
    const npmBadgePattern =
      /(!\[npm\]\(https:\/\/img\.shields\.io\/npm\/v\/@tuya-miniapp\/smart-ui\))(!\[down\]\(https:\/\/img\.shields\.io\/npm\/dt\/@tuya-miniapp\/smart-ui\))/;
    if (npmBadgePattern.test(readmeContent)) {
      readmeContent = readmeContent.replace(npmBadgePattern, `$1$2${badgeMarkdown}`);
    } else {
      // 如果找不到 npm 徽章，在标题后面添加
      const titlePattern = /(# @tuya-miniapp\/smart-ui\n)/;
      readmeContent = readmeContent.replace(titlePattern, `$1\n${badgeMarkdown}\n`);
    }
  }

  fs.writeFileSync(readmePath, readmeContent, 'utf8');
  console.log(`✅ 已更新 ${readmePath} 中的覆盖率徽章: ${coveragePercent}%`);
}

// 主函数
function main() {
  const coveragePath = process.argv[2] || path.join(__dirname, '../coverage/coverage-final.json');
  const readmePath = process.argv[3] || path.join(__dirname, '../README.md');
  const readmeZhPath = process.argv[4] || path.join(__dirname, '../README-zh_CN.md');

  if (!fs.existsSync(coveragePath)) {
    console.error(`❌ 覆盖率文件不存在: ${coveragePath}`);
    process.exit(1);
  }

  console.log(`📊 正在计算覆盖率...`);
  const coverage = calculateCoverage(coveragePath);

  console.log(`\n覆盖率统计:`);
  console.log(`  语句覆盖率: ${coverage.statements.toFixed(2)}%`);
  console.log(`  分支覆盖率: ${coverage.branches.toFixed(2)}%`);
  console.log(`  函数覆盖率: ${coverage.functions.toFixed(2)}%`);
  console.log(`  行覆盖率: ${coverage.lines.toFixed(2)}%`);

  // 更新英文 README
  if (fs.existsSync(readmePath)) {
    updateReadmeBadge(readmePath, coverage);
  }

  // 更新中文 README
  if (fs.existsSync(readmeZhPath)) {
    updateReadmeBadge(readmeZhPath, coverage);
  }
}

main();
