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
 * 生成覆盖率摘要 JSON 文件（供 shields.io 动态徽章使用）
 * @param {string} outputPath - 输出文件路径
 * @param {Object} coverage - 覆盖率对象
 */
function generateCoverageSummary(outputPath, coverage) {
  // shields.io JSON endpoint 只支持特定字段，不能包含额外字段
  const summary = {
    schemaVersion: 1,
    label: 'coverage',
    message: `${coverage.statements.toFixed(2)}%`,
    color:
      coverage.statements >= 80
        ? 'green'
        : coverage.statements >= 60
        ? 'yellow'
        : coverage.statements >= 40
        ? 'orange'
        : 'red',
  };

  // 确保输出目录存在
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`✅ 已生成覆盖率摘要文件: ${outputPath}`);
  console.log(`   语句覆盖率: ${coverage.statements.toFixed(2)}%`);
  console.log(`   分支覆盖率: ${coverage.branches.toFixed(2)}%`);
  console.log(`   函数覆盖率: ${coverage.functions.toFixed(2)}%`);
  console.log(`   行覆盖率: ${coverage.lines.toFixed(2)}%`);
}

// 主函数
function main() {
  const coveragePath = process.argv[2] || path.join(__dirname, '../coverage/coverage-final.json');
  const outputPath =
    process.argv[3] || path.join(__dirname, '../.github/coverage/coverage-summary.json');

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

  // 生成覆盖率摘要 JSON 文件到 .github/coverage 目录
  generateCoverageSummary(outputPath, coverage);

  // 同时在 docs 目录下也生成一份 coverage-summary.json
  const docsSummaryPath = path.join(__dirname, '../docs/coverage-summary.json');
  generateCoverageSummary(docsSummaryPath, coverage);

  // 同时复制 coverage-final.json 到 docs 目录
  const docsFinalPath = path.join(__dirname, '../docs/coverage-final.json');
  const docsDir = path.dirname(docsFinalPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  fs.copyFileSync(coveragePath, docsFinalPath);
  console.log(`✅ 已复制覆盖率完整文件到: ${docsFinalPath}`);
}

main();
