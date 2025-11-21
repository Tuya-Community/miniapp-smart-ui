import path from 'path';
import simulate from 'miniprogram-simulate';

describe('checkbox', () => {
  const SmartCheckbox = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-checkbox',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  const SmartCheckboxGroup = simulate.load(
    path.resolve(__dirname, '../../checkbox-group/index'),
    'smart-checkbox-group',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.value).toBe(false);
    expect(wrapper?.data.labelPosition).toBe('right');
    expect(wrapper?.data.shape).toBe('round');
    expect(wrapper?.data.iconSize).toBe(24);
  });

  test('should render with value', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" value="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.value).toBe(true);
  });

  test('should render with disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" disabled />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.disabled).toBe(true);
  });

  test('should render with checkedColor', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" checked-color="#ff0000" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.checkedColor).toBe('#ff0000');
  });

  test('should render with labelPosition left', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" label-position="left" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.labelPosition).toBe('left');
  });

  test('should render with labelPosition right', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" label-position="right" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.labelPosition).toBe('right');
  });

  test('should render with shape square', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" shape="square" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.shape).toBe('square');
  });

  test('should render with custom iconSize', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" icon-size="28" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.iconSize).toBe('28');
  });

  test('should render with useIconSlot', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" use-icon-slot />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.useIconSlot).toBe(true);
  });

  test('should render with labelDisabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" label-disabled />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.labelDisabled).toBe(true);
  });

  test('should emit change event when standalone checkbox is toggled', async () => {
    let changeValue: any = null;
    let inputValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" bind:change="onChange" bind:input="onInput" />`,
        methods: {
          onChange(event: any) {
            changeValue = event.detail;
          },
          onInput(event: any) {
            inputValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    // Mock getRelationNodes to return empty array for standalone checkbox
    // This ensures parent is undefined, so emitChange will call emit(this, value) directly
    if (instance) {
      (instance as any).getRelationNodes = jest.fn(() => []);
      // Force parent to be undefined by accessing it after mock
      const _ = (instance as any).parent; // This will trigger the getter with mocked getRelationNodes
    }

    // Toggle from false to true
    instance?.emitChange(true);
    await simulate.sleep(10);
    expect(changeValue).toBe(true);
    expect(inputValue).toBe(true);

    // Toggle from true to false
    changeValue = null;
    inputValue = null;
    instance?.emitChange(false);
    await simulate.sleep(10);
    expect(changeValue).toBe(false);
    expect(inputValue).toBe(false);
  });

  test('should toggle value when toggle is called', async () => {
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" value="{{ false }}" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    // Mock getRelationNodes to return empty array for standalone checkbox
    if (instance) {
      (instance as any).getRelationNodes = jest.fn(() => []);
      // Force parent to be undefined by accessing it after mock
      const _ = (instance as any).parent; // This will trigger the getter with mocked getRelationNodes
    }

    // Toggle should change value from false to true
    instance?.toggle();
    await simulate.sleep(10);
    expect(changeValue).toBe(true);
  });

  test('should not toggle when disabled', async () => {
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" value="{{ false }}" disabled bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    instance?.toggle();
    await simulate.sleep(10);
    expect(changeValue).toBeNull();
  });

  test('should not toggle when parentDisabled is true', async () => {
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" value="{{ false }}" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    // Set parentDisabled to true
    instance?.setData({ parentDisabled: true });
    await simulate.sleep(10);

    instance?.toggle();
    await simulate.sleep(10);
    expect(changeValue).toBeNull();
  });

  test('should toggle when onClickLabel is called', async () => {
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" value="{{ false }}" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    // Mock getRelationNodes to return empty array for standalone checkbox
    if (instance) {
      (instance as any).getRelationNodes = jest.fn(() => []);
      // Force parent to be undefined by accessing it after mock
      const _ = (instance as any).parent; // This will trigger the getter with mocked getRelationNodes
    }

    instance?.onClickLabel();
    await simulate.sleep(10);
    expect(changeValue).toBe(true);
  });

  test('should not toggle when onClickLabel is called and labelDisabled is true', async () => {
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" value="{{ false }}" label-disabled bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    instance?.onClickLabel();
    await simulate.sleep(10);
    expect(changeValue).toBeNull();
  });

  test('should not toggle when onClickLabel is called and disabled is true', async () => {
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
        },
        template: `<smart-checkbox id="wrapper" value="{{ false }}" disabled bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    instance?.onClickLabel();
    await simulate.sleep(10);
    expect(changeValue).toBeNull();
  });

  test('should work with checkbox-group - add value', async () => {
    let groupChangeValue: any = null;
    let groupInputValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
          'smart-checkbox-group': SmartCheckboxGroup,
        },
        template: `
          <smart-checkbox-group id="group" value="{{ [] }}" bind:change="onGroupChange" bind:input="onGroupInput">
            <smart-checkbox id="checkbox1" data-name="a" />
            <smart-checkbox id="checkbox2" data-name="b" />
          </smart-checkbox-group>
        `,
        methods: {
          onGroupChange(event: any) {
            groupChangeValue = event.detail;
          },
          onGroupInput(event: any) {
            groupInputValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));
    await simulate.sleep(20);

    const group = comp.querySelector('#group');
    const checkbox1 = comp.querySelector('#checkbox1');
    const instance1 = checkbox1?.instance;
    const groupInstance = group?.instance;

    await simulate.sleep(10);

    // Mock getRelationNodes to return group instance so parent is available
    // This allows emitChange to go through the if (this.parent) branch
    if (instance1 && groupInstance) {
      // Mock getRelationNodes to return array with group instance
      (instance1 as any).getRelationNodes = jest.fn(() => [groupInstance]);
      // Access parent to trigger getter with mocked getRelationNodes
      const _ = (instance1 as any).parent;
      
      // Now emitChange should go through if (this.parent) branch
      instance1.emitChange(true);
      await simulate.sleep(10);
      expect(groupChangeValue).toEqual(['a']);
      expect(groupInputValue).toEqual(['a']);
    }
  });

  test('should work with checkbox-group - remove value', async () => {
    let groupChangeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
          'smart-checkbox-group': SmartCheckboxGroup,
        },
        template: `
          <smart-checkbox-group id="group" value="{{ ['a'] }}" bind:change="onGroupChange">
            <smart-checkbox id="checkbox1" data-name="a" />
            <smart-checkbox id="checkbox2" data-name="b" />
          </smart-checkbox-group>
        `,
        methods: {
          onGroupChange(event: any) {
            groupChangeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));
    await simulate.sleep(20);

    const group = comp.querySelector('#group');
    const checkbox1 = comp.querySelector('#checkbox1');
    const instance1 = checkbox1?.instance;
    const groupInstance = group?.instance;

    await simulate.sleep(10);

    // Directly test setParentValue method to remove value
    if (instance1 && groupInstance) {
      instance1.setParentValue(groupInstance, false);
      await simulate.sleep(10);
      expect(groupChangeValue).toEqual([]);
    }
  });

  test('should work with checkbox-group - respect max limit', async () => {
    let groupChangeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
          'smart-checkbox-group': SmartCheckboxGroup,
        },
        template: `
          <smart-checkbox-group id="group" value="{{ ['a'] }}" max="{{ 2 }}" bind:change="onGroupChange">
            <smart-checkbox id="checkbox1" data-name="a" />
            <smart-checkbox id="checkbox2" data-name="b" />
            <smart-checkbox id="checkbox3" data-name="c" />
          </smart-checkbox-group>
        `,
        methods: {
          onGroupChange(event: any) {
            groupChangeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));
    await simulate.sleep(20);

    const group = comp.querySelector('#group');
    const checkbox2 = comp.querySelector('#checkbox2');
    const checkbox3 = comp.querySelector('#checkbox3');
    const instance2 = checkbox2?.instance;
    const instance3 = checkbox3?.instance;
    const groupInstance = group?.instance;

    await simulate.sleep(10);

    // Add 'b' - should work (now ['a', 'b'])
    if (instance2 && groupInstance) {
      groupChangeValue = null;
      instance2.setParentValue(groupInstance, true);
      await simulate.sleep(10);
      expect(groupChangeValue).toEqual(['a', 'b']);
      
      // Update group value to reflect the change
      groupInstance.setData({ value: ['a', 'b'] });
      await simulate.sleep(10);
    }

    // Try to add 'c' - should not work (max is 2, already have ['a', 'b'])
    if (instance3 && groupInstance) {
      groupChangeValue = null;
      instance3.setParentValue(groupInstance, true);
      await simulate.sleep(10);
      expect(groupChangeValue).toBeNull(); // Should not emit change
    }
  });

  test('should work with checkbox-group - do not add duplicate value', async () => {
    let groupChangeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
          'smart-checkbox-group': SmartCheckboxGroup,
        },
        template: `
          <smart-checkbox-group id="group" value="{{ ['a'] }}" bind:change="onGroupChange">
            <smart-checkbox id="checkbox1" data-name="a" />
          </smart-checkbox-group>
        `,
        methods: {
          onGroupChange(event: any) {
            groupChangeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));
    await simulate.sleep(20);

    const group = comp.querySelector('#group');
    const checkbox1 = comp.querySelector('#checkbox1');
    const instance1 = checkbox1?.instance;
    const groupInstance = group?.instance;

    await simulate.sleep(10);

    // Try to add 'a' again - should not emit change (already in array)
    if (instance1 && groupInstance) {
      groupChangeValue = null;
      instance1.setParentValue(groupInstance, true);
      await simulate.sleep(10);
      expect(groupChangeValue).toBeNull();
    }
  });

  test('should work with checkbox-group - remove non-existent value', async () => {
    let groupChangeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-checkbox': SmartCheckbox,
          'smart-checkbox-group': SmartCheckboxGroup,
        },
        template: `
          <smart-checkbox-group id="group" value="{{ ['a'] }}" bind:change="onGroupChange">
            <smart-checkbox id="checkbox1" data-name="a" />
            <smart-checkbox id="checkbox2" data-name="b" />
          </smart-checkbox-group>
        `,
        methods: {
          onGroupChange(event: any) {
            groupChangeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));
    await simulate.sleep(20);

    const group = comp.querySelector('#group');
    const checkbox2 = comp.querySelector('#checkbox2');
    const instance2 = checkbox2?.instance;
    const groupInstance = group?.instance;

    await simulate.sleep(10);

    // Try to remove 'b' which is not in array - should not emit change
    if (instance2 && groupInstance) {
      groupChangeValue = null;
      instance2.setParentValue(groupInstance, false);
      await simulate.sleep(10);
      expect(groupChangeValue).toBeNull();
    }
  });
});

