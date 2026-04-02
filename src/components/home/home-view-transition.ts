import { flushSync } from "react-dom";

/** CSS `view-transition-name` values — must match grid ↔ expanded surfaces. */
export const HOME_VT = {
  firm: "home-the-firm",
  news: "home-news",
  professionals: "home-professionals",
  expertise: (slug: string) => `home-expertise-${slug}`,
} as const;

/**
 * Runs a React state update inside the browser View Transitions API when available
 * so old/new snapshots interpolate (shared elements with matching view-transition-name).
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
 */
export function startHomeViewTransition(callback: () => void): Promise<void> {
  if (typeof document === "undefined") {
    callback();
    return Promise.resolve();
  }

  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };

  if (doc.startViewTransition) {
    return doc.startViewTransition(() => {
      flushSync(callback);
    }).finished;
  }

  flushSync(callback);
  return Promise.resolve();
}
