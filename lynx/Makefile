# Business-only Lynx build and mini-dev-cli debug targets.
# Merge this section into the project's Makefile and replace every project value.

APP_ID ?= tysncznjawnyjkyean
BUSINESS_BUILD_CMD ?= $(NODE) build-example.cjs
BUSINESS_PACKAGE_DIR ?= $(CURDIR)/build-output/miniprogram

MINI_DEV_CLI ?= mini-dev-cli
MINI_DEV_CLI_VERSION ?= 1.3.3
TUYA_NPM_REGISTRY ?= https://registry-npm.tuya-inc.top
NODE ?= node
BUSINESS_DEBUG_TOOL ?= $(CURDIR)/tools/business-miniapp-debug.mjs

PLATFORM ?= ios
RUNTIME ?= simulator
SIMULATOR ?=
DEVICE ?=
# 留空保留 CLI 自动兼容；仅 iOS 真机可设 pymobiledevice3 / devicectl。
IOS_BACKEND ?=
BUNDLE_ID ?= com.tuya.smart
OPEN_PATH ?= pages/dashboard/index
OPEN_URL ?=
OPEN_SCHEME ?= tuyaSmart
OPEN_COLD ?=
NO_OPEN ?= 1
DRY_RUN ?=

BUSINESS_TARGET_ARGS = \
	--platform "$(PLATFORM)" \
	--runtime "$(RUNTIME)" \
	$(if $(SIMULATOR),--simulator "$(SIMULATOR)",) \
	$(if $(DEVICE),--device "$(DEVICE)",) \
	$(if $(IOS_BACKEND),--ios-backend "$(IOS_BACKEND)",) \
	$(if $(BUNDLE_ID),--bundle-id "$(BUNDLE_ID)",)

BUSINESS_OPEN_ARGS = \
	$(if $(OPEN_URL),--open-url "$(OPEN_URL)",--app-id "$(APP_ID)" $(if $(OPEN_PATH),--open-path "$(OPEN_PATH)",) $(if $(OPEN_SCHEME),--open-scheme "$(OPEN_SCHEME)",)) \
	$(if $(OPEN_COLD),--cold,)

BUSINESS_TOOL_ARGS = \
	--ensure-dependencies \
	--mini-dev-cli "$(MINI_DEV_CLI)" \
	--minimum-version "$(MINI_DEV_CLI_VERSION)" \
	--registry "$(TUYA_NPM_REGISTRY)" \
	--package-dir "$(BUSINESS_PACKAGE_DIR)" \
	$(if $(APP_ID),--app-id "$(APP_ID)",) \
	$(BUSINESS_TARGET_ARGS) \
	$(BUSINESS_OPEN_ARGS) \
	$(if $(NO_OPEN),--no-open,) \
	$(if $(DRY_RUN),--dry-run,)

.PHONY: \
	business-debug-setup \
	business-device-setup \
	business-check-cli \
	business-build \
	business-doctor \
	business-doctor-global \
	business-push-plan \
	business-push-global-plan \
	business-reopen \
	business-debug \
	business-push \
	business-push-existing \
	business-push-global \
	business-push-global-existing \
	business-push-simulator \
	business-push-device \
	business-push-global-simulator \
	business-push-global-device

business-debug-setup:
	$(NODE) "$(BUSINESS_DEBUG_TOOL)" check --ensure-dependencies --mini-dev-cli "$(MINI_DEV_CLI)" --minimum-version "$(MINI_DEV_CLI_VERSION)" --registry "$(TUYA_NPM_REGISTRY)"

business-device-setup: business-check-cli
	@echo "真机默认由 mini-dev-cli 自动准备 pymobiledevice3；此步骤不写业务包、不打开 App。"
	$(MINI_DEV_CLI) device list --platform ios $(if $(IOS_BACKEND),--ios-backend "$(IOS_BACKEND)",)

business-check-cli:
	@command -v $(NODE) >/dev/null 2>&1 || { echo "错误: 未找到 $(NODE)"; exit 1; }
	@test -f "$(BUSINESS_DEBUG_TOOL)" || { echo "错误: 缺少调试工具: $(BUSINESS_DEBUG_TOOL)"; exit 1; }
	$(NODE) "$(BUSINESS_DEBUG_TOOL)" check --ensure-dependencies $(if $(DRY_RUN),--dry-run,) --mini-dev-cli "$(MINI_DEV_CLI)" --minimum-version "$(MINI_DEV_CLI_VERSION)" --registry "$(TUYA_NPM_REGISTRY)"

business-build:
	$(BUSINESS_BUILD_CMD)

business-doctor: business-check-cli
	$(NODE) "$(BUSINESS_DEBUG_TOOL)" doctor $(BUSINESS_TOOL_ARGS)

business-doctor-global: business-check-cli
	$(NODE) "$(BUSINESS_DEBUG_TOOL)" doctor --global-miniprogram --confirm-global $(BUSINESS_TOOL_ARGS)

business-push-plan business-push-global-plan: DRY_RUN=1

business-push-plan: business-check-cli
	$(NODE) "$(BUSINESS_DEBUG_TOOL)" push --dry-run $(BUSINESS_TOOL_ARGS)

business-push-global-plan: business-check-cli
	$(NODE) "$(BUSINESS_DEBUG_TOOL)" push --global-miniprogram --confirm-global --dry-run $(BUSINESS_TOOL_ARGS)

business-reopen: business-check-cli
	$(NODE) "$(BUSINESS_DEBUG_TOOL)" reopen --mini-dev-cli "$(MINI_DEV_CLI)" --minimum-version "$(MINI_DEV_CLI_VERSION)" $(BUSINESS_TARGET_ARGS) $(BUSINESS_OPEN_ARGS) $(if $(DRY_RUN),--dry-run,)

business-push-existing: business-check-cli
	$(NODE) "$(BUSINESS_DEBUG_TOOL)" push $(BUSINESS_TOOL_ARGS)

business-push:
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-check-cli
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-build
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-push-existing

business-debug: business-push
	@echo "业务包已构建、推送并按配置重开；继续执行截图、交互和日志验收。"

business-push-global-existing: business-check-cli
	$(NODE) "$(BUSINESS_DEBUG_TOOL)" push --global-miniprogram --confirm-global $(BUSINESS_TOOL_ARGS)

business-push-global:
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-check-cli
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-build
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-push-global-existing

business-push-simulator:
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-push PLATFORM=ios RUNTIME=simulator SIMULATOR="$(SIMULATOR)" BUNDLE_ID="$(BUNDLE_ID)"

business-push-device:
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-push PLATFORM=ios RUNTIME=device DEVICE="$(DEVICE)" BUNDLE_ID="$(BUNDLE_ID)"

business-push-global-simulator:
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-push-global PLATFORM=ios RUNTIME=simulator SIMULATOR="$(SIMULATOR)" BUNDLE_ID="$(BUNDLE_ID)"

business-push-global-device:
	$(MAKE) -f "$(firstword $(MAKEFILE_LIST))" business-push-global PLATFORM=ios RUNTIME=device DEVICE="$(DEVICE)" BUNDLE_ID="$(BUNDLE_ID)"
