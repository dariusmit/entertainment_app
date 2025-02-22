export const scrollLeft = (
  scrollableRef: React.MutableRefObject<HTMLDivElement | null>,
  scrolling: boolean,
  setScrolling: React.Dispatch<React.SetStateAction<boolean>>,
  timeoutRef: React.MutableRefObject<number | null>
): void => {
  const container = scrollableRef.current;
  if (scrolling) return;

  const ScrollAmount =
    container!.offsetWidth >= 1266 && container!.offsetWidth < 1671
      ? container!.offsetWidth + 30.24
      : container!.offsetWidth + 40.44;

  setScrolling(true);
  container!.scrollBy({
    left: -ScrollAmount,
    behavior: "smooth",
  });

  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  timeoutRef.current = setTimeout(() => {
    setScrolling(false);
  }, 1000);
};

export const scrollRight = (
  scrollableRef: React.MutableRefObject<HTMLDivElement | null>,
  scrolling: boolean,
  setScrolling: React.Dispatch<React.SetStateAction<boolean>>,
  timeoutRef: React.MutableRefObject<number | null>
): void => {
  const container = scrollableRef.current;
  if (scrolling) return;

  const ScrollAmount =
    container!.offsetWidth >= 1266 && container!.offsetWidth < 1671
      ? container!.offsetWidth + 30.24
      : container!.offsetWidth + 40.44;

  setScrolling(true);
  container!.scrollBy({
    left: ScrollAmount,
    behavior: "smooth",
  });

  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  timeoutRef.current = setTimeout(() => {
    setScrolling(false);
  }, 1000);
};
