# Area Province/City/District Selector

### Introduction

The Province/City/District Selector component is usually used with the [Popup](/material/smartui?comId=popup&appType=miniapp) component.

### Import

Import the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-area": "@tuya-miniapp/smart-ui/lib/area/index"
}
```

## Code Examples

### Basic Usage

To initialize the Province/City/District component, you need to pass the Province/City/District data through the `area-list` attribute.

```html
<smart-area area-list="{{ areaList }}" />
```

### areaList Format

areaList is an object structure that contains three keys: `province_list`, `city_list`, and `county_list`.

Each item uses the area code as the key and the province/city/district name as the value. The area code is a 6-digit number, with the first two digits representing the province, the middle two digits representing the city, and the last two digits representing the district, padded with zeros to 6 digits. For example, the area code for Beijing is `11`, padded to 6 digits, it becomes `110000`.

Example data:

```js
const areaList = {
  province_list: {
    110000: 'Beijing',
    120000: 'Tianjin',
  },
  city_list: {
    110100: 'Beijing',
    120100: 'Tianjin',
  },
  county_list: {
    110101: 'Dongcheng District',
    110102: 'Xicheng District',
    // ....
  },
};
```

### @tuya-miniapp/area-data

MiniApp officially provides a default set of Province/City/District data, which can be imported via [@tuya-miniapp/area-data](TODO: url).

```bash
yarn add @tuya-miniapp/area-data
```

```ts
import { areaList } from '@tuya-miniapp/area-data';

Page({
  data: {
    areaList,
  },
});
```

### Select Province/City/District

If you want to select a specific province/city/district, you need to pass a `value` attribute and bind it to the corresponding province/city/district `code`.

```html
<smart-area area-list="{{ areaList }}" value="110101" />
```

### Configure Display Columns

You can configure the number of display columns of the Province/City/District using the `columns-num` attribute. By default, it displays province, city, and district. If you set it to `2`, only province and city will be displayed.

```html
<smart-area area-list="{{ areaList }}" columns-num="{{ 2 }}" title="Title" />
```

### Configure Placeholder Text for Columns

You can configure the placeholder text for each column using the `columns-placeholder` attribute.

```html
<smart-area 
  area-list="{{ areaList }}" 
  columns-placeholder="{{ ['Please select', 'Please select', 'Please select'] }}" 
  title="Title" 
/>
```

## Cloud Development Example

### Use Cloud Development to Get Province/City/District Data

In actual projects, you can use the capabilities of [WeChat Mini Program Cloud Development](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html) to store the Province/City/District data in the cloud development database, and use the cloud development interface in the mini program to asynchronously fetch data.

You need to call the `wx.cloud.init` method to complete the cloud capability initialization before using cloud capabilities in the mini program.

```js
const db = wx.cloud.database();

db.collection('region')
  .limit(1)
  .get()
  .then((res) => {
    if (res.data && res.data.length > 0) {
      this.setData({
        areaList: res.data[0],
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
```

## API

### Props

| Parameter           | Description                              | Type       | Default  |
| ------------------- | ---------------------------------------- | ---------- | -------- |
| area-list           | Province/City/District data, see format below | _object_   | -        |
| cancel-button-text  | Cancel button text                       | _string_   | `Cancel` |
| columns-num         | Number of columns to display, 3-Provinces/Cities/Districts, 2-Provinces/Cities, 1-Provinces | _number_   | `3`      |
| columns-placeholder | Placeholder text for columns             | _string[]_ | `[]`     |
| confirm-button-text | Confirm button text                      | _string_   | `Confirm`|
| item-height         | Option height                            | _number_   | `44`     |
| loading             | Whether to show loading state            | _boolean_  | `false`  |
| show-toolbar        | Whether to show the top toolbar          | _boolean_  | `true`   |
| title               | Top toolbar title                        | _string_   | -        |
| value               | Currently selected province/city/district `code` | _string_   | -        |
| visible-item-count  | Number of visible items                  | _number_   | `6`      |

### Events

| Event         | Description             | Callback Parameters                         |
| ------------- | ----------------------- | ------------------------------------------- |
| bind:cancel   | Triggered when the cancel button is clicked | -                                           |
| bind:change   | Triggered when the option changes | Picker instance, all selected values of the columns, the index corresponding to the current column |
| bind:confirm  | Triggered when the confirm button in the top right corner is clicked | An array parameter, see the data format section below for details |

### Methods

You can get the Area instance and call instance methods through [selectComponent](/material/smartui?comId=faq&appType=miniapp).

| Method Name | Parameter    | Return Value | Description |
| ----------- | ------------ | ------------ | ----------- |
| reset       | code: string | -            | Reset all options based on the code, if the code is not passed, it will reset to the first option |

### Data Format when Clicking Confirm

The data returned is an Object containing two keys: `values` and `index`.

`values` is an array containing `columnsNum` pieces of data. Each piece of data corresponds to the data selected in each column of options.

`code` represents the selected area code, `name` represents the selected area name.

```javascript
[
  {
    code: '110000',
    name: 'Beijing',
  },
  {
    code: '110100',
    name: 'Beijing',
  },
  {
    code: '110101',
    name: 'Dongcheng District',
  },
];
```

`index` is an array containing `columnsNum` pieces of data. Each piece of data corresponds to the index of the selected item in each column of options.