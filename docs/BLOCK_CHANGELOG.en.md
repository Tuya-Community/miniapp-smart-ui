# Upgrade Notes

## v2.10.0 (2026-1-13)

### Features ✨
- battery: Aligned with new UED design, refactored style layout, default size changed to 24([pull/134](https://github.com/Tuya-Community/miniapp-smart-ui/pull/134), [pull/147](https://github.com/Tuya-Community/miniapp-smart-ui/pull/147))

## v2.9.0 (2025-12-23)

### Bug Fixes 🐛

- nav-bar: Aligned with Tuya UI standard, sideWidth default changed from mid to max([64281c8](https://github.com/Tuya-Community/miniapp-smart-ui/pull/125/commits/64281c830cde83b908320085014f394058b257c1))
- calendar: Aligned with Tuya UI standard, removed --calendar-day-disabled-color, use opacity for disabled style, fixed dark mode disabled style([pull/126](https://github.com/Tuya-Community/miniapp-smart-ui/pull/126))
- nativeDisabled: Android property not working, fixed in v2.9.2

## v2.8.0 (2025-12-09)

### Bug Fixes 🐛

- notice-bar: Aligned with UI standard, changed --notice-bar-text-color CSS variable default to rgba(0, 0, 0, 0.5), no longer depends on --app-B6-N5 ([43922ab](https://github.com/Tuya-Community/miniapp-smart-ui/commit/43922abceaedf1af448147e189517598151dd0a9))
- switch: Aligned with UI standard, changed --switch-label-active-color and --switch-label-inactive-color CSS variable defaults to #FFFFFF, no longer depends on --app-B3 ([43922ab](https://github.com/Tuya-Community/miniapp-smart-ui/commit/43922abceaedf1af448147e189517598151dd0a9))

## v2.7.3 (2025-11-20)

### Features ✨

- nav-bar: Aligned with new UI standard, adjusted --nav-bar-side-width, --nav-bar-text-font-size, --nav-bar-text-font-weight CSS variable defaults([pull/96](https://github.com/Tuya-Community/miniapp-smart-ui/pull/96))

## v2.7.2 (2025-11-13)

### Bug Fixes 🐛

- picker: Fixed onChange event return format for single column to match pre-2.7.0 behavior([9800e64](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/9800e649576136eb102cc61c5192e6a6ffd57ea3))

## v2.7.1(2025-10-28)

### Bug Fixes 🐛
- popup: Aligned with UI standard, component default safe-area-inset-bottom set to false([c3c79f2](https://github.com/Tuya-Community/miniapp-smart-ui/pull/61/commits/c3c79f2f0efef6595649b426fb5221cb6df83da9)); fixed --popup-background-color not supporting gradient, use background CSS property instead of background-color([37a938a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/68/commits/37a938a0780fe64d24a4e8c20810b1e1434e4ee6))

## v2.7.0(2025-10-21)

### Features ✨

- picker: Aligned with UI standard, refactored picker implementation with 3D visual effect([pull/48](https://github.com/Tuya-Community/miniapp-smart-ui/pull/48))
- nav-bar: Aligned with UI design, style updates, added and updated --nav-bar-side-width, --nav-bar-text-padding, --nav-bar-icon-padding, --nav-bar-title-margin, --nav-bar-home-max-width, --nav-bar-left-title-padding, --nav-bar-title-max-width CSS variables; removed --nav-bar-icon-size, --nav-bar-icon-margin CSS variables; border property default set to false([pull/38](https://github.com/Tuya-Community/miniapp-smart-ui/pull/38))

### Bug Fixes 🐛

- image: Changed show-loading default to false([6090b97](https://github.com/Tuya-Community/miniapp-smart-ui/pull/50/commits/6090b97baea6f1c75bf7be184a5ae8fcc33afa9b))
- popup: Aligned with UI standard, default bottom safe area disabled([3da77ee](https://github.com/Tuya-Community/miniapp-smart-ui/pull/54/commits/3da77eecbc51b014fd06b4871d054ddda9d2a1c7))
- calendar: Aligned with UI standard, default bottom safe area disabled([4c91851](https://github.com/Tuya-Community/miniapp-smart-ui/pull/54/commits/4c91851fe674bcb64a19c830a3f1539da8700dd1))
- icon: Aligned with UI standard, updated right, left, down, up icons([e1bd07e](https://github.com/Tuya-Community/miniapp-smart-ui/commit/e1bd07ebb2bd411fe82e714b11e603ed68271c9a))

## v2.6.0(2025-07-31)

### Features ✨
- datetime-picker: Aligned with UI standard, component divider changed to gradient, new CSS variable --hairline-border-image-color([6381e6f](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/6381e6ffdf61ae21a1ff3943c69a543ecbc1e03c))
- toast: Style updates, added --toast-min-width CSS variable, deprecated --toast-text-min-width CSS variable([13a4f93](https://github.com/Tuya-Community/miniapp-smart-ui/pull/9/commits/13a4f93e4bf9f2fb3dfb17e64f85d82430d22706), [f99c3a3](https://github.com/Tuya-Community/miniapp-smart-ui/pull/9/commits/f99c3a30b5d78f655513756ce494b1ec6e259a1f))

### Bug Fixes 🐛
- overlay: Aligned with UI standard background style, now depends on --app-overlay CSS variable([319761a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/319761a88793c178d3f6c0089adb4a6079df29ec))
- dialog: Aligned with UI design, dialog background color --dialog-background-color CSS variable dependency changed from --app-B4 to --smart-ui-dialog-background([eae43fb](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/eae43fb54a23fa669636e166b149cd9f393fb8ef))
- picker: Changed animationTime default to 300([302919a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/302919ab414ac70cc2174541c97127bc8e2f5bdc), [f7a4f28](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/f7a4f28b60d31afc7b699100f7cc1e992f621319), [afe87f2](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/afe87f262a69d6733c8ee7eb38cf129220ae333f)); changed unit positioning, fixed spacing squeezed by outer container, --picker-option-unit-mid-size default set to 4px ([1619172](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/16191721222fe7658d87b0eaf0d8c28d5ecc29a6), [d82a6cf](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/d82a6cff525d26f9094046be27874a0a80f883de))

## v2.5.1(2025-07-17)
### Features ✨
- nav-bar: Added separate right text color style, new --nav-bar-right-text-color CSS variable

## v2.5.0(2025-06-26)
### Features ✨
- switch: Updated component internal style layout

## v2.4.0(2025-06-10)

### Features ✨
- picker: Added --picker-option-unit-mid-size CSS variable, unit spacing controlled via flex gap
- switch: Added separate background color when on, new --switch-node-on-background-color CSS variable

## v2.3.0(2025-02-28)

### Features ✨
- circle: Refactored component using canvas

### Bug Fixes 🐛
- dialog: Fixed component not opening, added global unique Id validation
- toast: Fixed component not opening, added global unique Id validation

## v2.2.0 (2025-2-13)

### Bug Fixes 🐛
- stepper: Fixed internal icon display, built-in Icon

## v2.1.7 (2024-12-27)

### Features ✨
- index-bar: Added scrollable property, default disables Sidebar scroll from triggering index change

## v2.1.6 (2024-12-19)

### Bug Fixes 🐛
- toast: Fixed default width and screen centering

## v2.1.0（2024-11-21）

### Features
- tab: Refactored styles
- field: Refactored styles

## v2.0.0（2024-11-12）

### Features ✨
- field: UI aligned with design & refactor
- tab: UI aligned with design & refactor
- search: UI aligned with design & refactor
- top-nar: UI aligned with design & refactor
- switch: UI aligned with design & refactor
- toast: UI aligned with design & refactor
- dropdown-menu: UI aligned with design & refactor
- button: UI aligned with design & refactor
- action-sheet: UI aligned with design & refactor
- checkbox: UI aligned with design & refactor
- radio: UI aligned with design & refactor
- empty: UI aligned with design & refactor
- picker: Feature improvements & refactor
- tabbar: Feature improvements & refactor
