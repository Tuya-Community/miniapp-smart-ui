const fs = require('fs');
const path = require('path');

// 读取文件
const varLessPath = path.join(__dirname, 'packages/common/style/var.less');
const darkJsonPath = path.join(__dirname, 'dark.json');
const lightJsonPath = path.join(__dirname, 'light.json');

const varLessContent = fs.readFileSync(varLessPath, 'utf-8');
const darkJson = JSON.parse(fs.readFileSync(darkJsonPath, 'utf-8'));
const lightJson = JSON.parse(fs.readFileSync(lightJsonPath, 'utf-8'));

// 解析 var.less 顶部的 --smart-ui- 变量（从 :root 和 &[theme='dark'] 中）
function parseSmartUIVariables(content) {
  const smartUIVars = {
    light: {},
    dark: {},
  };

  // 解析 :root 中的变量（浅色主题）
  const rootMatch = content.match(/:root\s*\{([\s\S]*?)\n\s*&\[theme=['"]dark['"]\]/);
  if (rootMatch) {
    const rootContent = rootMatch[1];
    // 匹配所有 --smart-ui- 开头的变量（可能是多行的）
    const smartUIPattern = /--smart-ui-([\w-]+):\s*([\s\S]*?);/g;
    let match;
    while ((match = smartUIPattern.exec(rootContent)) !== null) {
      const varName = `--smart-ui-${match[1]}`;
      let value = match[2].trim();
      // 清理多行内容，将多个连续空白字符替换为单个空格
      value = value.replace(/\s+/g, ' ').trim();
      smartUIVars.light[varName] = value;
    }
  }

  // 解析 &[theme='dark'] 中的变量（深色主题）
  const darkMatch = content.match(/&\[theme=['"]dark['"]\]\s*\{([\s\S]*?)\n\s*\}/);
  if (darkMatch) {
    const darkContent = darkMatch[1];
    // 匹配所有 --smart-ui- 开头的变量（可能是多行的）
    const smartUIPattern = /--smart-ui-([\w-]+):\s*([\s\S]*?);/g;
    let match;
    while ((match = smartUIPattern.exec(darkContent)) !== null) {
      const varName = `--smart-ui-${match[1]}`;
      let value = match[2].trim();
      // 清理多行内容，将多个连续空白字符替换为单个空格
      value = value.replace(/\s+/g, ' ').trim();
      smartUIVars.dark[varName] = value;
    }
  }

  return smartUIVars;
}

// 解析 var.less 中的颜色变量
function parseColorVariables(content) {
  const variables = {};

  // 先处理多行变量定义（如 @border-image: var(...); 跨多行）
  // 将多行的变量定义合并为单行
  let normalizedContent = content;
  // 匹配 @variable: var(...); 这种可能跨多行的定义
  normalizedContent = normalizedContent.replace(
    /@([\w-]+):\s*var\(\s*([\s\S]*?)\s*\);/g,
    (match, varName, varContent) => {
      // 将多行内容压缩为单行
      const singleLine = varContent.replace(/\s+/g, ' ').trim();
      return `@${varName}: var(${singleLine});`;
    }
  );

  const lines = normalizedContent.split('\n');

  for (const line of lines) {
    // 匹配 @variable: var(--app-XXX, fallback); 或 @variable: value;
    const match = line.match(/^@([\w-]+):\s*(.+?);/);
    if (!match) continue;

    const varName = match[1];
    const value = match[2].trim();

    // 跳过非颜色变量（padding, font-size, border-radius 等）
    if (isNonColorVariable(varName, value)) {
      continue;
    }

    // 只处理依赖 --app- 的变量，跳过 --smart-ui- 等其他变量
    const varMatch = value.match(/var\(--app-([\w-]+),\s*(.+?)\)/);
    if (varMatch) {
      const appVarName = `--app-${varMatch[1]}`;
      const fallback = varMatch[2].trim();
      variables[varName] = {
        appVar: appVarName,
        fallback: fallback,
        original: value,
      };
    } else if (value.includes('--cell-') || value.includes('--switch-')) {
      // 跳过非 --app- 的变量（但保留 --smart-ui- 和 --hairline-color，因为它们可能引用其他变量）
      continue;
    } else if (value.match(/var\(--smart-ui-([\w-]+),\s*(.+?)\)/)) {
      // 处理 var(--smart-ui-XXX, fallback) 这种情况
      const smartUIMatch = value.match(/var\(--smart-ui-([\w-]+),\s*(.+?)\)/);
      const smartUIVarName = `--smart-ui-${smartUIMatch[1]}`;
      const fallback = smartUIMatch[2].trim();

      // 如果是多行的 fallback（如 linear-gradient），需要特殊处理
      let cleanFallback = fallback;
      if (fallback.includes('\n')) {
        cleanFallback = fallback.replace(/\s+/g, ' ').trim();
      }

      variables[varName] = {
        appVar: null,
        smartUIVar: smartUIVarName,
        fallback: cleanFallback,
        original: value,
      };
    } else if (value.match(/var\(--hairline-color,\s*(.+?)\)/)) {
      // 处理 var(--hairline-color, @B6-N7) 这种情况，fallback 可能是引用其他变量
      const hairlineMatch = value.match(/var\(--hairline-color,\s*(.+?)\)/);
      const fallback = hairlineMatch[1].trim();
      if (fallback.startsWith('@')) {
        // fallback 是引用其他变量
        variables[varName] = {
          appVar: null,
          fallback: null,
          original: value,
          reference: fallback.substring(1), // 去掉 @
        };
      } else {
        // fallback 是直接的颜色值
        variables[varName] = {
          appVar: null,
          fallback: fallback,
          original: value,
        };
      }
    } else if (value.includes('--hairline')) {
      // 跳过其他 --hairline 相关的变量
      continue;
    } else if (isColorValue(value)) {
      // 直接的颜色值（如 @black: #000;）
      variables[varName] = {
        appVar: null,
        fallback: value,
        original: value,
      };
    } else if (value.startsWith('@')) {
      // 引用其他变量（如 @text-color: @gray-8;）
      // 这些会在后续处理中解析
      variables[varName] = {
        appVar: null,
        fallback: null,
        original: value,
        reference: value.substring(1), // 去掉 @
      };
    }
  }

  return variables;
}

// 判断是否为非颜色变量
function isNonColorVariable(varName, value) {
  // 排除 padding, font, line-height, border-radius, animation, width, height 等
  const nonColorPatterns = [
    /^padding/,
    /^font-/,
    /^line-height/,
    /^border-radius/,
    /^border-width/,
    /^animation/,
    /^width/,
    /^height/,
    /^margin/,
    /^min-/,
    /^max-/,
    /^left$/,
    /^right$/,
    /^top$/,
    /^bottom$/,
    /^z-index/,
    /^size$/,
    /-size$/,
    /-width$/,
    /-height$/,
    /-padding$/,
    /-margin$/,
    /-radius$/,
    /-duration$/,
    /-weight$/,
    /-family$/,
    /-gutter$/,
    /-position$/,
    /-box-shadow$/,
    /-border$/,
    /-opacity$/,
    /^active-opacity$/,
    /^disabled-opacity$/,
    /^switch-width$/,
    /^switch-height$/,
    /^switch-label-width$/,
    /^switch-node-size$/,
    /^switch-padding$/,
    /^switch-border$/,
    /^hairline-width$/,
    /^hairline-top-width$/,
    /^hairline-left-width$/,
    /^hairline-right-width$/,
    /^hairline-bottom-width$/,
    /^hairline-surround-width$/,
    /^hairline-top-bottom-width$/,
    /^calc\(/,
    /px$/,
    /em$/,
    /rem$/,
    /s$/,
    /^normal$/,
    /^bold$/,
    /^bolder$/,
    /^auto$/,
    /^transparent$/,
    /^none$/,
    /^0$/,
    /^1$/,
    /^2$/,
    /^3$/,
    /^4$/,
    /^5$/,
    /^6$/,
    /^7$/,
    /^8$/,
    /^9$/,
    /^10$/,
    /^12$/,
    /^14$/,
    /^16$/,
    /^18$/,
    /^20$/,
    /^22$/,
    /^24$/,
    /^28$/,
    /^30$/,
    /^32$/,
    /^36$/,
    /^40$/,
    /^44$/,
    /^48$/,
    /^50$/,
    /^56$/,
    /^60$/,
    /^64$/,
    /^80$/,
    /^100$/,
    /^105$/,
    /^130$/,
    /^160$/,
    /^180$/,
    /^311$/,
    /^384$/,
    /^848$/,
    /^999$/,
    /^301$/,
    /^50%$/,
    /^90%$/,
    /^100%$/,
    /^60vh$/,
    /^calc/,
    /^linear-gradient/,
    /^fade\(/,
    /^var\(--smart-ui-/,
    /^var\(--cell-/,
    /^var\(--switch-/,
    /^var\(--hairline/,
  ];

  // 检查变量名
  for (const pattern of nonColorPatterns) {
    if (pattern.test(varName)) {
      return true;
    }
  }

  // 检查值
  const valuePatterns = [
    /^\d+px$/,
    /^\d+em$/,
    /^\d+rem$/,
    /^\d+%$/,
    /^\d+vh$/,
    /^\d+vw$/,
    /^\d+$/,
    /^calc\(/,
    /^normal$/,
    /^bold$/,
    /^bolder$/,
    /^auto$/,
    /^transparent$/,
    /^none$/,
    /^0$/,
    /^1$/,
    /^2$/,
    /^3$/,
    /^4$/,
    /^5$/,
    /^6$/,
    /^7$/,
    /^8$/,
    /^9$/,
    /^10$/,
    /^12$/,
    /^14$/,
    /^16$/,
    /^18$/,
    /^20$/,
    /^22$/,
    /^24$/,
    /^28$/,
    /^30$/,
    /^32$/,
    /^36$/,
    /^40$/,
    /^44$/,
    /^48$/,
    /^50$/,
    /^56$/,
    /^60$/,
    /^64$/,
    /^80$/,
    /^100$/,
    /^105$/,
    /^130$/,
    /^160$/,
    /^180$/,
    /^311$/,
    /^384$/,
    /^848$/,
    /^999$/,
    /^301$/,
    /^50%$/,
    /^90%$/,
    /^100%$/,
    /^60vh$/,
  ];

  for (const pattern of valuePatterns) {
    if (pattern.test(value)) {
      return true;
    }
  }

  return false;
}

// 判断是否为颜色值
function isColorValue(value) {
  return (
    /^(#[0-9a-fA-F]{3,8}|rgba?\(|rgb\(|hsl\(|hsla\(|var\(--smart-ui-)/.test(value) ||
    value === '@white' ||
    value === '@black' ||
    /^linear-gradient/.test(value) ||
    /^fade\(/.test(value)
  );
}

// 解析引用关系
function resolveReferences(variables) {
  const resolved = {};

  // 第一遍：直接值
  for (const [name, info] of Object.entries(variables)) {
    if (!info.reference) {
      resolved[name] = info;
    }
  }

  // 第二遍：解析引用
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 10) {
    changed = false;
    for (const [name, info] of Object.entries(variables)) {
      if (resolved[name]) continue;

      if (info.reference && resolved[info.reference]) {
        resolved[name] = {
          ...info,
          appVar: resolved[info.reference].appVar,
          fallback: resolved[info.reference].fallback,
        };
        changed = true;
      }
    }
    iterations++;
  }

  return resolved;
}

// 获取实际颜色值
function getColorValue(variable, themeJson, resolvedVariables, smartUIVars, themeName) {
  // 如果变量有引用关系，先解析引用
  if (variable.reference && resolvedVariables && resolvedVariables[variable.reference]) {
    const refVar = resolvedVariables[variable.reference];
    // 递归获取引用的值
    return getColorValue(refVar, themeJson, resolvedVariables, smartUIVars, themeName);
  }

  // 如果有 smartUIVar，从 smartUIVars 中获取
  if (variable.smartUIVar && smartUIVars) {
    // 优先使用当前主题的值，如果没有则使用浅色主题的值
    const theme = themeName === 'dark' ? 'dark' : 'light';
    if (smartUIVars[theme] && smartUIVars[theme][variable.smartUIVar]) {
      return smartUIVars[theme][variable.smartUIVar];
    }
    // 如果当前主题没有，尝试浅色主题
    if (theme === 'dark' && smartUIVars.light && smartUIVars.light[variable.smartUIVar]) {
      return smartUIVars.light[variable.smartUIVar];
    }
  }

  // 如果有 appVar，从 themeJson 中获取
  if (variable.appVar && themeJson[variable.appVar]) {
    return themeJson[variable.appVar];
  }

  // 否则使用 fallback 或 original
  return variable.fallback || variable.original;
}

// 判断是否应该排除的变量（B1、B2、B3、B4、B5、B6 以及 B1-N、B2-N 等）
function shouldExcludeVariable(varName) {
  // 匹配 B1、B2、B3、B4、B5、B6（精确匹配）
  if (/^B[1-6]$/.test(varName)) {
    return true;
  }
  // 匹配 B1-N1、B2-N2 等格式
  if (/^B[1-6]-N\d+$/.test(varName)) {
    return true;
  }
  return false;
}

// 生成主题文件
function generateThemeFile(variables, themeJson, themeName, resolvedVariables, smartUIVars) {
  const output = {};

  for (const [name, variable] of Object.entries(variables)) {
    // 排除 B1、B2、B3、B4、B5、B6 以及 B1-N、B2-N 等类型的变量
    if (shouldExcludeVariable(name)) {
      continue;
    }

    const colorValue = getColorValue(
      variable,
      themeJson,
      resolvedVariables,
      smartUIVars,
      themeName
    );
    if (colorValue) {
      output[name] = {
        name: `@${name}`,
        value: colorValue,
        original: variable.original,
      };
    }
  }

  return output;
}

// 比较两个主题文件，过滤掉值相同的变量
function filterSameValues(darkTheme, lightTheme) {
  const filteredDark = {};
  const filteredLight = {};
  let sameCount = 0;

  // 获取所有变量名
  const allVarNames = new Set([...Object.keys(darkTheme), ...Object.keys(lightTheme)]);

  for (const varName of allVarNames) {
    const darkValue = darkTheme[varName]?.value;
    const lightValue = lightTheme[varName]?.value;

    // 如果两个主题的值相同，则跳过
    if (darkValue === lightValue) {
      sameCount++;
      continue;
    }

    // 值不同，保留在两个主题文件中
    if (darkTheme[varName]) {
      filteredDark[varName] = darkTheme[varName];
    }
    if (lightTheme[varName]) {
      filteredLight[varName] = lightTheme[varName];
    }
  }

  return {
    dark: filteredDark,
    light: filteredLight,
    sameCount: sameCount,
  };
}

// 主函数
function main() {
  console.log('解析 var.less 文件...');
  const variables = parseColorVariables(varLessContent);
  console.log(`找到 ${Object.keys(variables).length} 个颜色变量`);

  console.log('解析 var.less 顶部的 --smart-ui- 变量...');
  const smartUIVars = parseSmartUIVariables(varLessContent);
  console.log(`浅色主题 smart-ui 变量: ${Object.keys(smartUIVars.light).length} 个`);
  console.log(`深色主题 smart-ui 变量: ${Object.keys(smartUIVars.dark).length} 个`);

  console.log('解析变量引用关系...');
  const resolvedVariables = resolveReferences(variables);
  console.log(`解析了 ${Object.keys(resolvedVariables).length} 个变量`);

  console.log('生成深色主题...');
  const darkTheme = generateThemeFile(
    resolvedVariables,
    darkJson,
    'dark',
    resolvedVariables,
    smartUIVars
  );

  console.log('生成浅色主题...');
  const lightTheme = generateThemeFile(
    resolvedVariables,
    lightJson,
    'light',
    resolvedVariables,
    smartUIVars
  );

  console.log('过滤相同值的变量...');
  const filtered = filterSameValues(darkTheme, lightTheme);

  // 写入文件
  const darkOutputPath = path.join(__dirname, 'var-colors-dark.json');
  const lightOutputPath = path.join(__dirname, 'var-colors-light.json');

  fs.writeFileSync(darkOutputPath, JSON.stringify(filtered.dark, null, 2), 'utf-8');
  fs.writeFileSync(lightOutputPath, JSON.stringify(filtered.light, null, 2), 'utf-8');

  console.log(`\n生成完成！`);
  console.log(`深色主题: ${darkOutputPath}`);
  console.log(`浅色主题: ${lightOutputPath}`);
  console.log(`\n深色主题变量数: ${Object.keys(filtered.dark).length}`);
  console.log(`浅色主题变量数: ${Object.keys(filtered.light).length}`);
  console.log(`过滤掉的相同值变量数: ${filtered.sameCount}`);
}

main();
