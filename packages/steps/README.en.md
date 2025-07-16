# Steps

### Introduction

Used to display the various stages of an operational process, allowing users to understand their current position within the overall process.

### Import

Introduce the component in `app.json` or `index.json`. For detailed instructions, see [Quickstart](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-steps": "@tuya-miniapp/smart-ui/lib/steps/index"
}
```

## Code Demonstration

### Basic Usage

```html
<smart-steps steps="{{ steps }}" active="{{ active }}" />
```

```javascript
Page({
  data: {
    steps: [
      {
        text: 'Step One',
        desc: 'Description',
      },
      {
        text: 'Step Two',
        desc: 'Description',
      },
      {
        text: 'Step Three',
        desc: 'Description',
      },
      {
        text: 'Step Four',
        desc: 'Description',
      },
    ],
  },
});
```

### Custom Styles

The `active-icon` and `active-color` attributes can be used to set the icon and color in the active state.

```html
<smart-steps
  steps="{{ steps }}"
  active="{{ active }}"
  active-icon="success"
  active-color="#38f"
/>
```

### Custom Icons

The `inactiveIcon` and `activeIcon` attributes can be used to set icons for each step.

```html
<smart-steps steps="{{ steps }}" active="{{ active }}" />
```

```javascript
Page({
  data: {
    steps: [
      {
        text: 'Step One',
        desc: 'Description',
        inactiveIcon: 'location-o',
        activeIcon: 'success',
      },
      {
        text: 'Step Two',
        desc: 'Description',
        inactiveIcon: 'like-o',
        activeIcon: 'plus',
      },
      {
        text: 'Step Three',
        desc: 'Description',
        inactiveIcon: 'star-o',
        activeIcon: 'cross',
      },
      {
        text: 'Step Four',
        desc: 'Description',
        inactiveIcon: 'phone-o',
        activeIcon: 'fail',
      },
    ],
  },
});
```

### Vertical Steps

The display direction of the steps can be changed by setting the `direction` attribute.

```html
<smart-steps
  steps="{{ steps }}"
  active="{{ active }}"
  direction="vertical"
  active-color="#ee0a24"
/>
```

## API

### Steps Props

| Parameter      | Description                                        | Type                | Default       |
| -------------- | -------------------------------------------------- | ------------------- | ------------- |
| active         | Current step                                       | _number_            | 0             |
| active-color   | Active state color                                 | _string_            | `#07c160`     |
| active-icon    | Icon at the bottom in the active state             | _string_            | `checked`     |
| direction      | Display direction; options are `horizontal` `vertical` | _string_            | `horizontal`  |
| inactive-color | Color in the inactive state                        | _string_            | `#969799`     |
| inactive-icon  | Icon at the bottom in the inactive state           | _string_            | -             |
| steps          | Collection of step configurations                  | _Array of Step Configs_ | `[]`          |

### Events

| Event Name     | Description                | Callback Parameters         |
| -------------- | -------------------------- | --------------------------- |
| bind:click-step| Event triggered when a step is clicked | event.detail: Index of the current step |

### External Style Classes

| Class Name     | Description               |
| -------------- | ------------------------- |
| custom-class   | Root node style class     |
| desc-class     | Style class for description info |

### Step Config

| Key           | Description                                         | Type     |
| ------------- | --------------------------------------------------- | -------- |
| activeIcon    | Icon at the bottom in the active state              | _string_ |
| desc          | Description info for the current step               | _string_ |
| inactiveIcon  | Icon at the bottom in the inactive state            | _string_ |
| text          | Name of the current step                            | _string_ |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                             | Description |
| ----------------------------- | ----------------------------------------- | ----------- |
| --steps-background-color | _var(--app-B3, #ffffff)_ | - |
