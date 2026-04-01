import Image from "next/image";

export default function HowItWorks({ value }: any) {
  return (
    <div className="w-full">
      <h2 className="text-[11vw] md:text-[5.5vw] font-[600] leading-[130%] mb-[6vw] md:mb-[4vw]">
        {value.title}
      </h2>
      <p className="editor-content text-[5vw] md:text-[1.6vw] leading-[170%] mb-[6vw] md:mb-[4vw]">
        {value.paragraph}
      </p>
      <div className="flex flex-col md:gap-[6.5vw] gap-[12vw]">
        {value.steps.map((step: any, index: number) => (
          <div key={index}>
            <h3 className="text-[7vw] md:text-[2.8vw] leading-[170%] mb-[5.5vw] md:mb-[3.2vw] font-[600]">
              {step.title}
            </h3>
            <p className="editor-content text-[5vw] md:text-[1.6vw] leading-[170%] mb-[5.5vw] md:mb-[2.5vw]">
              {step.description}
            </p>
            <ul className="editor-content text-[5vw] md:text-[1.6vw] leading-[170%] flex flex-col md:gap-[1vw] gap-[2vw]">
              {step.points.map((point: any, index: number) => (
                <li
                  key={index}
                  className="flex items-start justify-start gap-[4vw] md:gap-[1vw]"
                >
                  <Image
                    src="/icons/tick.svg"
                    alt="Bullet point"
                    width={20}
                    height={20}
                    className=" mr-[1vw] mt-[1vw] md:mt-[0.5vw] w-[6vw] h-[6vw] md:w-[1.5vw] md:h-[1.5vw]"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
