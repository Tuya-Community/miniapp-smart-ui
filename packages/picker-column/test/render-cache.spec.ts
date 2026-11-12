import fs from 'fs';
import path from 'path';
import vm from 'vm';

// Execute the real WXS module: miniprogram-simulate does not run change:* bindings.
const loadWxs = (filename: string): any => {
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    module,
    getRegExp: (pattern: string, flags: string) => new RegExp(pattern, flags),
    require: (request: string) => loadWxs(path.resolve(path.dirname(filename), request)),
  });
  return module.exports;
};

const values = (count: number, start = 0) =>
  Array.from({ length: count }, (_, index) => String(start + index).padStart(2, '0'));

describe('picker-column render cache', () => {
  const mountColumn = () => {
    const computed = loadWxs(path.resolve(__dirname, '../index.wxs'));
    const dataset = {
      isdestroy: false,
      valuekey: 'text',
      itemheight: 44,
      visibleitemcount: 5,
      activeindex: 0,
      loop: false,
      animationtime: 300,
      changeanimation: false,
      windowed: false,
    };
    const setStyle = jest.fn();
    const owner = {
      selectComponent: (selector: string) =>
        selector === '.smart-picker-column' ? { getDataset: () => dataset } : { setStyle },
    };
    const update = (key: string, value: any, previous?: any) =>
      computed.updateValue('seconds', key)(value, previous, owner);
    update('options', values(58, 2));
    setStyle.mockClear();
    return { dataset, setStyle, update };
  };

  test('refreshes 08 to 06 when activeIndex arrives before the new seconds options', () => {
    const { dataset, setStyle, update } = mountColumn();
    dataset.activeindex = 6;
    update('activeIndex', 6);
    expect(setStyle.mock.calls[0][0]['--picker-item-content_6']).toBe('"08"');
    setStyle.mockClear();

    update('options', values(60), values(58, 2));

    expect(setStyle).toHaveBeenCalledTimes(1);
    expect(setStyle.mock.calls[0][0]['--picker-item-content_6']).toBe('"06"');
  });

  test('refreshes options even when the selected index and option count stay the same', () => {
    const { setStyle, update } = mountColumn();
    update('options', values(58), values(58, 2));

    expect(setStyle).toHaveBeenCalledTimes(1);
    expect(setStyle.mock.calls[0][0]['--picker-item-content_0']).toBe('"00"');
  });

  test('refreshes correctly when options arrive before activeIndex', () => {
    const { dataset, setStyle, update } = mountColumn();
    update('options', values(60), values(58, 2));
    dataset.activeindex = 6;
    update('activeIndex', 6);

    expect(setStyle.mock.calls[setStyle.mock.calls.length - 1][0]['--picker-item-content_6']).toBe(
      '"06"'
    );
  });

  test('keeps skipping redundant updates to other properties', () => {
    const { setStyle, update } = mountColumn();
    update('activeIndex', 0);
    expect(setStyle).not.toHaveBeenCalled();
  });
});
