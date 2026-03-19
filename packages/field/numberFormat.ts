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
    // 部分阿拉伯国家
    'es-419': { thousandsSeparator: ',', decimalSeparator: '.' }, // 拉丁美洲西班牙语
    'pt-br': { thousandsSeparator: '.', decimalSeparator: ',' }, // 拉丁美洲葡萄牙语
    'ar-ma': { thousandsSeparator: ' ', decimalSeparator: ',' }, // 摩洛哥
    'ar-tn': { thousandsSeparator: ' ', decimalSeparator: ',' }, // 突尼斯
    'de-ch': { thousandsSeparator: "'", decimalSeparator: '.' }, // 瑞士德语
    'es-mx': { thousandsSeparator: ',', decimalSeparator: '.' }, // 墨西哥西班牙语
    'fr-ch': { thousandsSeparator: "'", decimalSeparator: '.' }, // 瑞士法语
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

export interface FormatNumberOptions {
  /** 为 true 时保留末尾的小数点（用于聚焦输入中，避免 "23." 被格式成 "23" 打断输入） */
  preserveTrailingDecimal?: boolean;
}

// 格式化数字：将 "1000.1312" 或 "-1000.1312" 格式化为带分隔符的字符串
export function formatNumber(value: string, locale: string, options?: FormatNumberOptions): string {
  if (!value || value === '') {
    return '';
  }

  // 仅保留数字、小数点、减号；连续前导减号按「负负得正」处理
  const raw = value.replace(/[^-0-9.]/g, '');
  let i = 0;
  while (i < raw.length && raw[i] === '-') {
    i++;
  }
  const negative = i % 2 === 1;
  const cleanValue = raw.slice(i).replace(/-/g, '');
  if (!cleanValue) {
    return negative ? '-' : '';
  }

  // 聚焦输入时可能为 "23."，保留末尾小数点以便用户继续输入小数
  const hasTrailingDecimal = options?.preserveTrailingDecimal && /\.$/.test(cleanValue);

  // 分离整数部分和小数部分（处理多个小数点的情况）
  const valueToFormat = hasTrailingDecimal ? cleanValue.slice(0, -1) : cleanValue;
  const parts = valueToFormat.split('.');
  const integerPart = parts[0] || '';
  const decimalPart = parts.length > 1 ? parts.slice(1).join('') : '';

  const config = getNumberFormatConfig(locale);

  // 格式化整数部分（添加千分位分隔符）
  let formattedInteger = '';
  if (integerPart) {
    for (let j = integerPart.length - 1, count = 0; j >= 0; j--) {
      if (count > 0 && count % 3 === 0) {
        formattedInteger = config.thousandsSeparator + formattedInteger;
      }
      formattedInteger = integerPart[j] + formattedInteger;
      count++;
    }
  }

  const prefix = negative ? '-' : '';

  if (decimalPart) {
    return prefix + formattedInteger + config.decimalSeparator + decimalPart;
  }
  if (hasTrailingDecimal) {
    return prefix + (formattedInteger || '0') + config.decimalSeparator;
  }
  return prefix + (formattedInteger || '0');
}

// 解析格式化后的数字：将格式化字符串转换回 "1000.1312" 或 "-1000.1312" 格式
export function parseFormattedNumber(formattedValue: string, locale: string): string {
  if (!formattedValue || formattedValue === '') {
    return '';
  }

  let body = formattedValue.trim();
  let negative = false;
  const ch0 = body.charAt(0);
  if (ch0 === '-' || ch0 === '\u2212') {
    negative = true;
    body = body.slice(1).trim();
  }

  if (!body) {
    return negative ? '-' : '';
  }

  const config = getNumberFormatConfig(locale);

  // 移除千分位分隔符（需要转义特殊字符）
  const escapedSeparator = config.thousandsSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let cleaned = body.replace(new RegExp(escapedSeparator, 'g'), '');

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

  const num = cleaned.replace(/[^\d.]/g, '');
  if (!num) {
    return negative ? '-' : '';
  }
  return negative ? '-' + num : num;
}
