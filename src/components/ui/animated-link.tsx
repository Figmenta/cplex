"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface AnimatedLinkProps {
  href: string;
  label: string;
  external?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedLink({ 
  href, 
  label, 
  external = false,
  className = "",
  onClick
}: AnimatedLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`text-[20px] lg:text-[0.990rem]  leading-normal whitespace-nowrap transition-opacity relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {label}
      <motion.div
        initial={{ width: "0%" }}
        animate={{
          width: isHovered ? "100%" : "0%",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="h-[0.15vw] bg-foreground absolute bottom-0 left-0"
      />
    </Link>
  );
}

