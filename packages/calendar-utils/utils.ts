export const ROW_HEIGHT = 34;

export function formatMonthTitle(date: Date, formatter = 'YYYY-MM') {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1 + '';
  return formatter.replace('YYYY', year + '').replace('MM', month);
}

export function compareMonth(date1: Date | number, date2: Date | number) {
  if (!(date1 instanceof Date)) {
    date1 = new Date(date1);
  }

  if (!(date2 instanceof Date)) {
    date2 = new Date(date2);
  }

  const year1 = date1.getFullYear();
  const year2 = date2.getFullYear();
  const month1 = date1.getMonth();
  const month2 = date2.getMonth();

  if (year1 === year2) {
    return month1 === month2 ? 0 : month1 > month2 ? 1 : -1;
  }

  return year1 > year2 ? 1 : -1;
}

export function compareDay(day1: Date | number, day2: Date | number) {
  if (!(day1 instanceof Date)) {
    day1 = new Date(day1);
  }

  if (!(day2 instanceof Date)) {
    day2 = new Date(day2);
  }

  const compareMonthResult = compareMonth(day1, day2);

  if (compareMonthResult === 0) {
    const date1 = day1.getDate();
    const date2 = day2.getDate();

    return date1 === date2 ? 0 : date1 > date2 ? 1 : -1;
  }

  return compareMonthResult;
}

export function getDayByOffset(date: Date, offset: number) {
  date = new Date(date);
  date.setDate(date.getDate() + offset);

  return date;
}

export function getPrevDay(date: Date) {
  return getDayByOffset(date, -1);
}

export function getNextDay(date: Date) {
  return getDayByOffset(date, 1);
}

export function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function calcDateNum(date: [Date, Date]) {
  const day1 = new Date(date[0]).getTime();
  const day2 = new Date(date[1]).getTime();
  return (day2 - day1) / (1000 * 60 * 60 * 24) + 1;
}

export function copyDates(dates: Date | Date[]) {
  if (Array.isArray(dates)) {
    return dates.map(date => {
      if (date === null) {
        return date;
      }

      return new Date(date);
    });
  }

  return new Date(dates);
}

export function getMonthEndDay(year: number, month: number): number {
  return 32 - new Date(year, month - 1, 32).getDate();
}

export function getMonths(minDate: number, maxDate: number) {
  const months: number[] = [];
  const cursor = new Date(minDate);

  cursor.setDate(1);

  do {
    months.push(cursor.getTime());
    cursor.setMonth(cursor.getMonth() + 1);
  } while (compareMonth(cursor, maxDate) !== 1);

  return months;
}

export function getYears(minDate: number, maxDate: number) {
  const years: number[] = [];
  const cursor = new Date(minDate);

  cursor.setDate(1);

  do {
    years.push(cursor.getTime());
    cursor.setFullYear(cursor.getFullYear() + 1);
  } while (compareMonth(cursor, maxDate) !== 1);

  return years;
}

function findLastGreaterOrEqual(arr, n) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1; // 初始化为 -1，若无符合条件的元素返回 -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] <= n) {
      result = mid; // 暂存满足条件的索引
      left = mid + 1; // 继续向右搜索更大的满足条件的元素
    } else {
      right = mid - 1;
    }
  }

  return result;
}

export function getCurrentIndex(currentDate, months) {
  if (Array.isArray(currentDate)) {
    currentDate = currentDate[0];
  }
  return findLastGreaterOrEqual(months, currentDate);
}

export function getWeekStartAndEnd(date: Date) {
  const startOfWeek = new Date(date);

  const dayOfWeek = startOfWeek.getDay();

  const diffToMonday = (dayOfWeek + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    weekStart: startOfWeek,
    weekEnd: endOfWeek,
  };
}

export const getInitEdgeDate = (type: string) => {
  const currentYear = new Date().getFullYear();

  if (type === 'month') {
    const minMonthDate = new Date(currentYear - 1, 1, 1).getTime();
    const maxMonthDate = new Date(currentYear + 1, 12, 31).getTime();
    return {
      min: minMonthDate,
      max: maxMonthDate,
    };
  }
  if (type === 'year') {
    const minMonthDate = new Date(currentYear - 10, 1, 1).getTime();
    const maxMonthDate = new Date(currentYear + 10, 12, 31).getTime();
    return {
      min: minMonthDate,
      max: maxMonthDate,
    };
  }

  const initialMinDate = getToday().getTime();

  const initialMaxDate = (() => {
    const now = getToday();
    return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate()).getTime();
  })();

  return {
    min: initialMinDate,
    max: initialMaxDate,
  };
};
