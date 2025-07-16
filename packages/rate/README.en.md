---
category: Data Entry
---

# Rate

### Introduction

Used for rating items.

### Import

Introduce the component in `app.json` or `index.json`, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp) for details.

```json
"usingComponents": {
  "smart-rate": "@tuya-miniapp/smart-ui/lib/rate/index"
}
```

## Code Examples

### Basic Usage

```html
<smart-rate value="{{ value }}" bind:change="onChange" />
```

```javascript
Page({
  data: {
    value: 3,
  },

  onChange(event) {
    this.setData({
      value: event.detail,
    });
  },
});
```

### Custom Icon

```html
<smart-rate
  value="{{ value }}"
  icon="like"
  void-icon="like-o"
  bind:change="onChange"
/>
```

### Custom Style

```html
<smart-rate
  value="{{ value }}"
  size="{{ 25 }}"
  color="#ffd21e"
  void-icon="star"
  void-color="#eee"
  bind:change="onChange"
/>
```

### Half Star

```html
<smart-rate
  value="{{ value }}"
  allow-half
  void-icon="star"
  void-color="#eee"
  bind:change="onChange"
/>
```

```javascript
Page({
  data: {
    value: 2.5,
  },

  onChange(event) {
    this.setData({
      value: event.detail,
    });
  },
});
```

### Custom Count

```html
<smart-rate value="{{ value }}" count="{{ 6 }}" bind:change="onChange" />
```

### Disabled State

```html
<smart-rate disabled value="{{ value }}" bind:change="onChange" />
```

### Read-Only State

```html
<smart-rate readonly value="{{ value }}" bind:change="onChange" />
```

### Listen to Change Event

A `change` event is triggered when the rating changes.

```html
<smart-rate value="{{ value }}" bind:change="onChange" />
```

```javascript
Page({
  data: {
    value: 2,
  },

  onChange(event) {
    Toast('Current value: ' + event.detail);
  },
});
```

## API

### Props

| Parameter      | Description                                               | Type               | Default              |
| -------------- | ---------------------------------------------------------- | ------------------ | --------------------- |
| allow-half     | Whether to allow half selection                            | _boolean_          | `false`               |
| color          | Color when selected                                        | _string_           | `#ffd21e`             |
| count          | Total number of icons                                      | _number_           | `5`                   |
| disabled       | Whether to disable rating                                  | _boolean_          | `false`               |
| disabled-color | Color when disabled                                        | _string_           | `#bdbdbd`             |
| gutter         | Icon spacing, default unit is `px`                         | _string \| number_ | `4px`                 |
| icon           | Icon svg value or image link when selected, see [Icon Component](/material/smartui?comId=icon&appType=miniapp) for options | _string_           | `CheckmarkCircle`     |
| name           | Identifier for form submission                             | _string_           | -                     |
| readonly       | Whether it is in read-only state                           | _boolean_          | `false`               |
| size           | Icon size, default unit is `px`                            | _string \| number_ | `20px`                |
| touchable      | Whether selection can be made via swipe gesture            | _boolean_          | `true`                |
| value          | Current rating value                                       | _number_           | -                     |
| void-color     | Color when not selected                                    | _string_           | `#c7c7c7`             |
| void-icon      | Icon svg value or image link when not selected, see [Icon Component](/material/smartui?comId=icon&appType=miniapp) for options | _string_           | `CheckmarkCircleVoid` |

### Events

| Event Name   | Description                | Callback Parameters  |
| ------------ | -------------------------- | --------------------- |
| bind:change  | Event triggered when the rating value changes | event.detail: Current rating value |

### External Style Classes

| Class Name    | Description       |
| ------------- | ----------------- |
| custom-class  | Root node style class |
| icon-class    | Icon style class  |
### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                           | Description              |
| ----------------------------- | ---------------------------------------- | ------------------------ |
| --rate-horizontal-padding     | _2px_                                    | Rating icon horizontal padding |
| --rate-icon-size              | _20px_                                   | Rating icon size         |
| --rate-icon-void-color        | _#c8c9cc_                                | Void state icon color    |
| --rate-icon-full-color        | _#ee0a24_                                | Full state icon color    |
| --rate-icon-disabled-color    | _#c8c9cc_                                | Disabled state icon color|
| --rate-icon-gutter            | _4px_                                    | Icon spacing             |

