// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { gsap } from "gsap";
// import RichEditor from "../rich-editor";
// import { CaseStudy } from "@/types/interface";
// import { useLocale } from "@/lib/i18n/context";

// interface CaseStudyModalProps {
//   isOpen: boolean;
//   onClose: (e?: React.MouseEvent) => void;
//   onAnimationComplete: () => void;
//   caseStudy: CaseStudy;
//   clickedItemRect: DOMRect | null;
//   clickedImageRect: DOMRect | null;
//   clickedIndex: number;
//   setIsAnimating: (isAnimating: boolean) => void;
// }

// const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
//   isOpen,
//   onClose,
//   onAnimationComplete,
//   caseStudy,
//   clickedItemRect,
//   clickedImageRect,
//   clickedIndex,
//   setIsAnimating,
// }) => {
//   const { locale } = useLocale();
//   const popupRef = useRef<HTMLDivElement | null>(null);
//   const contentRef = useRef<HTMLDivElement | null>(null);
//   const heroImageRef = useRef<HTMLImageElement | null>(null);
//   const clonedImageRef = useRef<HTMLImageElement | null>(null);
//   const detailCardRef = useRef<HTMLDivElement | null>(null);
//   const lenisRef = useRef<any>(null);
//   const [animationComplete, setAnimationComplete] = useState(false);
//   const [showCloseButton, setShowCloseButton] = useState(false);
//   const [isContentLoading, setIsContentLoading] = useState(false);
//   const [caseStudyContent, setCaseStudyContent] = useState<any>(null);
//   const [mobileImageHeight, setMobileImageHeight] = useState<string>("70vh");
//   // Fetch case study content when modal opens
//   useEffect(() => {
//     if (!isOpen || !caseStudy) return;

//     // If content already exists (from solution query), use it
//     if (
//       caseStudy.content &&
//       Array.isArray(caseStudy.content) &&
//       caseStudy.content.length > 0
//     ) {
//       setCaseStudyContent(caseStudy.content);
//       setIsContentLoading(false);
//       return;
//     }

//     // Otherwise, fetch content
//     setIsContentLoading(true);
//     const fetchContent = async () => {
//       try {
//         const content = await getCaseStudyContentBySlug(caseStudy.slug, locale);
//         setCaseStudyContent(content?.content || null);
//       } catch (error) {
//         console.error("Error fetching case study content:", error);
//         setCaseStudyContent(null);
//       } finally {
//         setIsContentLoading(false);
//       }
//     };

//     fetchContent();
//   }, [isOpen, caseStudy, locale]);

//   // Initialize Lenis for scrolling - desktop only, but with better timing
//   useEffect(() => {
//     let caseStudyLenisRef: any = null;

//     // Only initialize after content is ready and animation is complete
//     if (!isOpen || !animationComplete) return;

//     // Check if we're on desktop (not mobile)
//     const isDesktop = window.innerWidth > 768;

//     // Only initialize Lenis on desktop
//     if (isDesktop && popupRef.current && contentRef.current) {
//       // Small delay to ensure DOM is fully rendered
//       const timer = setTimeout(() => {
//         import("@studio-freight/lenis").then(({ default: Lenis }) => {
//           if (!popupRef.current || !contentRef.current) return;

//           // Create a new Lenis instance for case study scrolling
//           caseStudyLenisRef = new Lenis({
//             wrapper: popupRef.current as HTMLElement,
//             content: contentRef.current as HTMLElement,
//             lerp: 0.09,
//             smoothWheel: true,
//             duration: 1,
//             easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//             orientation: "vertical",
//             gestureOrientation: "vertical",
//             touchMultiplier: 2,
//             infinite: false,
//           });

//           // Store reference for cleanup
//           lenisRef.current = caseStudyLenisRef;

//           // Raf loop for the lenis instance
//           function raf(time: number) {
//             if (caseStudyLenisRef && lenisRef.current) {
//               caseStudyLenisRef.raf(time);
//               requestAnimationFrame(raf);
//             }
//           }

//           requestAnimationFrame(raf);

//           // Reset scroll position to top after initialization
//           setTimeout(() => {
//             if (caseStudyLenisRef) {
//               caseStudyLenisRef.scrollTo(0, { immediate: true });
//             }
//           }, 100);
//         });
//       }, 100);

//       return () => {
//         clearTimeout(timer);
//       };
//     }

//     // Clean up Lenis instance when case study closes
//     return () => {
//       if (caseStudyLenisRef) {
//         caseStudyLenisRef.destroy();
//         caseStudyLenisRef = null;
//       }
//       if (lenisRef.current) {
//         lenisRef.current = null;
//       }
//     };
//   }, [isOpen, animationComplete]);

//   // Initialize animation for opening
//   useEffect(() => {
//     // Reset animation state
//     setAnimationComplete(false);

//     // Clean up function for unmounting
//     const cleanup = () => {
//       if (clonedImageRef.current) {
//         clonedImageRef.current.remove();
//         clonedImageRef.current = null;
//       }
//       setIsAnimating(false);
//     };

//     if (
//       !isOpen ||
//       !popupRef.current ||
//       !contentRef.current ||
//       !heroImageRef.current
//     ) {
//       cleanup();
//       return cleanup;
//     }

//     // Check if we're on mobile
//     const mobile = window.innerWidth <= 768;

//     // Don't lock body scroll on mobile
//     if (!mobile) {
//       document.body.style.overflow = "hidden";
//     }

//     // Reset the opacity and display state of the modal
//     popupRef.current.style.display = "block";
//     popupRef.current.style.opacity = "0";
//     contentRef.current.style.opacity = "0";
//     contentRef.current.style.transform = "translateY(20px)";
//     setShowCloseButton(false);

//     // Calculate dynamic image height on mobile based on card height
//     if (mobile) {
//       // Wait for card to render, then calculate height
//       requestAnimationFrame(() => {
//         requestAnimationFrame(() => {
//           if (detailCardRef.current) {
//             const cardHeight = detailCardRef.current.offsetHeight;
//             const viewportHeight = window.innerHeight;
//             const calculatedImageHeight = viewportHeight - cardHeight;
//             setMobileImageHeight(`${calculatedImageHeight}px`);

//             // Apply to hero image
//             if (heroImageRef.current) {
//               heroImageRef.current.style.height = `${calculatedImageHeight}px`;
//             }
//           }
//         });
//       });
//     } else {
//       // Reset to default on desktop
//       setMobileImageHeight("70vh");
//     }

//     // Only create cloned image if we have clickedImageRect
//     if (clickedImageRect) {
//       // Create cloned image for transition
//       const clonedImage = document.createElement("img");
//       clonedImage.src = caseStudy.featuredImage.asset.url;
//       clonedImage.alt = caseStudy.name;
//       clonedImage.style.position = "fixed";
//       clonedImage.style.zIndex = "130";
//       clonedImage.style.top = `${clickedImageRect.top}px`;
//       clonedImage.style.left = `${clickedImageRect.left}px`;
//       clonedImage.style.width = `${clickedImageRect.width}px`;
//       clonedImage.style.height = `${clickedImageRect.height}px`;
//       clonedImage.style.objectFit = "cover";

//       // Append to body and store ref
//       document.body.appendChild(clonedImage);
//       clonedImageRef.current = clonedImage;

//       // Initially hide the actual hero image
//       heroImageRef.current.style.opacity = "0";

//       // Wait a frame to ensure everything is rendered
//       requestAnimationFrame(() => {
//         // Get hero image final position
//         const heroRect = heroImageRef.current?.getBoundingClientRect();

//         if (!heroRect) {
//           cleanup();
//           return;
//         }

//         // On mobile, use calculated height for cloned image animation
//         let finalHeight = heroRect.height;
//         if (mobile && detailCardRef.current) {
//           const cardHeight = detailCardRef.current.offsetHeight;
//           const viewportHeight = window.innerHeight;
//           finalHeight = viewportHeight - cardHeight;
//         }

//         // Create animation timeline
//         const openTimeline = gsap.timeline({
//           onComplete: () => {
//             // Remove cloned image
//             if (clonedImageRef.current) {
//               clonedImageRef.current.remove();
//               clonedImageRef.current = null;
//             }

//             // Show actual hero image
//             if (heroImageRef.current) {
//               heroImageRef.current.style.opacity = "1";
//               setShowCloseButton(true);
//             }

//             // Animation complete, reset flag and mark as complete
//             setIsAnimating(false);
//             setAnimationComplete(true);

//             // Reset scroll position
//             if (popupRef.current) {
//               popupRef.current.scrollTop = 0;
//             }
//           },
//         });

//         // First fade in the modal container
//         openTimeline.to(popupRef.current, {
//           opacity: 1,
//           duration: 0.3,
//           ease: "power2.inOut",
//         });

//         // Then animate the image from thumbnail to hero position
//         openTimeline.to(
//           clonedImage,
//           {
//             top: 0,
//             left: 0,
//             width: window.innerWidth,
//             height: finalHeight,
//             duration: 0.5,
//             ease: "power2.inOut",
//           },
//           "-=0.1"
//         );

//         // Finally fade in the content
//         openTimeline.to(
//           contentRef.current,
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.4,
//             ease: "power2.out",
//           },
//           "-=0.2"
//         );
//       });
//     } else {
//       // If no clickedImageRect (e.g. direct URL access), just fade in the modal
//       gsap.to(popupRef.current, {
//         opacity: 1,
//         duration: 0.3,
//         ease: "power2.inOut",
//         onComplete: () => {
//           // Show the hero image
//           if (heroImageRef.current) {
//             heroImageRef.current.style.opacity = "1";
//             setShowCloseButton(true);
//           }
//         },
//       });

//       // And fade in the content
//       gsap.to(contentRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.4,
//         ease: "power2.out",
//         delay: 0.2,
//         onComplete: () => {
//           setIsAnimating(false);
//           setAnimationComplete(true);
//         },
//       });
//     }

//     return cleanup;
//   }, [isOpen, clickedImageRect, caseStudy, setIsAnimating]);

//   // Handle closing animation
//   const handleClose = (e?: React.MouseEvent) => {
//     if (e) {
//       e.stopPropagation(); // Prevent event from bubbling
//     }

//     // Hide close button immediately
//     setShowCloseButton(false);

//     // Cleanup Lenis before closing
//     if (lenisRef.current) {
//       lenisRef.current.destroy();
//       lenisRef.current = null;
//     }

//     if (!popupRef.current || !heroImageRef.current) {
//       // If we don't have the necessary refs, just clean up and close
//       onAnimationComplete();
//       onClose(e);
//       return;
//     }

//     // Handle case where we don't have clickedImageRect (direct URL access or missing data)
//     if (!clickedImageRect || !contentRef.current) {
//       // Just fade out the modal without the hero animation
//       gsap.to(popupRef.current, {
//         opacity: 0,
//         duration: 0.3,
//         ease: "power2.in",
//         onComplete: () => {
//           if (popupRef.current) {
//             popupRef.current.style.display = "none";
//           }
//           document.body.style.overflow = "auto";
//           onAnimationComplete();
//           onClose(e);
//         },
//       });
//       return;
//     }

//     // Get current hero image position - it's at the top of the viewport
//     // Create cloned image for closing transition
//     const clonedImage = document.createElement("img");
//     clonedImage.src = caseStudy.featuredImage.asset.url;
//     clonedImage.alt = caseStudy.name;
//     clonedImage.style.position = "fixed";
//     clonedImage.style.zIndex = "130";
//     clonedImage.style.top = "0";
//     clonedImage.style.left = "0";
//     clonedImage.style.width = `${window.innerWidth}px`;
//     clonedImage.style.height = `${heroImageRef.current.getBoundingClientRect().height}px`;
//     clonedImage.style.objectFit = "cover";

//     // Append to body and store ref
//     document.body.appendChild(clonedImage);
//     clonedImageRef.current = clonedImage;

//     // Hide the actual hero image
//     heroImageRef.current.style.opacity = "0";

//     // Create closing timeline
//     const closeTimeline = gsap.timeline({
//       onComplete: () => {
//         // Remove cloned image
//         if (clonedImageRef.current) {
//           clonedImageRef.current.remove();
//           clonedImageRef.current = null;
//         }

//         // Hide modal
//         if (popupRef.current) {
//           popupRef.current.style.display = "none";
//         }

//         // Re-enable scrolling
//         document.body.style.overflow = "auto";

//         // Call complete handlers
//         onAnimationComplete();
//         onClose(e);
//       },
//     });

//     // First fade out the content
//     closeTimeline.to(contentRef.current, {
//       opacity: 0,
//       y: 20,
//       duration: 0.3,
//       ease: "power2.in",
//     });

//     // Then animate the image back to thumbnail position
//     closeTimeline.to(clonedImage, {
//       top: clickedImageRect.top,
//       left: clickedImageRect.left,
//       width: clickedImageRect.width,
//       height: clickedImageRect.height,
//       duration: 0.5,
//       ease: "power2.inOut",
//     });

//     // Finally fade out the modal
//     closeTimeline.to(
//       popupRef.current,
//       {
//         opacity: 0,
//         duration: 0.3,
//         ease: "power2.in",
//       },
//       "-=0.2"
//     );
//   };

//   // Handle escape key for closing
//   useEffect(() => {
//     const handleEscKey = (event: KeyboardEvent) => {
//       if (event.key === "Escape" && isOpen) {
//         handleClose();
//       }
//     };

//     document.addEventListener("keydown", handleEscKey);
//     return () => document.removeEventListener("keydown", handleEscKey);
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div
//       ref={popupRef}
//       className="fixed inset-0 z-[120] bg-background overflow-y-auto"
//       style={{
//         display: "none", // Will be shown by animation
//         opacity: 0,
//         WebkitOverflowScrolling: "touch",
//         overscrollBehavior: "contain",
//         // Remove fixed height constraints
//         minHeight: "100vh",
//       }}
//       onClick={(e) => e.target === e.currentTarget && handleClose(e)}
//     >
//       {showCloseButton && (
//         <button
//           onClick={(e) => handleClose(e)}
//           className="cursor-pointer fixed md:top-0 top-4 md:left-0 right-4 z-[130] w-fit"
//           aria-label="Close case study"
//         >
//           <Image
//             src="/icons/close.svg"
//             alt="Close"
//             width={42}
//             height={42}
//             className="w-16 h-16 md:w-40 md:h-40 text-shadow"
//           />
//         </button>
//       )}

//       <div
//         ref={contentRef}
//         className="w-full opacity-0"
//         style={{
//           transform: "translateY(20px)",
//           // Ensure content can expand naturally
//           minHeight: "100vh",
//         }}
//       >
//         {/* header*/}
//         <div className="relative min-h-dvh">
//           <img
//             ref={heroImageRef}
//             src={caseStudy.featuredImage.asset.url}
//             alt={caseStudy.name}
//             className="w-full md:min-h-dvh object-cover"
//             style={{
//               opacity: 0,
//               position: "relative",
//               top: 0,
//               height: mobileImageHeight,
//             }} // Initially hidden for animation
//           />
//           {/* details */}
//           <div
//             ref={detailCardRef}
//             className="z-[70]  absolute bottom-0 left-0 w-full bg-background grid grid-cols-1 md:grid-cols-3 items-center justify-center border-b-[1px] border-[#433E3E]

//             "
//           >
//             <div className="flex flex-col items-center justify-center px-[2wv] md:py-[3.8vw] py-[7vw] border-b-[1px] md:border-b-0 border-[#433E3E] md:border-r-[1px]">
//               <div className="flex flex-col items-center md:gap-[1vw] gap-[1.4vw] w-fit px-[2vw]">
//                 <p className="md:text-[2vw] text-[6vw] font-[600] text-center">
//                   {caseStudy.name}
//                 </p>
//                 <p className="md:text-[1.3vw] text-[4vw] text-center">
//                   {caseStudy.categories
//                     ?.map((category) => category.name)
//                     .join(", ")}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center justify-center px-[4wv] md:px-[3vw] md:py-[3.8vw] py-[8vw] relative border-b-[1px] md:border-b-0 border-[#433E3E] md:border-r-[1px] max-h-[160px] md:max-h-full h-full">
//               <div className="w-full h-[19vw] md:h-[6vw] px-[2vw] flex items-center justify-center">
//                 <Image
//                   src={caseStudy.logo.asset.url}
//                   alt={caseStudy.name || ""}
//                   width={600}
//                   height={600}
//                   className="max-h-full max-w-full object-contain"
//                   sizes="(max-width: 768px) 100vw, 1200px"
//                 />
//               </div>
//             </div>
//             <div className="flex flex-col items-center px-[2wv] md:py-[4vw] py-[9vw]">
//               <div className="flex flex-col items-center md:items-start gap-[0.7vw] w-fit">
//                 <p className="md:text-[1.5vw] text-[5vw] text-center px-[2vw]">
//                   {caseStudy.location}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <article className="pb-[25vw] md:pb-[10vw] md:mt-[8vw] mt-[20vw] poppins">
//           {isContentLoading ? (
//             <div className="space-y-4 editor-content">
//               <div className="h-8 bg-foreground/5 animate-pulse rounded w-3/4"></div>
//               <div className="h-4 bg-foreground/5 animate-pulse rounded w-full"></div>
//               <div className="h-4 bg-foreground/5 animate-pulse rounded w-5/6"></div>
//               <div className="h-4 bg-foreground/5 animate-pulse rounded w-4/5"></div>
//               <div className="h-64 bg-foreground/5 animate-pulse rounded w-full mt-8"></div>
//             </div>
//           ) : (
//             <RichEditor content={caseStudyContent || caseStudy.content} />
//           )}
//         </article>
//       </div>
//     </div>
//   );
// };

// export default CaseStudyModal;
