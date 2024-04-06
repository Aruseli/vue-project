export function forceNewVisit() {
  if (window._paq) {
    window._paq.push(['appendToTrackingUrl', 'new_visit=1']); // forces a new visit
    window._paq.push(["trackPageView"]);
    window._paq.push(['appendToTrackingUrl', '']); // do not force a new visit anymore (only do it once)
  }
}
