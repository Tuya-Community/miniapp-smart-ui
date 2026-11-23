import { PageWithShow, subscribeToPageShow } from '../page-show';

describe('Navbar page show subscription', () => {
  it('preserves the page callback and removes the wrapper after the last unsubscribe', () => {
    const calls: string[] = [];
    const onShow = jest.fn(() => {
      calls.push('page');
      return 1;
    });
    const page = { onShow };
    const unsubscribeHome = subscribeToPageShow(page, () => calls.push('home'));
    const hook = page.onShow;
    const unsubscribeSecondary = subscribeToPageShow(page, () => calls.push('secondary'));

    expect(page.onShow).toBe(hook);
    expect(page.onShow()).toBe(1);
    expect(onShow.mock.instances[0]).toBe(page);
    expect(calls).toEqual(['page', 'home', 'secondary']);

    unsubscribeHome();
    page.onShow();
    expect(calls).toEqual(['page', 'home', 'secondary', 'page', 'secondary']);

    unsubscribeSecondary();
    expect(page.onShow).toBe(onShow);
  });

  it('restores an absent callback and preserves a replacement added by the page', () => {
    const page: PageWithShow = {};
    const firstUnsubscribe = subscribeToPageShow(page, jest.fn());
    firstUnsubscribe();
    expect(page).not.toHaveProperty('onShow');

    const secondUnsubscribe = subscribeToPageShow(page, jest.fn());
    const replacement = jest.fn();
    page.onShow = replacement;
    secondUnsubscribe();
    expect(page.onShow).toBe(replacement);
  });
});
