"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { WEBSITE_URL } from "@/constant/variabls";
import Image from "next/image";

interface MediaFile {
  autoplay: boolean;
  rounded: boolean;
  file: {
    asset: {
      url: string;
    };
  };
  loop: boolean;
  muted: boolean;
  videoTitle?: string;
  videoDescription?: string;
  videoThumbnail?: {
    asset: {
      url: string;
    };
  };
  videoDuration?: number;
  videoUploadDate?: string;
  videoUrl?: string;
}

interface MediaBlockValue {
  files: MediaFile[];
  width: string;
  height: string;
  gap: string;
  justifyContent: "center" | "between";
}

// Video file types
const videoTypes = ["mp4", "webm", "ogg", "mov"];
// Image file types
const imageTypes = ["jpg", "jpeg", "png", "webp", "svg"];
// Gif type for special case
const gifType = "gif";

export default function MediaBlock({ value }: { value: MediaBlockValue }) {
  const { files, width, height, gap, justifyContent } = value;
  const pathname = usePathname();
  const pageUrl = `${WEBSITE_URL}${pathname}`;

  const containerStyle = {
    width: "100%",
    willChange: "transform" as const,
    backfaceVisibility: "hidden" as const,
    transform: "translateZ(0)",
  };

  const desktopContainerStyle = {
    width: width || "100%",
    gap: gap || "2vw",
    willChange: "transform" as const,
    backfaceVisibility: "hidden" as const,
    transform: "translateZ(0)",
  };

  // Generate VideoObject JSON-LD for videos with metadata
  const videoJsonLdArray = files
    .map((item, index) => {
      const fileUrl = item.file?.asset?.url;
      if (!fileUrl) return null;

      const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
      const isVideo = videoTypes.includes(fileExtension || "");

      if (!isVideo) return null;

      const videoUrl = item.videoUrl || fileUrl;
      const hasMetadata = item.videoTitle || item.videoDescription;

      if (!hasMetadata) return null;

      return {
        id: `video-jsonld-${fileUrl}-${index}`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: item.videoTitle || "Video content",
          description: item.videoDescription || "Video content",
          thumbnailUrl: [
            item.videoThumbnail?.asset?.url || `${WEBSITE_URL}/logo.webp`,
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
              url: `${WEBSITE_URL}/logo.webp`,
            },
          },
        },
      };
    })
    .filter((item): item is { id: string; jsonLd: any } => item !== null);

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
      <div
        className={` w-full my-[8vw] md:my-[4vw] flex flex-wrap justify-center gap-[4vw] md:gap-0 ${justifyContent === "between" ? "md:justify-between" : "md:justify-center"}`}
        style={containerStyle}
      >
        <div className="hidden md:flex  w-full " style={desktopContainerStyle}>
          {files &&
            files.map((item, index) => {
              const { file, autoplay, loop, muted } = item;

              if (!file || !file.asset || !file.asset.url) {
                return null;
              }

              const fileUrl = file.asset.url;
              const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
              const rounded = item.rounded || false;

              const desktopStyle = {
                maxHeight: height || "",
                // width: '100%',
                objectFit: "contain" as const,
              };

              if (videoTypes.includes(fileExtension || "")) {
                return (
                  <div
                    key={`media-desktop-${index}`}
                    className="w-fit mx-auto media-container flex justify-center items-center"
                  >
                    <video
                      src={fileUrl}
                      className={`${rounded ? "rounded-lg" : ""} video-element`}
                      style={{
                        ...desktopStyle,
                        contain: "content",
                        contentVisibility: "auto",
                      }}
                      autoPlay={autoplay}
                      loop={loop}
                      muted={muted}
                      controls={!autoplay}
                      playsInline
                      preload="auto"
                    />
                  </div>
                );
              } else if (fileExtension === gifType) {
                // Show .gif using <img>
                return (
                  <div
                    key={`media-desktop-${index}`}
                    className="w-fit mx-auto media-container flex justify-center items-center "
                  >
                    <img
                      src={fileUrl}
                      alt="Media content"
                      className={`${rounded ? "rounded-lg" : ""}`}
                      style={desktopStyle}
                    />
                  </div>
                );
              } else if (imageTypes.includes(fileExtension || "")) {
                return (
                  <div
                    key={`media-desktop-${index}`}
                    className="w-fit mx-auto  media-container flex justify-center items-center "
                  >
                    <Image
                      src={fileUrl}
                      alt="Media content"
                      className={`${rounded ? "rounded-lg" : ""}`}
                      style={desktopStyle}
                      loading="lazy" // Lazy load images for performance
                      width={600}
                      height={600}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    key={`media-desktop-${index}`}
                    className="media-container flex justify-center"
                  >
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Download File
                    </a>
                  </div>
                );
              }
            })}
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col w-full md:hidden">
          {files &&
            files.map((item, index) => {
              const { file, autoplay, loop, muted } = item;

              if (!file || !file.asset || !file.asset.url) {
                return null;
              }

              const fileUrl = file.asset.url;
              const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
              const rounded = item.rounded || false;

              const mobileStyle = {
                // maxHeight: '60vw',
                width: "100%",
                objectFit: "contain" as const,
              };

              if (videoTypes.includes(fileExtension || "")) {
                return (
                  <div
                    key={`media-mobile-${index}`}
                    className="media-container w-full"
                  >
                    <video
                      src={fileUrl}
                      className={`${rounded ? "rounded-lg" : ""}`}
                      style={mobileStyle}
                      autoPlay={autoplay}
                      loop={loop}
                      muted={muted}
                      controls={!autoplay}
                      playsInline
                    />
                  </div>
                );
              } else if (fileExtension === gifType) {
                // Show .gif as <img> on mobile
                return (
                  <div
                    key={`media-mobile-${index}`}
                    className="media-container w-full"
                  >
                    <img
                      src={fileUrl}
                      alt="Media content"
                      className={`${rounded ? "rounded-lg" : ""}`}
                      style={mobileStyle}
                    />
                  </div>
                );
              } else if (imageTypes.includes(fileExtension || "")) {
                return (
                  <div
                    key={`media-mobile-${index}`}
                    className="media-container w-full"
                  >
                    <img
                      src={fileUrl}
                      alt="Media content"
                      className={`${rounded ? "rounded-lg" : ""}`}
                      style={mobileStyle}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    key={`media-mobile-${index}`}
                    className="media-container w-full flex justify-center"
                  >
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-[4vw] py-[2vw] bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Download File
                    </a>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </>
  );
}
