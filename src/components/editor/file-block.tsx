"use client";

import Image from "next/image";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { WEBSITE_URL } from "@/constant/variabls";

export default function FileBlock({ value }: any) {
  const pathname = usePathname();
  const pageUrl = `${WEBSITE_URL}${pathname}`;
  const videoProps = {
    loop: value.loop,
    muted: value.muted,
    autoPlay: value.autoplay,
  };

  const fileUrl = value.file?.asset?.url;
  if (!fileUrl) return <p>File not available</p>;

  // Determine file type based on extension
  const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
  const isVideo = ["mp4", "webm", "ogg", "mov"].includes(fileExtension);
  const isImage = ["jpg", "jpeg", "png", "webp", "svg"].includes(fileExtension);
  const isGif = fileExtension === "gif";

  // Generate VideoObject JSON-LD if video has metadata
  const videoUrl = value.videoUrl || (isVideo ? fileUrl : null);
  const hasVideoMetadata =
    isVideo && (value.videoTitle || value.videoDescription);
  const videoJsonLd =
    hasVideoMetadata && videoUrl
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: value.videoTitle || "Video content",
          description: value.videoDescription || "Video content",
          thumbnailUrl: [
            value.videoThumbnail?.asset?.url || `${WEBSITE_URL}/logo.webp`,
          ],
          contentUrl: videoUrl,
          embedUrl: pageUrl,
          uploadDate: value.videoUploadDate
            ? new Date(value.videoUploadDate).toISOString()
            : new Date().toISOString(),
          duration: value.videoDuration
            ? `PT${value.videoDuration}S`
            : undefined,
          publisher: {
            "@type": "Organization",
            name: "Figmenta Studio",
            logo: {
              "@type": "ImageObject",
              url: `${WEBSITE_URL}/logo.webp`,
            },
          },
        }
      : null;

  // Use custom height if provided, otherwise default to md:h-[15vw]
  const heightClass = value.height ? `md:h-[${value.height}]` : "md:h-[16vw]";

  const commonClasses = `
        object-contain rounded-md w-full md:w-fit md:max-w-[85vw] mx-auto
        ${heightClass} h-full
    `;

  return (
    <>
      {videoJsonLd && (
        <Script
          id={`video-jsonld-${fileUrl}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
        />
      )}
      {isVideo && (
        <video
          {...videoProps}
          src={fileUrl}
          className={commonClasses}
          controls={!videoProps.autoPlay}
        />
      )}
      {isGif && (
        <img src={fileUrl} alt="Content image" className={commonClasses} />
      )}
      {isImage && (
        <Image
          src={fileUrl}
          alt="Content image"
          width={600}
          height={600}
          priority
          className={commonClasses}
          loading="lazy" // Lazy load images for performance
          placeholder="blur" // Show blur placeholder while loading
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJJgNn7mzjMAAAAABJRU5ErkJggg==" // Base64 encoded tiny placeholder
        />
      )}
      {!isVideo && !isImage && !isGif && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center"
        >
          Download file
        </a>
      )}
    </>
  );
}
