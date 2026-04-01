'use client'


import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

// Register useGSAP hook
// gsap.registerPlugin(useGSAP) — add this to your layout or root if needed

const IMAGES = [
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
]

// Tailwind class shared across all 5 images
const IMG_CLASS = [
  'img',
  'w-[14vw]',
  'max-w-[140px]',
  'aspect-[3/4]',
  'object-cover',
  'object-top',
  'will-change-transform',
].join(' ')

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <span className="text-sm font-medium tracking-widest uppercase text-neutral-800">
        CP | LEX
      </span>
      <div className="flex gap-8">
        {['Work', 'About', 'Contact'].map((item) => (
          <a
            key={item}
            href="#"
            className="text-xs tracking-widest uppercase text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  )
}

// ─── Hero Text ────────────────────────────────────────────────────────────────
function HeroText() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 md:pb-16 pointer-events-none z-10">
      {/* Line 1 */}
      <div className="w-fit h-fit overflow-hidden pb-1 md:pb-2">
        <h1
          className="reveal-text font-['Anton'] uppercase tracking-tight text-center leading-none
                     text-[11vw] md:text-[7vw] text-neutral-900"
        >
          Justice & Integrity
        </h1>
      </div>
      {/* Line 2 */}
      <div className="w-fit h-fit overflow-hidden pb-1">
        <h1
          className="reveal-text font-['Anton'] uppercase tracking-tight text-center leading-none
                     text-[11vw] md:text-[7vw] text-neutral-500"
        >
          In Practice
        </h1>
      </div>
      {/* Subtitle */}
      <div className="overflow-hidden mt-4">
        <p className="reveal-text text-xs md:text-sm tracking-[0.25em] uppercase text-neutral-400 text-center">
          Est. 1985 — Boutique Law Firm
        </p>
      </div>
    </div>
  )
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery() {
  const [img1, img2, hero, img4, img5] = IMAGES

  return (
    <div
      id="image-container"
      className="relative w-[90%] flex justify-center items-center h-full"
    >
      {/* Image 1 — hidden on mobile */}
      <img
        src={img1}
        alt="gallery 1"
        className={`${IMG_CLASS} image-overlay hidden md:block`}
      />
      {/* Image 2 */}
      <img
        src={img2}
        alt="gallery 2"
        className={`${IMG_CLASS} image-overlay`}
      />
      {/* Hero center image */}
      <img
        src={hero}
        alt="hero"
        id="hero-image"
        className={IMG_CLASS}
      />
      {/* Image 4 */}
      <img
        src={img4}
        alt="gallery 4"
        className={`${IMG_CLASS} image-overlay`}
      />
      {/* Image 5 — hidden on mobile */}
      <img
        src={img5}
        alt="gallery 5"
        className={`${IMG_CLASS} image-overlay hidden md:block`}
      />

      {/* Black overlay — lifts up at end */}
      <div
        id="bg-overlay"
        className="absolute inset-0 bg-neutral-900 origin-top z-20"
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PageReveal() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Match media — restarts animation on screen size change
      const mm = gsap.matchMedia()

      const runAnimation = (isMobile: boolean) => {
        // Grab elements
        const container = document.getElementById('image-container') as HTMLElement
        const hero = document.getElementById('hero-image') as HTMLElement
        const allImgs = gsap.utils.toArray<HTMLElement>('.img')
        const overlays = gsap.utils.toArray<HTMLElement>('.image-overlay')
        const bg = document.getElementById('bg-overlay') as HTMLElement

        // Filter only visible images (offsetWidth > 0 excludes hidden ones on mobile)
        const visibleImgs = allImgs.filter((el) => el.offsetWidth > 0)
        const visibleOverlays = overlays.filter((el) => el.offsetWidth > 0)

        if (!container || !hero || !visibleImgs.length) return

        // ── Calculations ──────────────────────────────────────────────────────
        const imgWidth = visibleImgs[0].clientWidth
        const winWidth = window.innerWidth

        // Hero final width: 80% on mobile, 25% on desktop
        const heroWidth = isMobile ? winWidth * 0.8 : winWidth * 0.25

        // Dynamic gap between images
        const totalImgWidth = visibleImgs.length * imgWidth
        const remainingSpace = container.clientWidth - totalImgWidth
        const gap = Math.max(0, remainingSpace / (visibleImgs.length - 1))

        // ── Initial state ─────────────────────────────────────────────────────
        gsap.set(container, { gap: `${gap}px` })

        gsap.set(visibleImgs, {
          y: 60,
          opacity: 0,
          clipPath: 'inset(0 0 0 0)',
        })

        gsap.set('.reveal-text', { yPercent: 120 })

        // ── Timeline ──────────────────────────────────────────────────────────
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        // 1. Images rise up with stagger
        tl.to(visibleImgs, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
        })

        // 2. Container gap shrinks — images come together
        tl.to(
          container,
          {
            gap: `${imgWidth * 0.4}px`,
            duration: 1.2,
            ease: 'power3.inOut',
          },
          '+=0.3'
        )

        // 3. Images scale up slightly at the same time
        tl.to(
          visibleImgs,
          {
            scale: 1.2,
            duration: 1.2,
            ease: 'power3.inOut',
          },
          '<'
        )

        // 4. Overlay images clip away (hide with clip-path)
        tl.to(
          visibleOverlays,
          {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.9,
            stagger: 0.06,
            ease: 'power3.inOut',
          },
          '+=0.4'
        )

        // 5. Hero image expands to full width
        tl.to(
          hero,
          {
            width: heroWidth,
            maxWidth: 'none',
            scale: 1,
            duration: 1.6,
            ease: 'power3.inOut',
          },
          '-=0.3'
        )

        // 6. Black overlay slides up (revealing text beneath)
        tl.to(
          bg,
          {
            scaleY: 0,
            transformOrigin: 'top center',
            duration: 1,
            ease: 'power3.inOut',
          },
          '-=0.8'
        )

        // 7. Text reveals from bottom
        tl.to(
          '.reveal-text',
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.6'
        )
      }

      // Desktop
      mm.add('(min-width: 768px)', () => {
        runAnimation(false)
      })

      // Mobile
      mm.add('(max-width: 767px)', () => {
        runAnimation(true)
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden flex justify-center items-center"
      style={{
        background: 'linear-gradient(to top, #d4e8c2 0%, #ffffff 60%)',
      }}
    >
      <Nav />
      <ImageGallery />
      <HeroText />
    </div>
  )
}