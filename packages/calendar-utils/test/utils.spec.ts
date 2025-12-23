import {
  formatMonthTitle,
  compareMonth,
  compareDay,
  getDayByOffset,
  getPrevDay,
  getNextDay,
  getToday,
  calcDateNum,
  copyDates,
  getMonthEndDay,
  getMonths,
  getYears,
  getCurrentIndex,
  getWeekStartAndEnd,
  getInitEdgeDate,
} from '../utils';

describe('calendar-utils', () => {
  describe('formatMonthTitle', () => {
    test('should format date with default formatter', () => {
      const date = new Date(2024, 0, 15);
      const result = formatMonthTitle(date);
      expect(result).toBe('2024-01');
    });

    test('should format date with custom formatter', () => {
      const date = new Date(2024, 0, 15);
      const result = formatMonthTitle(date, 'YYYY年MM月');
      expect(result).toBe('2024年01月');
    });

    test('should handle non-Date input', () => {
      const date = new Date(2024, 0, 15).getTime();
      const result = formatMonthTitle(date as any);
      expect(result).toBe('2024-01');
    });

    test('should handle Date string input', () => {
      const date = '2024-01-15';
      const result = formatMonthTitle(date as any);
      expect(result).toBe('2024-01');
    });
  });

  describe('compareMonth', () => {
    test('should compare months correctly', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 1, 15);
      expect(compareMonth(date1, date2)).toBe(-1);
      expect(compareMonth(date2, date1)).toBe(1);
      expect(compareMonth(date1, new Date(2024, 0, 20))).toBe(0);
    });

    test('should handle non-Date input for date1', () => {
      const date1 = new Date(2024, 0, 15).getTime();
      const date2 = new Date(2024, 1, 15);
      expect(compareMonth(date1, date2)).toBe(-1);
    });

    test('should handle non-Date input for date2', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 1, 15).getTime();
      expect(compareMonth(date1, date2)).toBe(-1);
    });

    test('should handle non-Date input for both', () => {
      const date1 = new Date(2024, 0, 15).getTime();
      const date2 = new Date(2024, 1, 15).getTime();
      expect(compareMonth(date1, date2)).toBe(-1);
    });

    test('should compare different years', () => {
      const date1 = new Date(2023, 0, 15);
      const date2 = new Date(2024, 0, 15);
      expect(compareMonth(date1, date2)).toBe(-1);
      expect(compareMonth(date2, date1)).toBe(1);
    });
  });

  describe('compareDay', () => {
    test('should compare days correctly', () => {
      const day1 = new Date(2024, 0, 15);
      const day2 = new Date(2024, 0, 16);
      expect(compareDay(day1, day2)).toBe(-1);
      expect(compareDay(day2, day1)).toBe(1);
      expect(compareDay(day1, new Date(2024, 0, 15))).toBe(0);
    });

    test('should handle non-Date input', () => {
      const day1 = new Date(2024, 0, 15).getTime();
      const day2 = new Date(2024, 0, 16);
      expect(compareDay(day1, day2)).toBe(-1);
    });

    test('should compare days in different months', () => {
      const day1 = new Date(2024, 0, 15);
      const day2 = new Date(2024, 1, 15);
      expect(compareDay(day1, day2)).toBe(-1);
      expect(compareDay(day2, day1)).toBe(1);
    });
  });

  describe('getDayByOffset', () => {
    test('should get day by offset', () => {
      const date = new Date(2024, 0, 15);
      const result = getDayByOffset(date, 5);
      expect(result.getDate()).toBe(20);
    });

    test('should handle negative offset', () => {
      const date = new Date(2024, 0, 15);
      const result = getDayByOffset(date, -5);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('getPrevDay', () => {
    test('should get previous day', () => {
      const date = new Date(2024, 0, 15);
      const result = getPrevDay(date);
      expect(result.getDate()).toBe(14);
    });
  });

  describe('getNextDay', () => {
    test('should get next day', () => {
      const date = new Date(2024, 0, 15);
      const result = getNextDay(date);
      expect(result.getDate()).toBe(16);
    });
  });

  describe('getToday', () => {
    test('should get today with time set to 00:00:00', () => {
      const today = getToday();
      expect(today.getHours()).toBe(0);
      expect(today.getMinutes()).toBe(0);
      expect(today.getSeconds()).toBe(0);
      expect(today.getMilliseconds()).toBe(0);
    });
  });

  describe('calcDateNum', () => {
    test('should calculate date number', () => {
      const dates: [Date, Date] = [
        new Date(2024, 0, 15),
        new Date(2024, 0, 20),
      ];
      const result = calcDateNum(dates);
      expect(result).toBe(6);
    });
  });

  describe('copyDates', () => {
    test('should copy single date', () => {
      const date = new Date(2024, 0, 15);
      const result = copyDates(date);
      expect(result).toBeInstanceOf(Date);
      if (result instanceof Date) {
        expect(result.getTime()).toBe(date.getTime());
      }
    });

    test('should copy array of dates', () => {
      const dates = [
        new Date(2024, 0, 15),
        new Date(2024, 0, 16),
        null as any,
      ];
      const result = copyDates(dates);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(Date);
      expect(result[1]).toBeInstanceOf(Date);
      expect(result[2]).toBe(null);
    });
  });

  describe('getMonthEndDay', () => {
    test('should get month end day', () => {
      expect(getMonthEndDay(2024, 1)).toBe(31);
      expect(getMonthEndDay(2024, 2)).toBe(29); // 2024 is leap year
      expect(getMonthEndDay(2024, 4)).toBe(30);
    });
  });

  describe('getMonths', () => {
    test('should get months between dates', () => {
      const start = new Date(2024, 0, 1).getTime();
      const end = new Date(2024, 2, 31).getTime();
      const result = getMonths(start, end);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getYears', () => {
    test('should get years between dates', () => {
      const start = new Date(2020, 0, 1).getTime();
      const end = new Date(2024, 11, 31).getTime();
      const result = getYears(start, end);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getCurrentIndex', () => {
    test('should get current index from array', () => {
      const months = [
        new Date(2024, 0, 1).getTime(),
        new Date(2024, 1, 1).getTime(),
        new Date(2024, 2, 1).getTime(),
      ];
      const currentDate = new Date(2024, 1, 15).getTime();
      const result = getCurrentIndex(currentDate, months);
      expect(result).toBe(1);
    });

    test('should handle array currentDate', () => {
      const months = [
        new Date(2024, 0, 1).getTime(),
        new Date(2024, 1, 1).getTime(),
      ];
      const currentDate = [new Date(2024, 0, 15).getTime()];
      const result = getCurrentIndex(currentDate, months);
      expect(result).toBe(0);
    });
  });

  describe('getWeekStartAndEnd', () => {
    test('should get week start and end', () => {
      const date = new Date(2024, 0, 15); // Monday
      const result = getWeekStartAndEnd(date);
      expect(result.weekStart).toBeInstanceOf(Date);
      expect(result.weekEnd).toBeInstanceOf(Date);
    });
  });

  describe('getInitEdgeDate', () => {
    test('should get init edge date for month type', () => {
      const result = getInitEdgeDate('month');
      expect(result.min).toBeDefined();
      expect(result.max).toBeDefined();
    });

    test('should get init edge date for year type', () => {
      const result = getInitEdgeDate('year');
      expect(result.min).toBeDefined();
      expect(result.max).toBeDefined();
    });

    test('should get init edge date for default type', () => {
      const result = getInitEdgeDate('default');
      expect(result.min).toBeDefined();
      expect(result.max).toBeDefined();
    });
  });
});

