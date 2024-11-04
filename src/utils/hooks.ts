import { useEffect, useRef, useState } from "react";

export const useMediaQuery: (minPx: number) => {
  isMediaQueryMatched: boolean;
} = (minPx) => {
  const [isMediaQueryMatched, setIsMediaQueryMatched] = useState(false);
  const hasSetInitially = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${minPx}px)`);
    if (!hasSetInitially.current) {
      setIsMediaQueryMatched(mediaQuery.matches);
      hasSetInitially.current = true;
    }
    window
      .matchMedia(`(min-width: ${minPx}px)`)
      .addEventListener("change", (ev) => {
        if (ev.matches) {
          setIsMediaQueryMatched(true);
        } else {
          setIsMediaQueryMatched(false);
        }
      });
  }, [minPx]);

  return {
    isMediaQueryMatched,
  };
};
