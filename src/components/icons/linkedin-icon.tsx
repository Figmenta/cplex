"use client";

import Link from "next/link";
import { useState } from "react";

interface LinkedInIconProps {
  href: string;
  className?: string;
}

export default function LinkedInIcon({ href, className = "" }: LinkedInIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-[8vw] md:h-[2.5vw] h-[8vw] flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="138"
        height="136"
        viewBox="0 0 138 136"
        fill="none"
        className="w-full h-full"
      >
        <g clipPath="url(#clip0_11298_6673)">
          <path
            d="M7.66699 4.5H130.333C132.144 4.5 133.5 5.92984 133.5 7.55566V128.444C133.5 130.07 132.144 131.5 130.333 131.5H7.66699C5.85593 131.5 4.5 130.07 4.5 128.444V7.55566C4.5 5.92984 5.85593 4.5 7.66699 4.5Z"
            stroke="white"
            strokeWidth="10"
            fill="none"
          />
          <path
            d="M7.66699 4.5H130.333C132.144 4.5 133.5 5.92984 133.5 7.55566V128.444C133.5 130.07 132.144 131.5 130.333 131.5H7.66699C5.85593 131.5 4.5 130.07 4.5 128.444V7.55566C4.5 5.92984 5.85593 4.5 7.66699 4.5Z"
            fill="#0072B1"
            stroke="white"
            strokeWidth="10"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
            }}
          />
          <path 
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25.1823 52.6021H43.6264V111.086H25.1823V52.6021ZM34.4072 23.5302C40.3048 23.5302 45.0965 28.2524 45.0965 34.0645C45.0965 39.8823 40.3048 44.6064 34.4072 44.6064C32.986 44.633 31.5736 44.38 30.2527 43.8623C28.9318 43.3446 27.7288 42.5726 26.7142 41.5914C25.6995 40.6103 24.8936 39.4396 24.3434 38.1478C23.7932 36.8561 23.5098 35.4692 23.5098 34.0683C23.5098 32.6674 23.7932 31.2805 24.3434 29.9888C24.8936 28.6971 25.6995 27.5264 26.7142 26.5452C27.7288 25.564 28.9318 24.792 30.2527 24.2743C31.5736 23.7567 32.986 23.5037 34.4072 23.5302ZM55.1954 52.6002H72.8862V60.5921H73.1316C75.5945 55.9945 81.6109 51.1477 90.5828 51.1477C109.259 51.1477 112.709 63.2611 112.709 79.0088V111.086H94.2762V82.6449C94.2762 75.8638 94.1497 67.139 84.6929 67.139C75.0961 67.139 73.6222 74.5264 73.6222 82.1557V111.086H55.1935V52.6021L55.1954 52.6002Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_11298_6673">
            <rect width="138" height="136" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </Link>
  );
}
