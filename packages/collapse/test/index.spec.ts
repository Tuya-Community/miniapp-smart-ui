import path from 'path';
import simulate from 'miniprogram-simulate';

describe('collapse', () => {
  const SmartCollapse = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-collapse',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should handle updateExpanded', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse': SmartCollapse,
        },
        template: `<smart-collapse id="collapse" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#collapse');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock children using getRelationNodes
      const mockChild1 = { updateExpanded: jest.fn() };
      const mockChild2 = { updateExpanded: jest.fn() };
      const mockChildren = [mockChild1, mockChild2];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);

      instance.updateExpanded();
      await simulate.sleep(10);

      expect(mockChild1.updateExpanded).toHaveBeenCalled();
      expect(mockChild2.updateExpanded).toHaveBeenCalled();
    }
  });

  test('should handle switch with accordion false and expanded true', async () => {
    let changeEvent: any = null;
    let inputEvent: any = null;
    let openEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse': SmartCollapse,
        },
        template: `<smart-collapse id="collapse" value="{{ value }}" accordion="{{ false }}" bind:change="onChange" bind:input="onInput" bind:open="onOpen" />`,
        data: {
          value: [],
        },
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onOpen(event: any) {
            openEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#collapse');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.data.accordion = false;
      instance.data.value = [];

      instance.switch('item1', true);
      await simulate.sleep(10);

      expect(openEvent).toBe('item1');
      expect(changeEvent).toEqual(['item1']);
      expect(inputEvent).toEqual(['item1']);
    }
  });

  test('should handle switch with accordion false and expanded false', async () => {
    let changeEvent: any = null;
    let inputEvent: any = null;
    let closeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse': SmartCollapse,
        },
        template: `<smart-collapse id="collapse" value="{{ value }}" accordion="{{ false }}" bind:change="onChange" bind:input="onInput" bind:close="onClose" />`,
        data: {
          value: ['item1', 'item2'],
        },
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onClose(event: any) {
            closeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#collapse');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.data.accordion = false;
      instance.data.value = ['item1', 'item2'];

      instance.switch('item1', false);
      await simulate.sleep(10);

      expect(closeEvent).toBe('item1');
      expect(changeEvent).toEqual(['item2']);
      expect(inputEvent).toEqual(['item2']);
    }
  });

  test('should handle switch with accordion true and expanded true', async () => {
    let changeEvent: any = null;
    let inputEvent: any = null;
    let openEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse': SmartCollapse,
        },
        template: `<smart-collapse id="collapse" value="{{ value }}" accordion="{{ true }}" bind:change="onChange" bind:input="onInput" bind:open="onOpen" />`,
        data: {
          value: '',
        },
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onOpen(event: any) {
            openEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#collapse');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.data.accordion = true;
      instance.data.value = '';

      instance.switch('item1', true);
      await simulate.sleep(10);

      expect(openEvent).toBe('item1');
      expect(changeEvent).toBe('item1');
      expect(inputEvent).toBe('item1');
    }
  });

  test('should handle switch with accordion true and expanded false', async () => {
    let changeEvent: any = null;
    let inputEvent: any = null;
    let closeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse': SmartCollapse,
        },
        template: `<smart-collapse id="collapse" value="{{ value }}" accordion="{{ true }}" bind:change="onChange" bind:input="onInput" bind:close="onClose" />`,
        data: {
          value: 'item1',
        },
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onClose(event: any) {
            closeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#collapse');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.data.accordion = true;
      instance.data.value = 'item1';

      instance.switch('item1', false);
      await simulate.sleep(10);

      expect(closeEvent).toBe('item1');
      expect(changeEvent).toBe('');
      expect(inputEvent).toBe('');
    }
  });

  test('should handle switch with accordion false and value null', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse': SmartCollapse,
        },
        template: `<smart-collapse id="collapse" accordion="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#collapse');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.data.accordion = false;
      instance.data.value = null;

      instance.switch('item1', true);
      await simulate.sleep(10);

      // Should not throw error
      expect(instance.data.value).toBeDefined();
    }
  });
});

