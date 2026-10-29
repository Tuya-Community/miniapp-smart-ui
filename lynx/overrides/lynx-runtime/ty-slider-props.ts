// The standalone TySlider owns drawing and gestures. Smart UI only resolves
// WebView's inherited radius before forwarding the existing public props.
export function resolveTySliderProps(props: Record<string, any>) {
  if (props.minTrackRadius !== undefined && props.minTrackRadius !== 'inherit') return props;
  const trackRadius = props.trackStyle?.borderRadius;
  const maxRadius = props.maxTrackRadius ?? '4px';
  return {
    ...props,
    minTrackRadius:
      trackRadius == null || trackRadius === 'inherit' || trackRadius === 'unset'
        ? maxRadius
        : trackRadius,
  };
}
