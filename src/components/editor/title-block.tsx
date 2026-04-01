import Image from "next/image";

export default function TitleBlock({ value }: any) {
  return (
    <div className="w-full">
      {value.text &&
        value.text.content &&
        (() => {
          const Tag = value.text.tag || "p"; // Default to <p> if tag missing

          return (
            <Tag
              className={`text-[11vw] md:text-[5.5vw] font-[600] leading-[130%] ${value.layout === "left" ? "text-left" : "text-center"}`}
            >
              {value.text.content}
            </Tag>
          );
        })()}
    </div>
  );
}
