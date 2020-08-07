import useMedia from './use-media';

export default function useIsMobile() {
  const isMobile = useMedia(['(min-width: 901px)'], [false], true);
  return isMobile;
}

export function useIsMediumScreen() {
  const isMobile = useMedia(['(min-width: 1151px)'], [false], true);
  return isMobile;
}
