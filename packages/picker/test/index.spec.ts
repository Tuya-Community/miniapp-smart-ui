import path from 'path';
import simulate from 'miniprogram-simulate';

describe('picker', () => {
  const SmartPicker = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-picker',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should log error when visibleItemCount is invalid', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" visible-item-count="{{ 4 }}" />`,
        data: {
          visibleItemCount: 4,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    await simulate.sleep(10);

    expect(consoleErrorSpy).toHaveBeenCalledWith('visibleItemCount 的值必须为 3, 5, 7, 9');

    consoleErrorSpy.mockRestore();
  });

  test('should emit event in simple mode', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" bind:confirm="onConfirm" />`,
        data: {
          columns: ['选项1', '选项2', '选项3'],
        },
        methods: {
          onConfirm(event: any) {
            confirmEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock children for simple mode
      const mockChild = {
        getValue: jest.fn(() => '选项2'),
        data: { currentIndex: 1 },
      };
      // Mock selectAllComponents to return mock children
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      instance.emit({
        currentTarget: {
          dataset: {
            type: 'confirm',
          },
        },
      });
      await simulate.sleep(10);

      expect(confirmEvent).toEqual({
        value: '选项2',
        index: 1,
      });
    }
  });

  test('should emit change event in simple mode', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" bind:change="onChange" />`,
        data: {
          columns: ['选项1', '选项2', '选项3'],
        },
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        getValue: jest.fn(() => '选项2'),
        data: { currentIndex: 1 },
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      instance.onChange({
        currentTarget: {
          dataset: {
            index: 0,
          },
        },
      });
      await simulate.sleep(10);

      expect(changeEvent).toEqual({
        picker: instance,
        value: '选项2',
        index: 1,
      });
    }
  });

  test('should emit event in multi-column mode', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" bind:confirm="onConfirm" />`,
        data: {
          columns: [
            { values: ['选项1', '选项2'] },
            { values: ['选项A', '选项B'] },
          ],
        },
        methods: {
          onConfirm(event: any) {
            confirmEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChildren = [
        { getValue: jest.fn(() => '选项2'), data: { currentIndex: 1 } },
        { getValue: jest.fn(() => '选项A'), data: { currentIndex: 0 } },
      ];
      instance.selectAllComponents = jest.fn(() => mockChildren);

      instance.emit({
        currentTarget: {
          dataset: {
            type: 'confirm',
          },
        },
      });
      await simulate.sleep(10);

      expect(confirmEvent).toEqual({
        value: ['选项2', '选项A'],
        index: [1, 0],
      });
    }
  });

  test('should emit change event in multi-column mode', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" bind:change="onChange" />`,
        data: {
          columns: [
            { values: ['选项1', '选项2'] },
            { values: ['选项A', '选项B'] },
          ],
        },
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChildren = [
        { getValue: jest.fn(() => '选项2'), data: { currentIndex: 1 } },
        { getValue: jest.fn(() => '选项A'), data: { currentIndex: 0 } },
      ];
      instance.selectAllComponents = jest.fn(() => mockChildren);

      instance.onChange({
        currentTarget: {
          dataset: {
            index: 1,
          },
        },
      });
      await simulate.sleep(10);

      expect(changeEvent).toEqual({
        picker: instance,
        value: ['选项2', '选项A'],
        index: 1,
      });
    }
  });

  test('should get column by index', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [
            { values: ['选项1', '选项2'] },
            { values: ['选项A', '选项B'] },
          ],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = { getValue: jest.fn(), data: {} };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      const column = instance.getColumn(0);
      expect(column).toBe(mockChild);
    }
  });

  test('should get column value by index', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        getValue: jest.fn(() => '选项2'),
        data: {},
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      const value = instance.getColumnValue(0);
      expect(value).toBe('选项2');
    }
  });

  test('should get column index by column index', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        getValue: jest.fn(),
        data: { currentIndex: 2 },
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      const index = instance.getColumnIndex(0);
      expect(index).toBe(2);
    }
  });

  test('should get column values by index', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [
            { values: ['选项1', '选项2'] },
          ],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        getValue: jest.fn(),
        data: { options: ['选项1', '选项2'] },
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      const values = instance.getColumnValues(0);
      expect(values).toEqual(['选项1', '选项2']);
    }
  });

  test('should get all values', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [
            { values: ['选项1', '选项2'] },
            { values: ['选项A', '选项B'] },
          ],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChildren = [
        { getValue: jest.fn(() => '选项2'), data: {} },
        { getValue: jest.fn(() => '选项A'), data: {} },
      ];
      // Mock selectAllComponents instead of redefining children
      instance.selectAllComponents = jest.fn(() => mockChildren);

      const values = instance.getValues();
      expect(values).toEqual(['选项2', '选项A']);
    }
  });

  test('should get all indexes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [
            { values: ['选项1', '选项2'] },
            { values: ['选项A', '选项B'] },
          ],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChildren = [
        { getValue: jest.fn(), data: { currentIndex: 1 } },
        { getValue: jest.fn(), data: { currentIndex: 0 } },
      ];
      // Mock selectAllComponents instead of redefining children
      instance.selectAllComponents = jest.fn(() => mockChildren);

      const indexes = instance.getIndexes();
      expect(indexes).toEqual([1, 0]);
    }
  });

  test('should emit animation-start event', async () => {
    let animationStartEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" bind:animation-start="onAnimationStart" />`,
        methods: {
          onAnimationStart() {
            animationStartEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.animationStart();
      await simulate.sleep(10);

      expect(wrapper?.data.animating).toBe(true);
      expect(animationStartEmitted).toBe(true);
    }
  });

  test('should not emit animation-start when already animating', async () => {
    let animationStartEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" bind:animation-start="onAnimationStart" />`,
        methods: {
          onAnimationStart() {
            animationStartEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ animating: true });
      instance.animationStart();
      await simulate.sleep(10);

      // Should not emit again
      expect(animationStartEmitted).toBe(false);
    }
  });

  test('should emit animation-end event', async () => {
    let animationEndEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" bind:animation-end="onAnimationEnd" />`,
        methods: {
          onAnimationEnd() {
            animationEndEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ animating: true });
      instance.animationEnd();
      await simulate.sleep(10);

      expect(wrapper?.data.animating).toBe(false);
      expect(animationEndEmitted).toBe(true);
    }
  });

  test('should not emit animation-end when not animating', async () => {
    let animationEndEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" bind:animation-end="onAnimationEnd" />`,
        methods: {
          onAnimationEnd() {
            animationEndEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ animating: false });
      instance.animationEnd();
      await simulate.sleep(10);

      // Should not emit
      expect(animationEndEmitted).toBe(false);
    }
  });

  test('should set column value successfully', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        setValue: jest.fn(() => Promise.resolve()),
        getValue: jest.fn(),
        data: {},
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      await instance.setColumnValue(0, '选项2');
      await simulate.sleep(10);

      expect(mockChild.setValue).toHaveBeenCalledWith('选项2');
    }
  });

  test('should reject when setColumnValue column does not exist', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: ['选项1', '选项2'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.selectAllComponents = jest.fn(() => []);

      await expect(instance.setColumnValue(5, '选项2')).rejects.toThrow(
        'setColumnValue: The corresponding column does not exist'
      );
    }
  });

  test('should set column index successfully', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        setIndex: jest.fn(() => Promise.resolve()),
        data: {},
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      await instance.setColumnIndex(0, 2);
      await simulate.sleep(10);

      expect(mockChild.setIndex).toHaveBeenCalledWith(2);
    }
  });

  test('should reject when setColumnIndex column does not exist', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: ['选项1', '选项2'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.selectAllComponents = jest.fn(() => []);

      await expect(instance.setColumnIndex(5, 2)).rejects.toThrow(
        'setColumnIndex: The corresponding column does not exist'
      );
    }
  });

  test('should set column values successfully', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [{ values: ['选项1', '选项2'] }],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        set: jest.fn(() => Promise.resolve()),
        setIndex: jest.fn(),
        data: { options: ['选项1', '选项2'] },
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      await instance.setColumnValues(0, ['选项3', '选项4']);
      await simulate.sleep(10);

      expect(mockChild.set).toHaveBeenCalledWith({ options: ['选项3', '选项4'] });
      expect(mockChild.setIndex).toHaveBeenCalledWith(0);
    }
  });

  test('should resolve immediately when setColumnValues with same options', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [{ values: ['选项1', '选项2'] }],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        set: jest.fn(),
        setIndex: jest.fn(),
        data: { options: ['选项1', '选项2'] },
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      await instance.setColumnValues(0, ['选项1', '选项2']);
      await simulate.sleep(10);

      expect(mockChild.set).not.toHaveBeenCalled();
      expect(mockChild.setIndex).not.toHaveBeenCalled();
    }
  });

  test('should set column values without reset when needReset is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [{ values: ['选项1', '选项2'] }],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        set: jest.fn(() => Promise.resolve()),
        setIndex: jest.fn(),
        data: { options: ['选项1', '选项2'] },
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);

      await instance.setColumnValues(0, ['选项3', '选项4'], false);
      await simulate.sleep(10);

      expect(mockChild.set).toHaveBeenCalledWith({ options: ['选项3', '选项4'] });
      expect(mockChild.setIndex).not.toHaveBeenCalled();
    }
  });

  test('should reject when setColumnValues column does not exist', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [{ values: ['选项1', '选项2'] }],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.selectAllComponents = jest.fn(() => []);

      await expect(instance.setColumnValues(5, ['选项3', '选项4'])).rejects.toThrow(
        'setColumnValues: The corresponding column does not exist'
      );
    }
  });

  test('should set all values', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [
            { values: ['选项1', '选项2'] },
            { values: ['选项A', '选项B'] },
          ],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = {
        setValue: jest.fn(() => Promise.resolve()),
        getValue: jest.fn(),
        data: {},
      };
      const mockChild2 = {
        setValue: jest.fn(() => Promise.resolve()),
        getValue: jest.fn(),
        data: {},
      };
      instance.selectAllComponents = jest.fn(() => [mockChild1, mockChild2]);

      await instance.setValues(['选项2', '选项A']);
      await simulate.sleep(10);

      expect(mockChild1.setValue).toHaveBeenCalledWith('选项2');
      expect(mockChild2.setValue).toHaveBeenCalledWith('选项A');
    }
  });

  test('should set all indexes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [
            { values: ['选项1', '选项2'] },
            { values: ['选项A', '选项B'] },
          ],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = {
        setIndex: jest.fn(() => Promise.resolve()),
        data: {},
      };
      const mockChild2 = {
        setIndex: jest.fn(() => Promise.resolve()),
        data: {},
      };
      instance.selectAllComponents = jest.fn(() => [mockChild1, mockChild2]);

      await instance.setIndexes([1, 0]);
      await simulate.sleep(10);

      expect(mockChild1.setIndex).toHaveBeenCalledWith(1);
      expect(mockChild2.setIndex).toHaveBeenCalledWith(0);
    }
  });

  test('should handle setColumns', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        set: jest.fn(() => Promise.resolve()),
        setIndex: jest.fn(),
        data: { options: [] },
      };
      instance.selectAllComponents = jest.fn(() => [mockChild]);
      instance.setColumnValues = jest.fn(() => Promise.resolve());

      await instance.setColumns();
      await simulate.sleep(10);

      expect(instance.setColumnValues).toHaveBeenCalled();
    }
  });

  test('should handle columns observer for simple mode', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: ['选项1', '选项2'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setColumns = jest.fn(() => Promise.resolve());
      instance.selectAllComponents = jest.fn(() => [{ data: {} }]);

      // Change columns to trigger observer
      wrapper?.setData({ columns: ['选项3', '选项4'] });
      await simulate.sleep(10);

      expect(instance.simple).toBe(true);
    }
  });

  test('should handle columns observer for multi-column mode', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [{ values: ['选项1', '选项2'] }],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setColumns = jest.fn(() => Promise.resolve());
      instance.selectAllComponents = jest.fn(() => [{ data: {} }]);

      // Change columns to trigger observer
      wrapper?.setData({
        columns: [
          { values: ['选项3', '选项4'] },
          { values: ['选项A', '选项B'] },
        ],
      });
      await simulate.sleep(10);

      expect(instance.simple).toBe(false);
    }
  });

  test('should handle columns observer with empty columns', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: [],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Change columns to empty array
      wrapper?.setData({ columns: [] });
      await simulate.sleep(10);

      // When columns is empty, simple = columns.length && !columns[0].values
      // Since columns.length is 0, simple should be false (0 && ... = 0)
      expect(instance.simple).toBeFalsy();
    }
  });



  test('should handle children getter returning empty array', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker': SmartPicker,
        },
        template: `<smart-picker id="wrapper" columns="{{ columns }}" />`,
        data: {
          columns: ['选项1', '选项2'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.selectAllComponents = jest.fn(() => []);

      const children = instance.children;
      expect(children).toEqual([]);
    }
  });
});

