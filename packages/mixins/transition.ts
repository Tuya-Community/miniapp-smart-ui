// @ts-nocheck
import { requestAnimationFrame } from '../common/utils';
import { isObj } from '../common/validator';
import ty from '../common/ty';

const getClassNames = (name: string) => ({
  enter: `smart-${name}-enter smart-${name}-enter-active enter-class enter-active-class`,
  'enter-to': `smart-${name}-enter-to smart-${name}-enter-active enter-to-class enter-active-class`,
  leave: `smart-${name}-leave smart-${name}-leave-active leave-class leave-active-class`,
  'leave-to': `smart-${name}-leave-to smart-${name}-leave-active leave-to-class leave-active-class`,
});

export function transition(showDefaultValue: boolean) {
  return Behavior({
    properties: {
      nativeDisabled: Boolean,
      customStyle: String,
      // @ts-ignore
      show: {
        type: Boolean,
        value: showDefaultValue,
        observer: 'observeShow',
      },
      // @ts-ignore
      duration: {
        type: null,
        value: 300,
      },
      name: {
        type: String,
        value: 'fade',
      },
    },

    data: {
      type: '',
      inited: false,
      display: false,
      animating: false,
      status: '',
    },

    ready() {
      if (this.data.show === true) {
        this.observeShow(true, false);
      }
    },

    methods: {
      observeShow(value: boolean, old: boolean) {
        if (value === old) {
          return;
        }
        value ? this.enter() : this.leave();
      },

      enter() {
        if (this.enterFinishedPromise || this.data.animating) return;
        this.setData({
          animating: true,
          status: 'enter',
        });
        // eslint-disable-next-line no-async-promise-executor
        this.enterFinishedPromise = new Promise(async resolve => {
          const { duration, name } = this.data;
          const classNames = getClassNames(name);
          const currentDuration = isObj(duration) ? duration.enter : duration;
          if (this.data.nativeDisabled) {
            ty.nativeDisabled(true);
          }
          this.$emit('before-enter');
          await requestAnimationFrame();
          this.$emit('enter');
          this.setData({
            inited: true,
            display: true,
            classes: classNames.enter,
            currentDuration,
          });
          await requestAnimationFrame();
          this.transitionEnded = false;
          this.setData({ classes: classNames['enter-to'] });
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.$emit('after-enter');
            this.setData({
              animating: false,
            });
            this.checkShowStatus();
          }, currentDuration + 20);
          resolve();
        });
        this.enterFinishedPromise.catch(err => {
          this.enterFinishedPromise = null;
          this.setData({ animating: false });
          console.log(err, '---error-enter');
          this.$emit('enter-error', err);
        });
      },

      async leave() {
        if (!this.enterFinishedPromise || this.data.animating) return;
        this.setData({
          animating: true,
          status: 'leave',
        });
        this.enterFinishedPromise
          .then(async () => {
            const { duration, name } = this.data;
            const classNames = getClassNames(name);
            const currentDuration = isObj(duration) ? duration.leave : duration;
            this.$emit('before-leave');
            await requestAnimationFrame();
            this.$emit('leave');
            this.setData({
              classes: classNames.leave,
              currentDuration,
            });
            await requestAnimationFrame();
            this.transitionEnded = false;
            clearTimeout(this.timer);
            setTimeout(() => {
              this.enterFinishedPromise = null;
              if (this.data.nativeDisabled) {
                ty.nativeDisabled(false);
              }
              this.$emit('after-leave');
              this.setData({
                display: false,
                animating: false,
              });
              this.checkShowStatus();
            }, currentDuration + 20);

            this.setData({ classes: classNames['leave-to'] });
          })
          .catch(err => {
            this.enterFinishedPromise = null;
            this.setData({ animating: false });
            console.log(err, '---error-leave');
            this.$emit('leave-error', err);
            if (this.data.nativeDisabled) {
              ty.nativeDisabled(false);
            }
          });
      },
      async checkShowStatus() {
        const { status, show } = this.data;
        await requestAnimationFrame();
        if ((status === 'enter' && show) || (status === 'leave' && !show)) return;
        show ? this.enter() : this.leave();
      },
    },
  });
}
