// @ts-nocheck
import { isObj } from '../common/validator';
import { holdInteraction, releaseInteraction } from '../common/interaction-lock';

// Keep native nodes through leave, then remove them. Superseded callbacks are cancelled.
export function transition(showDefaultValue: boolean) {
  return Behavior({
    properties: {
      nativeDisabled: { type: Boolean, observer: 'syncInteractionLock' },
      customStyle: String,
      show: { type: Boolean, value: showDefaultValue, observer: 'observeShow' },
      duration: { type: null, value: 300 },
      name: { type: String, value: 'fade' },
    },
    data: { inited: false, display: false, animating: false, status: '', isShowed: false },
    ready() {
      if (this.data.show && !this.data.display) this.enter();
    },
    detached() {
      this.transitionDisposed = true;
      this.cancelTransition();
      releaseInteraction(this);
    },
    methods: {
      cancelTransition() {
        clearTimeout(this.frameTimer);
        clearTimeout(this.transitionTimer);
        this.transitionRevision = (this.transitionRevision || 0) + 1;
      },
      syncInteractionLock() {
        if (this.data.nativeDisabled && this.data.display) holdInteraction(this);
        else releaseInteraction(this);
      },
      observeShow(value, old) {
        if (value === old || this.transitionDisposed) return;
        value ? this.enter() : this.leave();
      },
      enter() {
        this.runTransition(true);
      },
      leave() {
        if (this.data.display) this.runTransition(false);
      },
      runTransition(entering) {
        if (this.transitionDisposed) return;
        this.cancelTransition();
        const revision = this.transitionRevision;
        const phase = entering ? 'enter' : 'leave';
        const { name } = this.data;
        const raw = isObj(this.data.duration) ? this.data.duration[phase] : this.data.duration;
        const duration = Math.max(0, Number(raw) || 0);
        this.$emit(`before-${phase}`);
        this.setData({
          inited: true,
          isShowed: true,
          display: true,
          animating: true,
          status: phase,
          currentDuration: duration,
          classes: `smart-${name}-${phase} smart-${name}-${phase}-active ${phase}-class ${phase}-active-class`,
        });
        this.syncInteractionLock();
        this.$emit(phase);
        this.frameTimer = setTimeout(() => {
          if (this.transitionDisposed || revision !== this.transitionRevision) return;
          this.setData({
            classes: `smart-${name}-${
              entering ? 'enter-to' : 'leave-to'
            } smart-${name}-${phase}-active ${phase}-to-class ${phase}-active-class`,
          });
          this.transitionTimer = setTimeout(() => {
            if (this.transitionDisposed || revision !== this.transitionRevision) return;
            this.setData({ display: entering, animating: false });
            if (!entering) releaseInteraction(this);
            this.$emit(`after-${phase}`);
          }, duration);
        }, 32);
      },
    },
  });
}
