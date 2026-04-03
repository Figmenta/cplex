"use client";

import { useEffect, useRef } from "react";
import { urlFor } from "@/lib/sanity/client";
import gsap from "gsap";
import Image from "next/image";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { WEBSITE_URL } from "@/constant/variabls";

interface ImageCarouselBlockProps {
  value: {
    media: Array<{
      _type: "image" | "file" | "carouselMediaItem";
      asset?: {
        _ref?: string;
        url?: string;
      };
      file?: {
        asset?: {
          url?: string;
        };
      };
      videoTitle?: string;
      videoDescription?: string;
      videoThumbnail?: {
        asset?: {
          url?: string;
        };
      };
      videoDuration?: number;
      videoUploadDate?: string;
      videoUrl?: string;
    }>;
  };
}

export default function ImageCarouselBlock({ value }: ImageCarouselBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const pageUrl = `${WEBSITE_URL}${pathname}`;

  // Double the media array for seamless looping
  const doubledMedia = [...value.media, ...value.media];

  // Generate VideoObject JSON-LD for videos with metadata
  const videoJsonLdArray = value.media
    .map((item, index) => {
      if (item._type !== "carouselMediaItem") return null;

      const fileUrl = item.file?.asset?.url;
      if (!fileUrl) return null;

      const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
      const isVideo = ["mp4", "webm", "ogg", "mov"].includes(
        fileExtension || ""
      );

      if (!isVideo) return null;

      const videoUrl = item.videoUrl || fileUrl;
      const hasMetadata = item.videoTitle || item.videoDescription;

      if (!hasMetadata) return null;

      return {
        id: `carousel-video-jsonld-${fileUrl}-${index}`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: item.videoTitle || "Video content",
          description: item.videoDescription || "Video content",
          thumbnailUrl: [
            item.videoThumbnail?.asset?.url || `${WEBSITE_URL}/logo.png`,
          ],
          contentUrl: videoUrl,
          embedUrl: pageUrl,
          uploadDate: item.videoUploadDate
            ? new Date(item.videoUploadDate).toISOString()
            : new Date().toISOString(),
          duration: item.videoDuration ? `PT${item.videoDuration}S` : undefined,
          publisher: {
            "@type": "Organization",
            name: "Figmenta Studio",
            logo: {
              "@type": "ImageObject",
              url: `${WEBSITE_URL}/logo.png`,
            },
          },
        },
      };
    })
    .filter((item): item is { id: string; jsonLd: any } => item !== null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalWidth = containerRef.current?.scrollWidth || 0;
      const containerWidth = containerRef.current?.offsetWidth || 0;

      // Calculate duration based on number of images
      const duration = doubledMedia.length <= 10 ? 10 : 20;

      gsap.to(containerRef.current, {
        x: `-${totalWidth / 2}px`,
        duration: duration,
        ease: "none",
        repeat: -1,
        runBackwards: false,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {videoJsonLdArray.map(({ id, jsonLd }) => (
        <Script
          key={id}
          id={id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
      <div className="w-full py-[1vw]">
        <div ref={containerRef} className="flex gap-[1vw] w-full ">
          {doubledMedia.map((item, i) => {
            const url =
              item.asset?.url ||
              item.file?.asset?.url ||
              (item.asset?._ref ? urlFor(item.asset).url() : "");

            if (item._type === "image") {
              return (
                <Image
                  key={i}
                  src={url}
                  alt="carousel-img"
                  width={500}
                  height={300}
                  className="shadow w-full h-auto object-cover md:max-h-[30vw] max-h-[50vw]"
                  loading="lazy" // Lazy load images for performance
                  placeholder="blur" // Show blur placeholder while loading
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJJgNn7mzjMAAAAABJRU5ErkJggg==" // Base64 encoded tiny placeholderz
                />
              );
            } else if (item._type === "file" && url) {
              return (
                <video
                  key={i}
                  src={url}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="shadow w-[100%] h-auto object-cover md:max-h-[30vw] max-h-[50vw]"
                />
              );
            } else if (item._type === "carouselMediaItem" && url) {
              const fileExtension = url.split(".").pop()?.toLowerCase();
              const isVideo = ["mp4", "webm", "ogg", "mov"].includes(
                fileExtension || ""
              );

              if (isVideo) {
                return (
                  <video
                    key={i}
                    src={url}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="shadow w-[100%] h-auto object-cover md:max-h-[30vw] max-h-[50vw]"
                  />
                );
              } else {
                return (
                  <img
                    key={i}
                    src={url}
                    alt="carousel-media"
                    className="shadow w-full h-auto object-cover md:max-h-[30vw] max-h-[50vw]"
                  />
                );
              }
            }
          })}
        </div>
      </div>
    </>
  );
}
