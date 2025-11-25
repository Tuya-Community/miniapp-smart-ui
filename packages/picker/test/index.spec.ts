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
});

