"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function TextImageBlock({ value }: any) {
  const isLeft = value.layout === "left";

  // Use state to store the image height
  const [imageHeight, setImageHeight] = useState<string>(value.height);

  // Effect to safely access window after component is mounted
  useEffect(() => {
    // Set image height based on screen size
    setImageHeight(window.innerWidth < 768 ? "100%" : value.height);

    // Optional: Add resize listener to update height on window resize
    const handleResize = () => {
      setImageHeight(window.innerWidth < 768 ? "100%" : value.height);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [value.height]);

  const tagStyles: { [key: string]: string } = {
    h1: "leading-[130%] text-[7vw] md:text-[2.3vw] font-medium mb-[8vw] md:mb-[1.8vw]",
    h2: "leading-[130%] text-[7vw] md:text-[2.3vw] font-medium mb-[8vw] md:mb-[1.8vw]",
    h3: "leading-[130%] text-[7vw] md:text-[2.3vw] font-medium mb-[8vw] md:mb-[1.8vw]",
    h4: "leading-[130%] text-[7vw] md:text-[2.3vw] font-medium mb-[8vw] md:mb-[1.8vw]",
    h5: "leading-[130%] text-[7vw] md:text-[2.3vw] font-medium mb-[8vw] md:mb-[1.8vw]",
    h6: "leading-[130%] text-[5vw] md:text-[1.6vw] font-medium mb-[3vw] md:mb-[0.8vw]",
    p: "leading-[130%] text-[5vw] md:text-[1.6vw] leading-[170%] md:mb-[1vw] mb-[4vw]",
    FirstLi:
      "leading-[130%] text-[5vw] md:text-[1.6vw] leading-[170%] md:mt-[2vw] mt-[4vw] md:mb-[0.5vw] mb-[2vw] flex items-start",
    li: "leading-[130%] text-[5vw] md:text-[1.6vw] leading-[170%] md:mb-[0.5vw] mb-[2vw] flex items-start",
  };

  // Check if image is a GIF
  const isGif =
    value.image && value.image.asset.url.toLowerCase().endsWith(".gif");

  return (
    <div className="flex flex-col md:flex-row items-center md:my-[3vw] my-[5vw] gap-8 editor-content">
      {/* On desktop: show image on left if layout is left */}
      {isLeft && value.image && (
        <div className="hidden md:block md:w-1/2">
          {isGif ? (
            <img
              src={value.image.asset.url}
              alt=""
              className={`rounded-lg shadow-md object-cover w-full`}
              style={{
                height: imageHeight,
              }}
            />
          ) : (
            <Image
              src={value.image.asset.url}
              alt=""
              width={600}
              height={600}
              className={`rounded-lg shadow-md object-cover w-full`}
              style={{
                height: imageHeight,
              }}
              loading="lazy" // Lazy load images for performance
              placeholder="blur" // Show blur placeholder while loading
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJJgNn7mzjMAAAAABJRU5ErkJggg==" // Base64 encoded tiny placeholder
            />
          )}
        </div>
      )}

      <div className="w-full md:w-1/2">
        {value.text &&
          value.text.map((item: any, index: number) => {
            const Tag = item.tag || "p"; // Default to <p> if tag missing
            const style = tagStyles[Tag] || tagStyles["p"]; // Fallback to p-style if unknown tag

            if (Tag === "FirstLi" || Tag === "li") {
              return (
                <li key={index} className={`font-newsreader ${style}`}>
                  <Image
                    src="/icons/tick.svg"
                    alt="Bullet point"
                    width={20}
                    height={20}
                    className="md:mr-[1vw] mr-[4vw] mt-[1vw] md:mt-[0.5vw] w-[6vw] h-[6vw] md:w-[1.5vw] md:h-[1.5vw]"
                    loading="lazy" // Lazy load images for performance
                    placeholder="blur" // Show blur placeholder while loading
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJJgNn7mzjMAAAAABJRU5ErkJggg==" // Base64 encoded tiny placeholder
                  />
                  <span>{item.content}</span>
                </li>
              );
            }

            return (
              <Tag key={index} className={`font-newsreader ${style}`}>
                {item.content}
              </Tag>
            );
          })}
      </div>

      {/* On desktop: show image on right if layout is not left */}
      {!isLeft && value.image && (
        <div className="hidden md:block md:w-1/2">
          {isGif ? (
            <img
              src={value.image.asset.url}
              alt=""
              className={`rounded-lg shadow-md object-cover w-full`}
              style={{
                height: imageHeight,
              }}
            />
          ) : (
            <Image
              src={value.image.asset.url}
              alt=""
              width={600}
              height={600}
              className={`rounded-lg shadow-md object-cover w-full`}
              style={{
                height: imageHeight,
              }}
              loading="lazy" // Lazy load images for performance
              placeholder="blur" // Show blur placeholder while loading
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJJgNn7mzjMAAAAABJRU5ErkJggg==" // Base64 encoded tiny placeholder
            />
          )}
        </div>
      )}

      {/* On mobile: always show image below text regardless of layout */}
      {value.image && (
        <div className="w-full md:hidden">
          {isGif ? (
            <img
              src={value.image.asset.url}
              alt=""
              className={`rounded-lg shadow-md object-cover w-full`}
              style={{
                height: imageHeight,
              }}
            />
          ) : (
            <Image
              src={value.image.asset.url}
              alt=""
              width={600}
              height={600}
              className={`rounded-lg shadow-md object-cover w-full`}
              style={{
                height: imageHeight,
              }}
              loading="lazy" // Lazy load images for performance
              placeholder="blur" // Show blur placeholder while loading
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJJgNn7mzjMAAAAABJRU5ErkJggg==" // Base64 encoded tiny placeholder
            />
          )}
        </div>
      )}
    </div>
  );
}
