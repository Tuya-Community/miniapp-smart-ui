import path from 'path';
import simulate from 'miniprogram-simulate';

describe('circle', () => {
  const SmartCircle = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-circle',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper).toBeTruthy();
  });
});

