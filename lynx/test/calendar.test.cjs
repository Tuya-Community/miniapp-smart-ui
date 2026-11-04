const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { model } = require('./helpers.cjs');
const root = path.resolve(__dirname, '../lib');

// Lynx executes these view helpers in JavaScript, where Date exists but the
// MiniApp WXS global getDate does not. Load the actual emitted dependency graph.
function helper(rel) {
  const file = path.resolve(root, rel);
  const result = { exports: {} };
  vm.runInNewContext(
    fs.readFileSync(file, 'utf8'),
    {
      module: result,
      require: request => helper(path.relative(root, path.resolve(path.dirname(file), request))),
    },
    { filename: file }
  );
  return result.exports;
}

test('Calendar view helpers produce the displayed month without a WXS getDate global', () => {
  const calendar = helper('calendar/index.wxs');
  const min = model.calendarParts(new Date(2026, 9, 28).getTime());
  assert.equal(calendar.formatMonthTitle(min, 'YYYY-MM'), '2026-10');
  assert.equal(calendar.formatYearTitle(min, 0, 'YYYY'), '2026');
  assert.equal(calendar.getVisible(0, 0), true);
  assert.equal(calendar.getVisible(0, 1), false);
});

test('Calendar month helpers lay out seven columns and handle leap-year February', () => {
  const month = helper('calendar-month/index.wxs');
  const date = model.calendarParts(new Date(2026, 9, 1).getTime());
  assert.equal(month.getMark(date), 10);
  assert.match(month.getDayStyle('', 0, date, 64, '#f00', 0), /margin-left:57\.142857/);
  assert.match(month.getMonthStyle(false, date, 64), /padding-bottom:\d+px/);
  assert.equal(model.calendarParts(new Date(2024, 1, 1).getTime()).days, 29);
  assert.equal(model.calendarParts(new Date(2025, 1, 1).getTime()).days, 28);
});
