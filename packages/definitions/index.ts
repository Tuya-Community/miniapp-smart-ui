interface SmartComponentInstance {
  parent: WechatMiniprogram.Component.TrivialInstance;
  children: WechatMiniprogram.Component.TrivialInstance[];
  index: number;
  $emit: (
    name: string,
    detail?: unknown,
    options?: WechatMiniprogram.Component.TriggerEventOption
  ) => void;
  setView: (value: Record<string, any>, callback?: () => void) => void;
}

export type SmartComponentOptions<
  Data extends WechatMiniprogram.Component.DataOption,
  Props extends WechatMiniprogram.Component.PropertyOption,
  Methods extends WechatMiniprogram.Component.MethodOption
> = {
  data?: Data;
  field?: boolean;
  classes?: string[];
  mixins?: string[];
  props?: Props;
  relation?: {
    relations: Record<string, WechatMiniprogram.Component.RelationOption>;
    mixin: string;
  };

  watch?: Record<string, (...args: any[]) => any>;

  methods?: Methods;

  // lifetimes
  beforeCreate?: () => void;
  created?: () => void;
  mounted?: () => void;
  destroyed?: () => void;
} & ThisType<
  SmartComponentInstance &
    WechatMiniprogram.Component.Instance<
      Data & {
        name: string;
        value: any;
      } & Record<string, any>,
      Props,
      Methods
    > &
    Record<string, any>
>;
