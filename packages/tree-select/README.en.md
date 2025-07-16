---
category: Data Entry
---

# TreeSelect

### Introduction

Used for selection from a set of associated data collections.

### Usage

Introduce the component in `app.json` or `index.json`, for details see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-tree-select": "@tuya-miniapp/smart-ui/lib/tree-select/index"
}
```

## Code Examples

### Single Selection Mode

You can use the `smart-tree-select` tag in any location. Pass in the corresponding data. This component supports single or multiple selections, and the specific behavior is entirely based on how the implementation logic of the click-item event assigns values to the active-id property. When active-id is an array, it will be in multi-select status.

```html
<smart-tree-select
  items="{{ items }}"
  main-active-index="{{ mainActiveIndex }}"
  active-id="{{ activeId }}"
  bind:click-nav="onClickNav"
  bind:click-item="onClickItem"
/>
```

```javascript
Page({
  data: {
    mainActiveIndex: 0,
    activeId: null,
  },

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({ activeId });
  },
});
```

### Multi-Selection Mode

```html
<smart-tree-select
  items="{{ items }}"
  main-active-index="{{ mainActiveIndex }}"
  active-id="{{ activeId }}"
  max="{{ max }}"
  bind:click-nav="onClickNav"
  bind:click-item="onClickItem"
/>
```

```javascript
Page({
  data: {
    mainActiveIndex: 0,
    activeId: [],
    max: 2,
  },

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem({ detail = {} }) {
    const { activeId } = this.data;

    const index = activeId.indexOf(detail.id);
    if (index > -1) {
      activeId.splice(index, 1);
    } else {
      activeId.push(detail.id);
    }

    this.setData({ activeId });
  },
});
```

### Custom Content

```html
<smart-tree-select
  items="{{ items }}"
  height="55vw"
  main-active-index="{{ mainActiveIndex }}"
  active-id="{{ activeId }}"
  bind:click-nav="onClickNav"
  bind:click-item="onClickItem"
>
  <image src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" slot="content" />
</smart-tree-select>
```

## API

### Props

| Parameter        | Description                                  | Type                        | Default     |
| ---------------- | -------------------------------------------- | --------------------------- | ----------- |
| active-id        | ID of the selected item on the right, supports array | _string \| number \| Array_ | `0`         |
| height           | Height, default unit is `px`                 | _number \| string_          | `300`       |
| items            | Data required for category display           | _Array_                     | `[]`        |
| main-active-index| Index of the selected item on the left       | _number_                    | `0`         |
| max              | Max number of selected items on the right    | _number_                    | _Infinity_  |
| selected-icon    | Custom icon for the selected state on the right | _string_                    | `Checkmark` |

### Events

| Event Name       | Description                                        | Callback Parameter                     |
| ---------------  | -------------------------------------------------- | -------------------------------------- |
| bind:click-item  | Event triggered when the right selection item is clicked | event.detail: Data of the clicked item |
| bind:click-nav   | Event triggered when the left navigation is clicked | event.detail.index：Index of the clicked navigation |

### Slots

| Name      | Description                                          |
| -------   | ---------------------------------------------------- |
| content   | Custom content for the right area, if there are items, it will be inserted at the top |

### items Data Structure

`items` are overall an array, containing a series of objects describing the categories. In each category, text indicates the name of the current category. options represent the selectable items within the category, with an array structure, and id is used to uniquely identify each option.

```javascript
[
  {
    // Navigation Name
    text: 'All Cities',
    // Badge at the top right of the navigation name
    badge: 3,
    // Display a small red dot at the top right of the navigation name
    dot: true,
    // Disable option
    disabled: false,
    // All selectable items under this navigation
    options: [
      {
        // Name
        text: 'Wenzhou',
        // id, used as an identifier for matching the selected state
        id: 1,
        // Disable option
        disabled: true,
      },
      {
        text: 'Hangzhou',
        id: 2,
      },
    ],
  },
];
```

### External Style Classes

| Class Name               | Description           |
| ------------------------ | --------------------- |
| content-active-class     | Selected style class for right items |
| content-disabled-class   | Disabled style class for right items |
| content-item-class       | Style class for right items |
| main-active-class        | Selected style class for left items |
| main-disabled-class      | Disabled style class for left items |
| main-item-class          | Style class for left items |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                           | Description              |
| ----------------------------- | ---------------------------------------- | ------------------------ |
| --tree-select-font-color      | _var(--app-B6-N1, rgba(0, 0, 0, 1))_    | Tree select font color   |
| --tree-select-font-size       | _14px_                                   | Tree select font size    |
| --tree-select-nav-background-color | _var(--app-B3, #ffffff)_             | Tree select navigation background color |
| --tree-select-content-background-color | _var(--app-B3, #ffffff)_         | Tree select content background color    |
| --tree-select-nav-item-padding | _@padding-sm @padding-xs @padding-sm @padding-sm_ | Tree select navigation item padding    |
| --tree-select-item-height     | _44px_                                   | Tree select item height  |
| --tree-select-item-active-color | _#ee0a24_                              | Active item color        |
| --tree-select-item-disabled-color | _var(--app-B6-N4, rgba(0, 0, 0, 0.4))_ | Disabled item color     |