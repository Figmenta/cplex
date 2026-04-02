"use client";

import { useRef, useCallback, useEffect, type ComponentType } from "react";
import gsap from "gsap";
import type { ExpertiseSlug } from "@/components/home/content";

export interface ExpertiseAnimatedIconProps {
  isHovered?: boolean;
}

function useHoverAnimation(
  setup: (el: SVGSVGElement) => gsap.core.Timeline,
  isHovered?: boolean
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const start = useCallback(() => {
    if (!svgRef.current) return;
    if (tlRef.current) {
      tlRef.current.kill();
    }
    tlRef.current = setup(svgRef.current);
  }, [setup]);

  const stop = useCallback(() => {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    if (svgRef.current) {
      gsap.to(svgRef.current.querySelectorAll("[data-animate]"), {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.2,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }, []);

  useEffect(() => {
    if (isHovered === undefined) return;
    if (isHovered) start();
    else stop();
  }, [isHovered, start, stop]);

  const onMouseEnter = useCallback(() => {
    if (isHovered !== undefined) return;
    start();
  }, [isHovered, start]);

  const onMouseLeave = useCallback(() => {
    if (isHovered !== undefined) return;
    stop();
  }, [isHovered, stop]);

  return { svgRef, onMouseEnter, onMouseLeave };
}

/** Mergers & Acquisitions: diamonds overlap and move apart in a loop */
export function MergersIcon({ isHovered }: ExpertiseAnimatedIconProps) {
  const { svgRef, onMouseEnter, onMouseLeave } = useHoverAnimation((el) => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(
      el.querySelector('[data-animate="left"]'),
      { x: 8, duration: 0.45, ease: "power1.inOut" },
      0
    );
    tl.to(
      el.querySelector('[data-animate="right"]'),
      { x: -8, duration: 0.45, ease: "power1.inOut" },
      0
    );
    return tl;
  }, isHovered);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-full h-full"
    >
      <svg
        ref={svgRef}
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        overflow="visible"
        className="w-full h-full"
      >
        <g data-animate="left">
          <path
            d="M12.8 32L25.6 12.8L38.4 32L25.6 51.2L12.8 32"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M6.4 32H12.8"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
        <g data-animate="right">
          <path
            d="M25.6 32L38.4 12.8L51.2 32L38.4 51.2L25.6 32"
            stroke="#0646D0"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M51.2 32H57.6"
            stroke="#0646D0"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
        <path
          d="M32 22.4V41.6"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeDasharray="1.28 1.28"
        />
      </svg>
    </div>
  );
}

/** Corporate & Commercial Law: grid elements softly shift and align */
export function CorporateIcon({ isHovered }: ExpertiseAnimatedIconProps) {
  const { svgRef, onMouseEnter, onMouseLeave } = useHoverAnimation((el) => {
    const squares = el.querySelectorAll("[data-animate]");
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(
      squares[0],
      { x: -3, y: -3, duration: 0.45, ease: "power1.inOut" },
      0
    );
    tl.to(squares[1], { x: 3, y: -3, duration: 0.45, ease: "power1.inOut" }, 0);
    tl.to(squares[2], { x: -3, y: 3, duration: 0.45, ease: "power1.inOut" }, 0);
    tl.to(squares[3], { x: 3, y: 3, duration: 0.45, ease: "power1.inOut" }, 0);
    return tl;
  }, isHovered);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-full h-full"
    >
      <svg
        ref={svgRef}
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        overflow="visible"
        className="w-full h-full"
      >
        <g data-animate="sq1">
          <rect
            x="12.8"
            y="12.8"
            width="16"
            height="16"
            stroke="#0646D0"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        <g data-animate="sq2">
          <rect
            x="35.2"
            y="12.8"
            width="16"
            height="16"
            stroke="#0646D0"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        <g data-animate="sq3">
          <rect
            x="12.8"
            y="35.2"
            width="16"
            height="16"
            stroke="#0646D0"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        <g data-animate="sq4">
          <rect
            x="35.2"
            y="35.2"
            width="16"
            height="16"
            stroke="#0646D0"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        <path
          d="M28.8 20.8H35.2"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M28.8 43.2H35.2"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M20.8 28.8V35.2"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M43.2 28.8V35.2"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect
          x="27.2"
          y="27.2"
          width="9.6"
          height="9.6"
          fill="#0E5FA8"
          fillOpacity="0.15"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Intellectual Property: outer dashed rim rotates */
export function IntellectualPropertyIcon({ isHovered }: ExpertiseAnimatedIconProps) {
  const { svgRef, onMouseEnter, onMouseLeave } = useHoverAnimation((el) => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(el.querySelector('[data-animate="rim"]'), {
      rotation: 360,
      svgOrigin: "32 32",
      duration: 1.8,
      ease: "none",
    });
    return tl;
  }, isHovered);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-full h-full"
    >
      <svg
        ref={svgRef}
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        overflow="visible"
        className="w-full h-full"
      >
        <circle cx="32" cy="32" r="6.4" fill="#0E5FA8" fillOpacity="0.15" />
        <circle
          cx="32"
          cy="32"
          r="6.4"
          stroke="#0B1328"
          strokeWidth="1.5"
          fill="none"
        />
        <g data-animate="rim">
          <circle
            cx="32"
            cy="32"
            r="16"
            stroke="#0646D0"
            strokeWidth="1.5"
            strokeDasharray="2.56 2.56"
            fill="none"
          />
        </g>
        <path
          d="M32 16V6.4"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M32 48V57.6"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M16 32H6.4"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M48 32H57.6"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20.8 20.8L12.8 12.8"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M43.2 43.2L51.2 51.2"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20.8 43.2L12.8 51.2"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M43.2 20.8L51.2 12.8"
          stroke="#D54561"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="32" cy="6.4" r="1.6" fill="#D54561" />
        <circle cx="32" cy="57.6" r="1.6" fill="#D54561" />
        <circle cx="6.4" cy="32" r="1.6" fill="#D54561" />
        <circle cx="57.6" cy="32" r="1.6" fill="#D54561" />
        <circle cx="12.8" cy="12.8" r="1.6" fill="#D54561" />
        <circle cx="51.2" cy="51.2" r="1.6" fill="#D54561" />
        <circle cx="12.8" cy="51.2" r="1.6" fill="#D54561" />
        <circle cx="51.2" cy="12.8" r="1.6" fill="#D54561" />
      </svg>
    </div>
  );
}

/** Litigation & Dispute Resolution: red arrow shapes move apart and closer */
export function LitigationIcon({ isHovered }: ExpertiseAnimatedIconProps) {
  const { svgRef, onMouseEnter, onMouseLeave } = useHoverAnimation((el) => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(
      el.querySelector('[data-animate="left"]'),
      { x: -7, duration: 0.45, ease: "power1.inOut" },
      0
    );
    tl.to(
      el.querySelector('[data-animate="right"]'),
      { x: 7, duration: 0.45, ease: "power1.inOut" },
      0
    );
    return tl;
  }, isHovered);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-full h-full"
    >
      <svg
        ref={svgRef}
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        overflow="visible"
        className="w-full h-full"
      >
        <path
          d="M32 9.6V54.4"
          stroke="#0646D0"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeDasharray="1.92 1.92"
        />
        <g data-animate="left">
          <path
            d="M22.4 22.4L12.8 32L22.4 41.6V22.4"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12.8 32H6.4"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M22.4 22.4H28.8"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M22.4 41.6H28.8"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
        <g data-animate="right">
          <path
            d="M41.6 22.4L51.2 32L41.6 41.6V22.4"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M51.2 32H57.6"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M41.6 22.4H35.2"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M41.6 41.6H35.2"
            stroke="#D54561"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
        <rect
          x="30.4"
          y="28.8"
          width="3.2"
          height="6.4"
          fill="#0E5FA8"
          fillOpacity="0.15"
          stroke="#0646D0"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Map practice-area slug → animated icon (GSAP). */
export const EXPERTISE_ANIMATED_ICON_BY_SLUG: Record<
  ExpertiseSlug,
  ComponentType<ExpertiseAnimatedIconProps>
> = {
  "mergers-acquisitions": MergersIcon,
  "corporate-commercial": CorporateIcon,
  "intellectual-property": IntellectualPropertyIcon,
  "litigation-dispute": LitigationIcon,
};
