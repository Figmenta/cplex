import { flushSync } from "react-dom";
import { EXPERTISE_AREAS } from "./content";

/** CSS `view-transition-name` values — must match grid ↔ expanded surfaces. */
export const HOME_VT = {
  firm: "home-the-firm",
  news: "home-news",
  professionals: "home-professionals",
  expertise: (slug: string) => `home-expertise-${slug}`,
} as const;

/** Same shape as grid `HomeExpandOrigin` — maps to one `HOME_VT` string. */
export type HomeGridOrigin =
  | { kind: "cell"; index: number }
  | { kind: "expertise-tile"; innerIndex: number };

/** Which named VT layer should paint above the other quadrant groups during a transition. */
export function gridOriginToVtName(origin: HomeGridOrigin): string {
  if (origin.kind === "cell") {
    if (origin.index === 0) return HOME_VT.firm;
    if (origin.index === 1) return HOME_VT.news;
    if (origin.index === 3) return HOME_VT.professionals;
    return HOME_VT.firm;
  }
  const slug =
    EXPERTISE_AREAS[origin.innerIndex]?.slug ?? EXPERTISE_AREAS[0].slug;
  return HOME_VT.expertise(slug);
}

export type StartHomeViewTransitionOptions = {
  /**
   * Sets `data-home-vt-active` on `<html>` so CSS can raise this
   * `::view-transition-group(name)` above other named groups (see globals.css).
   */
  liftTransitionName?: string;
};

/**
 * Runs a React state update inside the browser View Transitions API when available
 * so old/new snapshots interpolate (shared elements with matching view-transition-name).
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
 */
export function startHomeViewTransition(
  callback: () => void,
  options?: StartHomeViewTransitionOptions
): Promise<void> {
  if (typeof document === "undefined") {
    callback();
    return Promise.resolve();
  }

  const root = document.documentElement;
  if (options?.liftTransitionName) {
    root.dataset.homeVtActive = options.liftTransitionName;
  }

  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };

  const clearLift = () => {
    delete root.dataset.homeVtActive;
  };

  if (doc.startViewTransition) {
    return doc.startViewTransition(() => {
      flushSync(callback);
    }).finished.finally(clearLift);
  }

  flushSync(callback);
  clearLift();
  return Promise.resolve();
}
