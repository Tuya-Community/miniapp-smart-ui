---
category: Display
---

# Divider

### Introduction

Used to divide content into multiple sections.

### Import

Introduce the component in `app.json` or `index.json`. The default is the `ES6` version. For `ES5` usage, refer to [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-divider": "@tuya-miniapp/smart-ui/lib/divider/index"
}
```

## Code Demonstration

### Basic Usage

```html
<smart-divider />
```

### Using hairline

```html
<smart-divider hairline />
```

### Dashed Line

```html
<smart-divider dashed />
```

### Text Position

```html
<smart-divider contentPosition="center">Text</smart-divider>
<smart-divider contentPosition="left">Text</smart-divider>
<smart-divider contentPosition="right">Text</smart-divider>
```

### Custom Attributes

```html
<smart-divider contentPosition="center" textColor="#1989fa">Text Color</smart-divider>
<smart-divider contentPosition="center" borderColor="#1989fa">
  border Color
</smart-divider>
<smart-divider contentPosition="center" fontSize="18">Font Size</smart-divider>
```

### Custom Styles

```html
<smart-divider
  contentPosition="center"
  customStyle="color: #1989fa; border-color: #1989fa; font-size: 18px;"
>
  Text
</smart-divider>
```

## API

### Props

| Parameter        | Description                               | Type      | Default |
| ---------------- | ----------------------------------------- | --------- | ------- |
| content-position | Text position, `left` `center` `right`    | _string_  | -       |
| custom-style     | Custom styles                             | _string_  | -       |
| dashed           | Dashed line                               | _boolean_ | false   |
| hairline         | Hairline                                  | _boolean_ | false   |

### Slot

| Name  | Description         |
| ----- | ------------------- |
| Default | Custom text content |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                           | Description           |
| ----------------------------- | ---------------------------------------- | --------------------- |
| --divider-margin              | _@padding-md 0_                          | Top and bottom margin |
| --divider-text-color          | _#969799_                                | Text color            |
| --divider-font-size           | _14px_                                   | Font size             |
| --divider-line-height         | _24px_                                   | Line height           |
| --divider-border-color        | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_   | Border color          |
| --divider-content-padding     | _16px_                                   | Content padding       |
| --divider-content-left-width  | _10%_                                    | Left content width    |
| --divider-content-right-width | _10%_                                    | Right content width   |
