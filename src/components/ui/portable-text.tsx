"use client";

import { urlFor } from "@/lib/sanity/client";
import Image from "next/image";

interface PortableTextProps {
  value: any;
}

export function PortableText({ value }: PortableTextProps) {
  if (!value || !Array.isArray(value)) {
    return null;
  }

  return (
    <>
      {value.map((block, index) => {
        // Handle different block types
        if (block._type === 'block') {
          // Text block
          return renderTextBlock(block, index);
        } else if (block._type === 'image') {
          // Image block
          return renderImageBlock(block, index);
        }
        
        // Default fallback
        return <div key={index}>Unsupported block type: {block._type}</div>;
      })}
    </>
  );
}

// Function to render text blocks based on style
function renderTextBlock(block: any, index: number) {
  // Get the text content from spans
  const text = block.children
    .map((span: any) => span.text)
    .join('');

  // Handle different styles
  switch (block.style) {
    case 'h1':
      return <h1 key={index}>{text}</h1>;
    case 'h2':
      return <h2 key={index}>{text}</h2>;
    case 'h3':
      return <h3 key={index}>{text}</h3>;
    case 'h4':
      return <h4 key={index}>{text}</h4>;
    case 'blockquote':
      return <blockquote key={index}>{text}</blockquote>;
    default:
      return <p key={index}>{text}</p>;
  }
}

// Function to render image blocks
function renderImageBlock(block: any, index: number) {
  if (!block.asset) {
    return null;
  }

  const imageUrl = urlFor(block).width(1200).url();
  
  return (
    <div key={index} className="my-8 relative aspect-video w-full overflow-hidden rounded-lg">
      <Image
        src={imageUrl}
        alt={block.alt || 'Case study image'}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 1200px"
      />
    </div>
  );
} 