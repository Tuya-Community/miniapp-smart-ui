import { getSystemInfoSync } from '../common/utils';

// 数字格式化配置
export interface NumberFormatConfig {
  thousandsSeparator: string; // 千分位分隔符
  decimalSeparator: string; // 小数分隔符
}

// 提取语言代码：从 locale 中提取第一部分（去掉 - 和 _ 后面的所有内容）
function getLangKey(locale: string): string {
  if (!locale) {
    return '';
  }

  // 转换为小写并去除空格
  const normalized = locale.toLowerCase().trim();

  // 统一将下划线和连字符作为分隔符，取第一部分
  const langKey = normalized.split(/[-_]/)[0];

  return langKey;
}

// 根据 locale 获取数字格式化配置
export function getNumberFormatConfig(locale: string): NumberFormatConfig {
  // 如果没有指定 locale，尝试从系统获取
  if (!locale) {
    try {
      const systemInfo = getSystemInfoSync();
      // 尝试多个可能的字段名
      locale =
        (systemInfo as any).language ||
        (systemInfo as any).locale ||
        (systemInfo as any).lang ||
        'zh-CN';
    } catch (e) {
      locale = 'zh-CN';
    }
  }

  // 规范化 locale（统一大小写和下划线）
  const normalizedLocale = locale.toLowerCase().trim().replace(/_/g, '-');

  // 只配置非标准格式（非 1,234.56 格式）
  // 默认格式：thousandsSeparator: ',', decimalSeparator: '.' (1,234.56)
  const formatMap: Record<string, NumberFormatConfig> = {
    // 德语地区：1.000,1312 (点作为千分位，逗号作为小数)
    de: { thousandsSeparator: '.', decimalSeparator: ',' },
    // 瑞士德语：1'000.1312 (单引号作为千分位) - 特殊处理
    'de-ch': { thousandsSeparator: "'", decimalSeparator: '.' },
    // 法语地区：1 000,1312 (空格作为千分位，逗号作为小数)
    fr: { thousandsSeparator: ' ', decimalSeparator: ',' },
    // 意大利语：1.000,1312
    it: { thousandsSeparator: '.', decimalSeparator: ',' },
    // 西班牙语：1.000,1312
    es: { thousandsSeparator: '.', decimalSeparator: ',' },
    // 葡萄牙语：1.000,1312
    pt: { thousandsSeparator: '.', decimalSeparator: ',' },
    // 俄语：1 000,1312 (空格作为千分位，逗号作为小数)
    ru: { thousandsSeparator: ' ', decimalSeparator: ',' },
    // 部分阿拉伯国家：1 234,56 (空格作为千分位，逗号作为小数) - 特殊处理
    'ar-ma': { thousandsSeparator: ' ', decimalSeparator: ',' }, // 摩洛哥
    'ar-tn': { thousandsSeparator: ' ', decimalSeparator: ',' }, // 突尼斯
  };

  // 策略1: 先尝试完整匹配（处理特殊国家，如 'de-ch', 'ar-ma', 'ar-tn'）
  if (formatMap[normalizedLocale]) {
    return formatMap[normalizedLocale];
  }

  // 策略2: 提取语言代码进行匹配
  const langKey = getLangKey(locale);
  if (langKey && formatMap[langKey]) {
    return formatMap[langKey];
  }

  // 默认使用标准格式：1,234.56 (千分位逗号，小数点)
  return { thousandsSeparator: ',', decimalSeparator: '.' };
}

// 格式化数字：将 "1000.1312" 格式化为带分隔符的字符串
export function formatNumber(value: string, locale: string): string {
  if (!value || value === '') {
    return '';
  }

  // 移除所有非数字和小数点的字符（保留一个小数点）
  const cleanValue = value.replace(/[^\d.]/g, '');
  if (!cleanValue) {
    return '';
  }

  // 分离整数部分和小数部分（处理多个小数点的情况）
  const parts = cleanValue.split('.');
  const integerPart = parts[0] || '';
  const decimalPart = parts.length > 1 ? parts.slice(1).join('') : '';

  const config = getNumberFormatConfig(locale);

  // 格式化整数部分（添加千分位分隔符）
  let formattedInteger = '';
  if (integerPart) {
    for (let i = integerPart.length - 1, count = 0; i >= 0; i--) {
      if (count > 0 && count % 3 === 0) {
        formattedInteger = config.thousandsSeparator + formattedInteger;
      }
      formattedInteger = integerPart[i] + formattedInteger;
      count++;
    }
  }

  // 组合结果
  if (decimalPart) {
    return formattedInteger + config.decimalSeparator + decimalPart;
  }
  return formattedInteger || '0';
}

// 解析格式化后的数字：将格式化字符串转换回 "1000.1312" 格式
export function parseFormattedNumber(formattedValue: string, locale: string): string {
  if (!formattedValue || formattedValue === '') {
    return '';
  }

  const config = getNumberFormatConfig(locale);

  // 移除千分位分隔符（需要转义特殊字符）
  const escapedSeparator = config.thousandsSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let cleaned = formattedValue.replace(new RegExp(escapedSeparator, 'g'), '');

  // 将小数分隔符转换为标准小数点（只替换第一个，因为可能有多个）
  if (config.decimalSeparator !== '.') {
    const decimalIndex = cleaned.indexOf(config.decimalSeparator);
    if (decimalIndex !== -1) {
      cleaned = cleaned.substring(0, decimalIndex) + '.' + cleaned.substring(decimalIndex + 1);
    }
  }

  // 确保只有一个小数点
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }

  // 只保留数字和小数点
  return cleaned.replace(/[^\d.]/g, '');
}
