import { formatNumber, parseFormattedNumber } from '../numberFormat';

describe('numberFormat', () => {
  describe('formatNumber negative', () => {
    it('formats negative with thousands (en)', () => {
      expect(formatNumber('-1234.5', 'en-US')).toBe('-1,234.5');
      expect(formatNumber('-1000000', 'en-US')).toBe('-1,000,000');
    });

    it('formats negative with locale de', () => {
      expect(formatNumber('-1234.56', 'de')).toBe('-1.234,56');
    });

    it('returns lone minus for incomplete input', () => {
      expect(formatNumber('-', 'en-US')).toBe('-');
    });

    it('preserveTrailingDecimal with negative', () => {
      expect(formatNumber('-1234.', 'en-US', { preserveTrailingDecimal: true })).toBe('-1,234.');
      expect(formatNumber('-', 'en-US', { preserveTrailingDecimal: true })).toBe('-');
    });

    it('double leading minus negates', () => {
      expect(formatNumber('--123', 'en-US')).toBe('123');
    });

    it('unicode minus in raw input is stripped (only ASCII - counted as sign)', () => {
      // User may paste; we only treat ASCII - as sign; U+2212 removed with [^\d.\-]
      expect(formatNumber('\u2212123', 'en-US')).toBe('123');
    });
  });

  describe('parseFormattedNumber negative', () => {
    it('parses negative en format', () => {
      expect(parseFormattedNumber('-1,234.56', 'en-US')).toBe('-1234.56');
    });

    it('parses negative de format', () => {
      expect(parseFormattedNumber('-1.234,56', 'de')).toBe('-1234.56');
    });

    it('parses unicode minus prefix', () => {
      expect(parseFormattedNumber('\u22121,234.5', 'en-US')).toBe('-1234.5');
    });

    it('lone minus', () => {
      expect(parseFormattedNumber('-', 'en-US')).toBe('-');
    });
  });

  describe('round trip', () => {
    it('negative en', () => {
      const raw = '-9876543.21';
      const disp = formatNumber(raw, 'en-US');
      expect(disp).toBe('-9,876,543.21');
      expect(parseFormattedNumber(disp, 'en-US')).toBe(raw);
    });

    it('negative de', () => {
      const raw = '-9876543.21';
      const disp = formatNumber(raw, 'de');
      expect(disp).toBe('-9.876.543,21');
      expect(parseFormattedNumber(disp, 'de')).toBe(raw);
    });
  });
});
