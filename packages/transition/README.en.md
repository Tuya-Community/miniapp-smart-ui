---
category: Display
---

# Transition

### Introduction

An effect that gradually changes an element from one style to another.

### Integration

Introduce the component in `app.json` or `index.json`, for more details see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-transition": "@tuya-miniapp/smart-ui/lib/transition/index"
}
```

## Code Examples

### Basic Usage

Wrap the element in the transition component, and there will be a corresponding transition animation when the element is shown/hidden.

```html
<smart-transition show="{{ show }}" custom-class="block">Content</smart-transition>
```

### Animation Types

The transition component has built-in animations. You can specify the animation type via the `name` field.

```html
<smart-transition name="fade-up" />
```

### Advanced Usage

You can customize the transition effect with external style classes, and also customize the duration of entering and leaving.

```html
<smart-transition
  show="{{ show }}"
  name=""
  duration="{{ { enter: 300, leave: 1000 } }}"
  enter-class="smart-enter-class"
  enter-active-class="smart-enter-active-class"
  leave-active-class="smart-leave-active-class"
  leave-to-class="smart-leave-to-class"
/>
```

```css
.smart-enter-active-class,
.smart-leave-active-class {
  transition-property: background-color, transform;
}

.smart-enter-class,
.smart-leave-to-class {
  background-color: red;
  transform: rotate(-360deg) translate3d(-100%, -100%, 0);
}
```

## API

### Props

| Parameter    | Description            | Type               | Default |
| ------------ | ---------------------- | ------------------ | ------- |
| custom-style | Custom style           | _string_           | -       |
| duration     | Animation duration in ms | _number \| object_ | `300`   |
| name         | Animation type         | _string_           | `fade`  |
| show         | Whether to show component | _boolean_         | `true`  |

### Events

| Event Name        | Description    | Parameters |
| ----------------- | -------------- | ---------- |
| bind:after-enter  | Triggered after entering | -  |
| bind:after-leave  | Triggered after leaving  | -  |
| bind:before-enter | Triggered before entering | -  |
| bind:before-leave | Triggered before leaving | -  |
| bind:enter        | Triggered during entering | -  |
| bind:leave        | Triggered during leaving | -  |

### External Style Classes

| Class Name         | Description                                                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| custom-class       | Root node style class                                                                                                                                           |
| enter-active-class | Defines the state when the enter transition is active. Applied throughout the entering transition phase, effective before the element is inserted, removed after the transition/animation ends. Can be used to define the transition time, delay, and curve function. |
| enter-class        | Defines the initial state of the enter transition. Effective before the element is inserted, removed the next frame after the element is inserted.               |
| enter-to-class     | Defines the end state of the enter transition. Effective the next frame after the element is inserted (enter-class removed simultaneously), removed after the transition/animation ends. |
| leave-active-class | Defines the state when the leave transition is active. Applied throughout the leaving transition phase, effective immediately when the leave transition is triggered, removed after the transition/animation ends. Can be used to define the transition time, delay, and curve function. |
| leave-class        | Defines the initial state of the leave transition. Effective immediately when the leave transition is triggered, removed the next frame.                         |
| leave-to-class     | Defines the end state of the leave transition. Effective the next frame after the leave transition is triggered (leave-class removed simultaneously), removed after the transition/animation ends. |

### Animation Types

| Name        | Description   |
| ----------- | ------------- |
| fade        | Fade in       |
| fade-down   | Fade in from bottom |
| fade-left   | Fade in from left   |
| fade-right  | Fade in from right  |
| fade-up     | Fade in from top    |
| slide-down  | Slide in from bottom |
| slide-left  | Slide in from left   |
| slide-right | Slide in from right  |
| slide-up    | Slide in from top    |