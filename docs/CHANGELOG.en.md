# Changelog

## v2.11.0 (2026-2-5)

### Features ✨

- index-bar: Add sidebar style customization; add sidebarFontSize and sidebarLineHeight props ([pull/150](https://github.com/Tuya-Community/miniapp-smart-ui/pull/150))

### Bug Fixes 🐛

- index-bar: Fix flicker when touch-scrolling the right sidebar ([90e290b](https://github.com/Tuya-Community/miniapp-smart-ui/pull/149/commits/90e290b1c807579b83bfdc2e1b460dc39c72bb1d))
- popup: Reduce default render node count ([fb6ab2f](https://github.com/Tuya-Community/miniapp-smart-ui/pull/151/commits/fb6ab2fddbe30694deb350bfdde60d7c5f35f48c))
- action-sheet: Reduce default render node count ([fb6ab2f](https://github.com/Tuya-Community/miniapp-smart-ui/pull/151/commits/fb6ab2fddbe30694deb350bfdde60d7c5f35f48c))
- bottom-sheet: Reduce default render node count ([fb6ab2f](https://github.com/Tuya-Community/miniapp-smart-ui/pull/151/commits/fb6ab2fddbe30694deb350bfdde60d7c5f35f48c))
- tab: Fix important CSS usage; fix dot and info display ([5de790d](https://github.com/Tuya-Community/miniapp-smart-ui/pull/158/commits/5de790da25e9a3867a0ddc10ce273b4b9fc4e5ef)); fix redundant positioning animation when initial active is not the first ([6649819](https://github.com/Tuya-Community/miniapp-smart-ui/pull/159/commits/66498199ecd0873de387fe8e826b9ffacf02ffb8))

## v2.10.0 (2026-1-13)

### Features ✨

- dialog: Add onInput callback; fix input mode when value is undefined ([pull/143](https://github.com/Tuya-Community/miniapp-smart-ui/pull/143))
- picker: Add unitGap prop for spacing between unit and column ([pull/144](https://github.com/Tuya-Community/miniapp-smart-ui/pull/144))
- battery: Align with new UED design, refactor layout, default size set to 24 ([pull/134](https://github.com/Tuya-Community/miniapp-smart-ui/pull/134), [pull/147](https://github.com/Tuya-Community/miniapp-smart-ui/pull/147))

### Bug Fixes 🐛

- dialog: Fix emptyDisabled default to false and submit button disable logic ([5c88532](https://github.com/Tuya-Community/miniapp-smart-ui/pull/146/commits/5c885324f3f9e3c691f4d840e8fc4120a2088301))

## v2.9.2 (2025-12-31)

### Bug Fixes 🐛

- Fix nativeDisabled not working on Android ([66adfce](https://github.com/Tuya-Community/miniapp-smart-ui/commit/66adfceebeb9d235c0299e4b5718dec6488e73e7))

## v2.9.1 (2025-12-30)

### Features ✨

- calendar: Add first-day-of-select-week prop for different week start by region ([pull/136](https://github.com/Tuya-Community/miniapp-smart-ui/pull/136))

### Bug Fixes 🐛

- calendar: Fix date jump when selecting in some regions ([pull/63](https://github.com/Tuya-Community/ray-smart-ui/pull/63))

## v2.9.0 (2025-12-23)

### Features ✨

- bottom-sheet: Add lock-scroll to disable overlay scroll ([7eeec64](https://github.com/Tuya-Community/miniapp-smart-ui/pull/131/commits/7eeec64c305d0edfd413a3c34db4e3583a03b19c)); add lock-max-drag to disable max drag ([pull/128](https://github.com/Tuya-Community/miniapp-smart-ui/pull/128), [pull/129](https://github.com/Tuya-Community/miniapp-smart-ui/pull/129))
- search: iOS haptic feedback ([pull/112](https://github.com/Tuya-Community/miniapp-smart-ui/pull/112))
- field: iOS haptic feedback ([pull/112](https://github.com/Tuya-Community/miniapp-smart-ui/pull/112))
- tab: iOS haptic feedback ([pull/112](https://github.com/Tuya-Community/miniapp-smart-ui/pull/112))
- tabbar: iOS haptic feedback ([pull/112](https://github.com/Tuya-Community/miniapp-smart-ui/pull/112))
- stepper: iOS haptic feedback ([pull/112](https://github.com/Tuya-Community/miniapp-smart-ui/pull/112))
- switch: iOS haptic feedback ([pull/112](https://github.com/Tuya-Community/miniapp-smart-ui/pull/112))
- toast: iOS haptic feedback ([pull/112](https://github.com/Tuya-Community/miniapp-smart-ui/pull/112))
- slider: iOS haptic feedback ([7fb416f](https://github.com/Tuya-Community/miniapp-smart-ui/pull/124/commits/7fb416fd10fc267920509b45e27ad9c10841f003))
- index-bar: iOS haptic feedback ([pull/110](https://github.com/Tuya-Community/miniapp-smart-ui/pull/110))
- calendar: iOS haptic feedback ([pull/109](https://github.com/Tuya-Community/miniapp-smart-ui/pull/109))
- custom-keyboard: iOS haptic feedback ([pull/111](https://github.com/Tuya-Community/miniapp-smart-ui/pull/111))

### Bug Fixes 🐛

- dialog: Fix unable to open again after page destroy when component not closed ([b4f7472](https://github.com/Tuya-Community/miniapp-smart-ui/pull/131/commits/b4f74729ff5964597be13aa0b3e1f70a59d91b48))
- config-provider: Reduce theme file size ([3d55091](https://github.com/Tuya-Community/miniapp-smart-ui/pull/131/commits/3d5509187dd3830449127b68718bdd95243c13cd))
- circle: Remove redundant styles that caused ring gap ([c4ae523](https://github.com/Tuya-Community/miniapp-smart-ui/pull/114/commits/c4ae5231522e85d09301bc24801066c6857b60b7))
- picker: Fix loop mode where some columns could not be dragged to select ([bed9b37](https://github.com/Tuya-Community/miniapp-smart-ui/pull/113/commits/bed9b37f9fc5a885c031de24c6c5c6f526d72fd9))
- nav-bar: Align with Tuya UI; side-width default changed from mid to max ([64281c8](https://github.com/Tuya-Community/miniapp-smart-ui/pull/125/commits/64281c830cde83b908320085014f394058b257c1))
- calendar: Align with Tuya UI; remove --calendar-day-disabled-color, use opacity for disabled; fix dark mode disabled style ([pull/126](https://github.com/Tuya-Community/miniapp-smart-ui/pull/126))
- slider: Fix parcel type button border spacing; fix min/max in onChange; fix initial state when button hidden ([7fb416f](https://github.com/Tuya-Community/miniapp-smart-ui/pull/124/commits/7fb416fd10fc267920509b45e27ad9c10841f003))

## v2.8.0 (2025-12-09)

### Features ✨

- config-provider: Add theme prop for one-click theme switch ([pull/100](https://github.com/Tuya-Community/miniapp-smart-ui/pull/100))
- toast: Add textColor, iconColor props ([pull/105](https://github.com/Tuya-Community/miniapp-smart-ui/pull/105))
- loading: Add iconColor prop ([pull/104](https://github.com/Tuya-Community/miniapp-smart-ui/pull/104))
- circle: Add `angle-offset` for semi-circle start angle; change `mask-color` default from `#ffffff` to `transparent` ([pull/106](https://github.com/Tuya-Community/miniapp-smart-ui/pull/106))
- cascader: Add --cascader-active-background-color CSS variable ([43922ab](https://github.com/Tuya-Community/miniapp-smart-ui/commit/43922abceaedf1af448147e189517598151dd0a9))
- popover: Add --popover-overlay-color CSS variable ([43922ab](https://github.com/Tuya-Community/miniapp-smart-ui/commit/43922abceaedf1af448147e189517598151dd0a9))

### Bug Fixes 🐛

- loading: Fix color prop effect ([pull/104](https://github.com/Tuya-Community/miniapp-smart-ui/pull/104))
- picker: Fix loop mode columns not draggable to select ([pull/113](https://github.com/Tuya-Community/miniapp-smart-ui/pull/113))
- datetime-picker: Fix January not draggable in some cases ([pull/113](https://github.com/Tuya-Community/miniapp-smart-ui/pull/113))
- circle: Fix ring partly hidden when outer container is squeezed ([pull/115](https://github.com/Tuya-Community/miniapp-smart-ui/pull/115))
- notice-bar: Set --notice-bar-text-color default to rgba(0, 0, 0, 0.5), no longer depend on --app-B6-N5 ([43922ab](https://github.com/Tuya-Community/miniapp-smart-ui/commit/43922abceaedf1af448147e189517598151dd0a9))
- switch: Set --switch-label-active-color, --switch-label-inactive-color default to #FFFFFF, no longer depend on --app-B3 ([43922ab](https://github.com/Tuya-Community/miniapp-smart-ui/commit/43922abceaedf1af448147e189517598151dd0a9))

## v2.7.3 (2025-11-20)

### Features ✨

- nav-bar: Align with new UI; add side-width prop; add --nav-bar-side-width-min, --nav-bar-side-width-max; adjust --nav-bar-side-width, --nav-bar-text-font-size, --nav-bar-text-font-weight defaults ([pull/96](https://github.com/Tuya-Community/miniapp-smart-ui/pull/96))

### Bug Fixes 🐛

- stepper: Fix decimal input not updating in real time ([e9cf7a9](https://github.com/Tuya-Community/miniapp-smart-ui/pull/97/commits/e9cf7a9edb6ea2fc93e3a38be54bdb03fd4e0294))

## v2.7.2 (2025-11-13)

### Features ✨

- stepper: Add `manrope` number font, supported from App 7.0.5 ([a9ac2ab](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/a9ac2ab42943c837cda5dba3ddff02d56b00f025))
- count-down: Add `manrope` number font, supported from App 7.0.5 ([a9ac2ab](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/a9ac2ab42943c837cda5dba3ddff02d56b00f025))
- picker: Add `manrope` number font, supported from App 7.0.5 ([a9ac2ab](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/a9ac2ab42943c837cda5dba3ddff02d56b00f025))
- datetime-picker: Add `manrope` number font, supported from App 7.0.5 ([a9ac2ab](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/a9ac2ab42943c837cda5dba3ddff02d56b00f025))
- calendar: Add `manrope` number font, supported from App 7.0.5 ([pull/79](https://github.com/Tuya-Community/miniapp-smart-ui/pull/79))
- custom-keyboard: Add `manrope` number font, supported from App 7.0.5 ([e8f763d](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/e8f763d526f635d702a87586535f8b4a854100b1))
- bottom-sheet: Add drag support; draggable, min-drag-height, max-drag-height, mid-drag-height, close-drag-height props; drag-position event ([pull/78](https://github.com/Tuya-Community/miniapp-smart-ui/pull/78))
- nav-bar: Set --nav-bar-text-padding default to 16px ([352954e](https://github.com/Tuya-Community/miniapp-smart-ui/commit/352954e16f05b0660369bfc860b7f895dc5f1774))
- icon: Add mute icon and more icons ([1ba2ebf](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/1ba2ebfc12e6af675940c01f2e229eed05cec4ff))

### Bug Fixes 🐛

- icon: HarmonyOS icon display compatibility ([bc7310a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/bc7310a99c1bfa4dc5e90a7dad5fb338b0aff465))
- circle: Fix initial width 100% under flex layout ([8083de9](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/8083de941d12b9e3158c170841079e76cbf3ecf3))
- stepper: Fix wrap, decimal input, step formatting excluding min; add string handling ([4054898](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/405489889906c8424b76daceaf392c59cd24bf01))
- loading: HarmonyOS compatibility ([894d59d](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/894d59d53f4ba1f5061febdcc61944da0d8e3f1a))
- picker: Fix single-column onChange return format ([9800e64](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/9800e649576136eb102cc61c5192e6a6ffd57ea3))
- slider: Fix drag when min is not 0 ([f85fae8](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/f85fae880c278ca89126e0555eca15497b7abf66))

## v2.7.1 (2025-10-28)

### Bug Fixes 🐛

- field: Fix inputDetail callback not updating input value when extra-event-params is enabled ([7fcb0c1](https://github.com/Tuya-Community/miniapp-smart-ui/pull/71/commits/7fcb0c18038f27aa2006e5a9102652eb817046ac))
- tabbar: Fix border prop not taking effect ([a8d90a5](https://github.com/Tuya-Community/miniapp-smart-ui/pull/59/commits/a8d90a56832a8254ccfb3763352489a300a3abbb))
- tab: Fix slider animation and text color animation out of sync on switch ([4becc32](https://github.com/Tuya-Community/miniapp-smart-ui/pull/60/commits/4becc32e4ecb2032b794301229097fce45e95205))
- dialog: Adjust round-button style; fix cancel button style; update --dialog--round-button-border-radius ([pull/69](https://github.com/Tuya-Community/miniapp-smart-ui/pull/69))
- picker: Fix loop mode scroll error when list changes; fix active state real-time update ([pull/65](https://github.com/Tuya-Community/miniapp-smart-ui/pull/65))
- circle: Fix extra horizontal spacing ([fbae95e](https://github.com/Tuya-Community/miniapp-smart-ui/pull/70/commits/fbae95ebbc80836cbacd9a0da7a84ec909498cab))
- nav-bar: Fix click-right event not firing ([d0e1f9f](https://github.com/Tuya-Community/miniapp-smart-ui/pull/62/commits/d0e1f9f9b1a7028517a334299b03a07fe5cf206f))
- popup: Align with UI; default safe-area-inset-bottom to false ([c3c79f2](https://github.com/Tuya-Community/miniapp-smart-ui/pull/61/commits/c3c79f2f0efef6595649b426fb5221cb6df83da9)); fix --popup-background-color not supporting gradient ([37a938a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/68/commits/37a938a0780fe64d24a4e8c20810b1e1434e4ee6))

## v2.7.0 (2025-10-21)

### Features ✨

- picker: Refactor with 3D effect; add loop and full-height; performance improvements ([pull/48](https://github.com/Tuya-Community/miniapp-smart-ui/pull/48))
- datetime-picker: Add loop scroll ([pull/48](https://github.com/Tuya-Community/miniapp-smart-ui/pull/48))
- nav-bar: Style updates; add right-text-color, right-icon-color, right-icon-size, left-icon-color, background, right-icon-class, left-text-class; add click-right-icon, click-right-text; add/update CSS vars; border default false ([pull/38](https://github.com/Tuya-Community/miniapp-smart-ui/pull/38))
- swipe-cell: Add tabClose event ([03483f1](https://github.com/Tuya-Community/miniapp-smart-ui/pull/50/commits/03483f198d6503f4f4b760891bc4e598773e337f))
- switch: Add active-text, inactive-text; add --switch-label-* CSS variables ([pull/47](https://github.com/Tuya-Community/miniapp-smart-ui/pull/47))
- dialog: Add emptyDisabled; disable submit when input is empty in input mode ([9dbb29c](https://github.com/Tuya-Community/miniapp-smart-ui/pull/50/commits/9dbb29ca129202bac7622264a1d7f684d5da89ba))

### Bug Fixes 🐛

- image: Set show-loading default to false ([6090b97](https://github.com/Tuya-Community/miniapp-smart-ui/pull/50/commits/6090b97baea6f1c75bf7be184a5ae8fcc33afa9b))
- loading: Fix --loading-spinner-color not working ([pull/47](https://github.com/Tuya-Community/miniapp-smart-ui/pull/47))
- popover: Fix consecutive taps not opening ([pull/47](https://github.com/Tuya-Community/miniapp-smart-ui/pull/47))
- stepper: Fix keyboard input value not aligned with step ([10e5753](https://github.com/Tuya-Community/miniapp-smart-ui/pull/50/commits/10e5753c8a5fe0ecfe0f463d3d6ab760b95aca67))
- switch: Fix vertical alignment ([a622a42](https://github.com/Tuya-Community/miniapp-smart-ui/pull/50/commits/a622a42504ae33022b91463ecbb93b1f218999df))
- tab: Fix color prop in card mode ([pull/42](https://github.com/Tuya-Community/miniapp-smart-ui/pull/42))
- notice-bar: Fix btn-click ([4250d39](https://github.com/Tuya-Community/miniapp-smart-ui/pull/50/commits/4250d39ec89198f115803acaaf82266553bc9f9c))
- popup: Default bottom safe area off ([3da77ee](https://github.com/Tuya-Community/miniapp-smart-ui/pull/54/commits/3da77eecbc51b014fd06b4871d054ddda9d2a1c7))
- calendar: Default bottom safe area off ([4c91851](https://github.com/Tuya-Community/miniapp-smart-ui/pull/54/commits/4c91851fe674bcb64a19c830a3f1539da8700dd1))
- picker: Fix default width in flex layout; fix unit spacing not controlled by fontStyle ([f3f4772](https://github.com/Tuya-Community/miniapp-smart-ui/pull/55/commits/f3f47729fd4c1af0eb617cf56d957c2b389f2d4e), [4eb02fc](https://github.com/Tuya-Community/miniapp-smart-ui/pull/55/commits/4eb02fca12cb6feab62e8fdfd7d82d27bc52159c))
- datetime-picker: Fix default width in flex layout ([f3f4772](https://github.com/Tuya-Community/miniapp-smart-ui/pull/55/commits/f3f47729fd4c1af0eb617cf56d957c2b389f2d4e))
- icon: Update right, left, down, up icons to match UI ([e1bd07e](https://github.com/Tuya-Community/miniapp-smart-ui/commit/e1bd07ebb2bd411fe82e714b11e603ed68271c9a))

## v2.6.3 (2025-09-16)

### Features ✨

- dialog: Add autoClose; fix auto-close behavior ([36ba91e](https://github.com/Tuya-Community/miniapp-smart-ui/pull/37/commits/36ba91ee495b632aae9ede192364a65d8d999a75)); icon: support custom icon, add iconColor and iconSize ([11328c5](https://github.com/Tuya-Community/miniapp-smart-ui/pull/37/commits/11328c50d0001f7ca40429c21c27ec796d02455d))

### Bug Fixes 🐛

- action-sheet: Fix subname not expanding height ([4df8c64](https://github.com/Tuya-Community/miniapp-smart-ui/pull/37/commits/4df8c64a0412a2c64bd706b72dd6f4f66e46e2d5))
- icon: Fix click event missing event argument ([bad5231](https://github.com/Tuya-Community/miniapp-smart-ui/pull/37/commits/bad523192b1e3d02d37f267ec2c7c080115cfdd8))
- field: Fix textarea autosize max height scroll ([40fe4bc](https://github.com/Tuya-Community/miniapp-smart-ui/pull/37/commits/40fe4bc1727523fa427c904c4e29d5ff7da032fb))
- cell: Fix last cell divider in cell-group not hidden ([bea6309](https://github.com/Tuya-Community/miniapp-smart-ui/pull/37/commits/bea6309bdcec3d5495c91f9ed1cc325319523320))

## v2.6.2 (2025-08-28)

### Features ✨

- battery: Add color prop ([ff99655](https://github.com/Tuya-Community/miniapp-smart-ui/pull/28/commits/ff996558becf5ebe24b711904bc1ae9e0faecedc))
- cell: Add inset-border-radius ([09c60be](https://github.com/Tuya-Community/miniapp-smart-ui/pull/29/commits/09c60bef61e8f353bcab90728c2ca509aaf0b94f))

### Bug Fixes 🐛

- picker: Fix unit alignment ([fc12155](https://github.com/Tuya-Community/miniapp-smart-ui/pull/28/commits/fc12155f3883d0147cb328c2123442f147fef330))
- Update @tuya-miniapp/icons import approach ([d4921f1](https://github.com/Tuya-Community/miniapp-smart-ui/pull/28/commits/d4921f1763211cb631bcd11a51f8ac0296691b77))
- calendar: Fix --calendar-day-height, --calendar-selected-day-size not applied ([a08cebe](https://github.com/Tuya-Community/miniapp-smart-ui/pull/31/commits/a08cebe8ff8a62c8d544214cfbd5c05b3cce8347), [bfebfa3](https://github.com/Tuya-Community/miniapp-smart-ui/pull/31/commits/bfebfa3a26ec28e9a4a485f9ea1fd73189ed0624))

## v2.6.1 (2025-08-14)

### Features ✨

- bottom-sheet: Add show-close prop and title slot ([fef37bf](https://github.com/Tuya-Community/miniapp-smart-ui/pull/16/commits/fef37bf51650810a486ca1e0863ffd421d4711f9))

### Bug Fixes 🐛

- nav-bar: Fix text overflow when left-text-type is home or title ([97f91f5](https://github.com/Tuya-Community/miniapp-smart-ui/pull/16/commits/97f91f5869860d4cbf8994e11f5a0cffa8ac987e))
- picker: Fix unit line break ([b8075bd](https://github.com/Tuya-Community/miniapp-smart-ui/pull/16/commits/b8075bd2b48b369db549554bd80c23e5305e9426))
- stepper: Fix disabled style at max/min; set --stepper-button-disabled-color default; fix input delete when min or decimalLength set ([58ce5af](https://github.com/Tuya-Community/miniapp-smart-ui/pull/16/commits/58ce5af24c715c9534026fd07121426973578dce), [e0e55fa](https://github.com/Tuya-Community/miniapp-smart-ui/pull/16/commits/e0e55fa18f517fafc603a6b9c3035276d6ccaa16), [7cf1cfe](https://github.com/Tuya-Community/miniapp-smart-ui/pull/16/commits/7cf1cfe9d0e7ac77db1007d902960b83dde45d9e))
- image: Fix extra vertical spacing ([a42f0ad](https://github.com/Tuya-Community/miniapp-smart-ui/pull/16/commits/a42f0ad7e964b0d63de2b5e1dde7aed2efd99b17))

## v2.6.0 (2025-07-31)

### Features ✨

- nav-bar: Add --nav-bar-title-max-width, default from 60% to calc(100% - 360rpx) ([af0d83a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/af0d83ac571e70d9d7b5f934287866c9e37e7f6c))
- bottom-sheet: Add max-height ([0ed0ea9](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/0ed0ea9d1f32342f8e87a29c6b5927da4026d3fc))
- datetime-picker: Refactor 12h display logic; add --hairline-border-image-color ([019d181](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/019d1813a18c89af733c43526dbe690e69568f75), [822df05](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/822df0555738199533bbaa44073fda93aefbe01b), [6381e6f](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/6381e6ffdf61ae21a1ff3943c69a543ecbc1e03c))
- picker: Add --picker-option-selected-font-weight-bold; add hairline-class ([7b38c33](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/7b38c33437f96f57757cc6c9e014938cd4ba6671), [55ed888](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/55ed8885045f34c95b8076c985b64350f0b43c13))
- action-sheet: Add use-title-slot, title slot, dual-column support; divider and safe area ([8eea246](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/8eea24657985252ef9dfc023fa9ba4eb33feefda))
- calendar: header-icon-color; --calendar-header-icon-bg-color, --calendar-header-icon-color, --calendar-header-title-weight ([944b728](https://github.com/Tuya-Community/miniapp-smart-ui/pull/9/commits/944b7281a04c150539ed5da6537db649fe40808c), [0907238](https://github.com/Tuya-Community/miniapp-smart-ui/pull/9/commits/0907238bce8863ae58435ac6767e5eda3c464bb0), [52989f4](https://github.com/Tuya-Community/miniapp-smart-ui/pull/9/commits/52989f4800a28ef354dc3cee14ac2300fc344ffe))
- toast: Add --toast-min-width; deprecate --toast-text-min-width ([13a4f93](https://github.com/Tuya-Community/miniapp-smart-ui/pull/9/commits/13a4f93e4bf9f2fb3dfb17e64f85d82430d22706), [f99c3a3](https://github.com/Tuya-Community/miniapp-smart-ui/pull/9/commits/f99c3a30b5d78f655513756ce494b1ec6e259a1f))

### Bug Fixes 🐛

- bottom-sheet: Fix unexpected scroll when contentHeight set ([175f145](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/175f1455b55ff6018f1586f3ea613ecba230ac3f))
- cascader: Fix option list scroll ([1ff96ed](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/1ff96ed1ca4d45f3a9a63a90e6239d8ddec76ff6))
- dialog: Fix vertical alignment; update background color ([b591451](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/b591451e8a9b9c842ed721f454f20a190188666b), [eae43fb](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/eae43fb54a23fa669636e166b149cd9f393fb8ef))
- icon: Fix info position and style ([d556d4d](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/d556d4d648594c73d575aadae3ac859b546fbe05), [1fcd058](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/1fcd05883ef7ea69e533a9bef9a6a26ebfa5e603))
- stepper: Adjust plus/minus size ([2d37826](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/2d37826977b0977b369b4b5bb7f549f263e10134))
- overlay: Style adjustments ([319761a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/319761a88793c178d3f6c0089adb4a6079df29ec))
- picker: animationTime default 300; fix unit spacing and --picker-option-unit-mid-size; fix list and animation ([302919a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/302919ab414ac70cc2174541c97127bc8e2f5bdc), [f7a4f28](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/f7a4f28b60d31afc7b699100f7cc1e992f621319), [afe87f2](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/afe87f262a69d6733c8ee7eb38cf129220ae333f), [1619172](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/16191721222fe7658d87b0eaf0d8c28d5ecc29a6), [d82a6cf](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/d82a6cff525d26f9094046be27874a0a80f883de), [af64c11](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/af64c1182055c9a264cd71058a1c708f93801e73))
- datetime-picker: Fix long drag flicker; fix initial list jitter ([3f3578c](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/3f3578cc215aef657c02feba2c4f214595db7e49), [e1fe931](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/e1fe9313bf5a56841d52db6c62009f6025968194), [c233ac4](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/c233ac47a288d8a648da0db6021ac4929523c1e3))
- circle: Fix round prop not working ([e862099](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/e8620991d6ad255f461740974db11af99d58a767))
- tab: Change selected value type to string ([e22f999](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/e22f999e6c54a0572f6080cd7744ba1afadc6b6c))

## v2.5.1 (2025-07-17)

### Features ✨

- dialog: Add --dialog-confirm-font-weight, --dialog-cancel-font-weight CSS variables
- nav-bar: Add --nav-bar-right-text-color CSS variable
- tabbar: Add upsideDown to flip text and icon vertically

## v2.5.0 (2025-06-26)

### Features ✨

- action-sheet: Add nativeDisabled
- bottom-sheet: Add nativeDisabled, contentHeight; add --bottom-sheet-header-padding
- toast: Add nativeDisabled
- calendar: Add --calendar-popup-height; support custom-class
- dropdown-menu: Add scrollStyle for scroll when list exceeds screen
- popover: Add trigger
- skeleton: Improve animation
- switch: Layout change; active-color and inactive-color support gradient; remove --switch-border, add --switch-padding

### Bug Fixes 🐛

- bottom-sheet: Fix scroll at max height; fix bottom safe area when content positioned at bottom; fix round border radius
- circle: Fix percent position when mode="angle2"
- dialog: Fix round-button divider remnant
- popup: Fix round border radius
- toast: Fix icon mode text alignment; fix text class when text-only

## v2.4.0 (2025-06-10)

### Features ✨

- Add SmartUIAutoImport plugin and export structure for ray cli on-demand component loading
- picker: Add --picker-option-unit-mid-size CSS variable
- slider: Support thumb, bar slots
- switch: Add --switch-node-on-background-color for active background

### Bug Fixes 🐛

- circle: Fix customStyle invalid; improve blur
- toast: Fix custom width not expanding

## v2.3.9 (2025-05-15)

### Features ✨

- circle: Refactor with rjs (WeChat no longer supported)
- calendar: Add maxRange, rangePrompt, showRangePrompt, allowSameDay

### Bug Fixes 🐛

- circle: Fix blur
- nav-bar: Fix height adaptation; use --app-device-navbar-height
- picker: Fix initial animation stutter; changeAnimation default false; fix disabled console warning

## v2.3.8 (2025-05-06)

### Features ✨

- popup: Add nativeDisabled to disable native gestures while open
- dialog: Add nativeDisabled to disable native gestures while open
- radio: Add preventDefault to block default UI update
- datetime-picker: Add 12h timezone text style; add value in onChange

### Bug Fixes 🐛

- field: Fix errorMessage long text wrap style
- picker: Fix missing disabled style
- datetime-picker: Fix hour 0 or 24 conflicting with min/max

## v2.3.7 (2025-04-15)

### Features ✨

- switch: Align with UI design, adjust size
- datetime-picker: Add activeStyle, columnStyles, fontStyles, animationTime
- picker: Add animationTime

### Bug Fixes 🐛

- action-sheet: Fix close animation stutter
- checkbox: Fix double change when used with cell and click bubbles
- icon: Fix rgba color when using Svg path
- field: Fix placeholderStyle and --field-placeholder-text-color

## v2.3.5 (2025-03-27)

### Features ✨

- dialog: Add --dialog-header-padding, --dialog--round-button-border-radius
- picker: Add disabled per column; add columns.fontStyle
- tab: Add subtitle, subtitleStyle; add --tabs-sub-line-height
- tabbar: Add tabbar-item disabled

### Bug Fixes 🐛

- popover: Fix auto-close timing; fix arrow background with component color
- tabbar: Fix activeColor default to --tabbar-item-active-color
- tab: Fix onBeforeChange cancel console error
- toast: Fix bottom/top position overlap
- dialog: Replace --smart-dialog--round-button-border-radius with --dialog--round-button-border-radius

## v2.3.3 (2025-03-18)

### Features ✨

- icon: name supports Svg Path
- image: Add tintColor for image tinting

### Bug Fixes 🐛

- image: Fix extra bottom spacing
- switch: Fix extra bottom spacing
- circle: Fix render size
- tab: Fix card mode mask not covering slider when content has popup

## v2.3.2 (2025-03-07)

### Features ✨

- datetime-picker: Inherit picker onAnimationStart, onAnimationEnd

### Bug Fixes 🐛

- picker: Fix activeIndex positioning
- dropdown-menu: Doc updates

## v2.3.0 (2025-02-28)

### New Components 🎉

- popover: Bubble popover component

### Features ✨

- circle: Canvas refactor; add mode, round for arc styles
- picker: Add onAnimationStart, onAnimationEnd

### Bug Fixes 🐛

- datetime-picker: Fix 12h controlled usage
- slider: Doc and Rangeslider inActiveColor fix
- transition: Fix frequent animation calls
- dialog, toast: Fix open failure; add global id check

## v2.2.1 (2025-2-21)

### Bug Fixes 🐛

- dialog: Fix unable to get component instance
- toast: Fix unable to get component instance
- calendar: Fix type switch display; improve year range

## v2.2.0 (2025-2-13)

### Bug Fixes 🐛

- icon: Fix repeat glitch
- picker: Fix scroll smoothness
- nav-bar: Fix initial top safe area offset
- slider: Fix vertical value calculation
- stepper: Fix internal icon; built-in Icon
- dialog: Fix open failure on repeated calls
- Fix unit test ESM

### Features ✨

- datetime-picker: Add is12HourClock, amText, pmText for 12h
- datetime-picker: Add columnsOrder, formatterMap, changeAnimation
- stepper: Add scroll haptic
- picker: Add scroll haptic; changeAnimation; order for flex order
- action-sheet: Add --action-sheet-active-icon-color
- slider: Add useParcelPadding
- Tabbar: Add left, right slots
- stepper: Add --stepper-button-border, --stepper-button-icon-font-size

## v2.1.10 (2025-1-13)

### Bug Fixes 🐛

- Fix notice-bar background opacity; update --notice-bar-info-color, --notice-bar-warning-color, --notice-bar-error-color

## v2.1.8 (2024-01-06)

### Bug Fixes 🐛

- Fix toast, dialog API context error when getting instance

## v2.1.7 (2024-12-27)

### Bug Fixes 🐛

- dialog: Fix rapid DialogInstance calls causing render/destroy issues; add confirmButtonColor & cancelButtonColor types; remove beforeClose for component usage
- circle: Fix style prop warning
- config-provider: Fix missing dialog theme vars
- progress: No use case; hide component
- notice-bar: Fix CSS variable override
- custom-keyboard: Fix CSS variable override
- tree-select: Fix CSS variable override

### Features ✨

- ESM build with tree-shaking
- @tuya-miniapp/icons ESM with tree-shaking
- index-bar: Add scrollable, default disable Sidebar scroll index change
- dialog: Add --dialog-cancel-color, --dialog-confirm-color
- notice-bar: Add --notice-bar-right-icon-color
- stepper: Add --stepper-container-background-color
- circle: Add customStyle; deprecate style; size supports string

## v2.1.6 (2024-12-19)

### Bug Fixes 🐛

- toast: Fix width default and centering
- slider: Fix scroll when sliding

## v2.1.5 (2024-12-10)

### Bug Fixes 🐛

- Fix icon on-demand import; field, steps internal imports updated

Do not use: `import { Sun } from '@tuya-miniapp/icons'`  
Use: `import Sun from '@tuya-miniapp/icons/dist/svg/Sun'`

## v2.1.4 (2024-11-29)

### Bug Fixes 🐛

- dropdown-menu: Fix expand position when opening upward
- tab: Fix card mode slider style; fix nested switch console error

### Features ✨

- hairline: Add --hairline-top-width, --hairline-left-width, --hairline-right-width, --hairline-bottom-width, --hairline-surround-width, --hairline-top-bottom-width, --hairline-color
- cell: Update --cell-border-color, --cell-border-left-position, --cell-border-right-position

## v2.1.0 (2024-11-21)

### Bug Fixes

- tab: Fix switch flicker
- action-sheet: Fix scroll
- calendar: Fix loop render key; fix initial NaN

### Features

- tab: Add inactiveDestroy; style refactor
- nav-bar: Add round, rightTextClass
- field: Add interError, subLabel, cardMode, hiddenLabel; style refactor
- calendar: Add dayClassMap
- icon: Add Delete, DeleteLine

## v2.0.0 (2024-11-12)

### New Components 🎉

- calendar: Calendar component
- tag: Tag component
- bottom-sheet: Bottom sheet component
- notice-bar: Notice bar component

### Features ✨

- field: UI & refactor
- tab: UI & refactor
- search: UI & refactor
- top-nar: UI & refactor
- switch: UI & refactor
- toast: UI & refactor
- dropdown-menu: UI & refactor
- button: UI & refactor
- action-sheet: UI & refactor
- checkbox: UI & refactor
- radio: UI & refactor
- empty: UI & refactor
- picker: Optimization & refactor
- tabbar: Optimization & refactor

## v1.2.6 (2024-10-29)

### Bug Fixes 🐛

- grid: Fix GridItem
- radio: Fix component
- cell: Fix component

## v1.2.6 (2024-9-12)

### Bug Fixes 🐛

- picker: Fix pickerColumn not firing `change` at scroll extremes.
