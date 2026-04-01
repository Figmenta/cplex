import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { TypedObject } from "@portabletext/types";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import TextImageBlock from "./editor/text-image-block";
import ImageCarouselBlock from "./editor/image-carousel-block";
import React from "react";
import CenterTextBlock from "./editor/center-text-block";
import TitleBlock from "./editor/title-block";
import HowItWorks from "./editor/how-it-works";
import FileBlock from "./editor/file-block";
import MediaBlock from "./editor/media-block";

interface RichEditorProps {
  content: TypedObject | TypedObject[] | any;
}

export default function RichEditor({ content }: RichEditorProps) {
  const components: Partial<PortableTextReactComponents> = {
    types: {
      image: ({ value }: any) => (
        <Image
          src={value.asset.url}
          alt={value.alt || ""}
          width={800}
          height={500}
          className="editor-content my-[0.5vw] rounded-lg shadow-md object-cover w-full h-auto aspect-video object-center"
        />
      ),
      mediaBlock: ({ value }: any) => {
        return (
          <div className="editor-content media">
            <MediaBlock value={value} />
          </div>
        );
      },
      howItWorks: ({ value }: any) => {
        return <HowItWorks value={value} />;
      },
      titleBlock: ({ value }: any) => {
        return <TitleBlock value={value} />;
      },
      fileBlock: ({ value }: any) => {
        return <FileBlock value={value} />;
      },
      centerTextBlock: ({ value }: any) => {
        return <CenterTextBlock value={value} />;
      },
      textImageBlock: ({ value }: any) => {
        return <TextImageBlock value={value} />;
      },
      imageCarouselBlock: ({ value }: any) => {
        return <ImageCarouselBlock value={value} />;
      },
    },
    block: {
      h1: ({ children }) => (
        <h1 className="editor-content text-[8vw] md:text-[4vw] font-bold mb-[8vw] md:pb-[1vw] leading-[130%]">
          {children}
        </h1>
      ),
      h2: (() => {
        const toSlug = (input: string): string => {
          const trimmed = (input || "").trim();
          if (!trimmed) return "section";
          const normalized = trimmed
            .normalize("NFKD")
            .replace(/\p{Diacritic}+/gu, "");
          const safe = normalized.replace(/[^\p{Letter}\p{Number}\s-]/gu, "");
          const collapsed = safe
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return collapsed || "section";
        };
        return ({ children, value }: any) => {
          const text = Array.isArray(children)
            ? children.join("")
            : String(children || "");
          const baseId = toSlug(text).toLowerCase();
          const keySuffix =
            typeof value?._key === "string" ? `-${value._key.slice(0, 6)}` : "";
          const id = `${baseId}${keySuffix}`;
          return (
            <h2
              id={id}
              className="editor-content text-[7vw] md:text-[3.5vw] font-semibold mb-[3vw] md:mb-[0.8vw] leading-[130%]"
            >
              {children}
            </h2>
          );
        };
      })(),
      h3: ({ children }) => (
        <h3 className="editor-content text-[6vw] md:text-[2.3vw] font-medium mb-[3vw] md:mb-[0.8vw] leading-[130%]">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="editor-content text-[6vw] md:text-[1.7vw] font-medium mb-[3vw] md:mb-[0.8vw]">
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 className="editor-content text-[5.5vw] md:text-[1.6vw] font-medium mb-[3vw] md:mb-[0.8vw]">
          {children}
        </h5>
      ),
      h6: ({ children }) => (
        <h6 className="editor-content text-[5vw] md:text-[1.6vw] font-medium mb-[3vw] md:mb-[0.8vw]">
          {children}
        </h6>
      ),
      normal: ({ children }) => {
        const isEmpty =
          !children ||
          (Array.isArray(children) &&
            children.length === 1 &&
            typeof children[0] === "string" &&
            children[0].trim() === "");

        if (isEmpty) {
          return <div className="editor-content h-[12vw] md:h-[4vw]" />;
        }

        return (
          <p className="editor-content text-[5vw] md:text-[1.6vw] leading-[170%] md:mb-[1vw] mb-[4vw]">
            {children}
          </p>
        );
      },
      blockquote: ({ children }) => (
        <blockquote className="editor-content border-l-[0.25vw] border-[#433E3E] pl-[1vw] italic text-[5vw] md:text-[1.5vw] leading-[170%] md:mb-[1vw] mb-[4vw]">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="editor-content">{children}</ul>,
      number: ({ children }) => (
        <ol className="editor-content list-decimal">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="editor-content flex items-start justify-start gap-[4vw] md:gap-[1vw] ml-0">
          <Image
            src="/icons/tick.svg"
            alt="Bullet point"
            width={20}
            height={20}
            className=" md:mr-[1vw] mt-[1vw] md:mt-[0.5vw] w-[5vw] h-[5vw] md:w-[1.5vw] md:h-[1.5vw]"
          />
          <span className="text-[5vw] md:text-[1.6vw] leading-[170%]">
            {children}
          </span>
        </li>
      ),
      number: ({ children }) => (
        <li className="editor-content mb-[0.063vw] text-[5vw] md:text-[2vw]">
          {children}
        </li>
      ),
    },
    marks: {
      link: ({ value, children }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="editor-content underline"
        >
          {children}
        </a>
      ),
      strong: ({ children }) => (
        <strong className="editor-content font-bold">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="editor-content italic">{children}</em>
      ),
      code: ({ children }) => (
        <code className="editor-content bg-gray-100 px-[0.063vw] rounded text-[0.875vw] font-mono">
          {children}
        </code>
      ),
    },
    hardBreak: () => <br className="editor-content h-[12vw] md:h-[4vw]" />,
  };

  return (
    <div className="prose prose-sm md:prose-lg lg:prose-xl max-w-[100vw] w-full overflow-x-hidden font-newsreader">
      <PortableText value={content} components={components} />
    </div>
  );
}
