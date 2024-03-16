export function useObserver(targetElements) {
  const observedElements = ref(targetElements);

  const intersectionObserver = useIntersectionObserver({
    // ... observer options
  }, (entries, observer) => {
    // ... code to handle intersection changes
  });

  return {
    intersectionObserver,
    observedElements,
  };
}
