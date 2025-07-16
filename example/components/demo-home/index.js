import list from '../../config';
const isWX = typeof ty === 'undefined' && typeof wx === 'object';
const blackWXRoute = ['/slider', '/circle'];
Component({
  data: {
    list: isWX
      ? list.map(item => {
          return {
            groupName: item.groupName,
            list: item.list.filter(detail => !blackWXRoute.includes(detail.path)),
          };
        })
      : list,
  },
});
