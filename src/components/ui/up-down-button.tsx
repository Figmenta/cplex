import { useRef, useState } from "react";

export default function UpDownButton({
  text,
  link,
}: {
  text: string;
  link: string;
}) {
  const btnRef = useRef(null);
  const [hover, setHover] = useState(false);

  return (
    <a href={link} target="_blank" className="relative ">
      <button
        ref={btnRef}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`button3 relative z-50 overflow-hidden w-28 h-10 rounded-3xl background-lightDark text-reverse-bright font-suit`}
      >
        <p
          className={`transform ease-in-out duration-700 absolute left-0 w-28 h-10 flex items-center justify-center ${hover ? "top-[-100%]" : "top-[0]"}`}
        >
          {text}
        </p>
        <p
          className={`transform ease-in-out duration-700 absolute left-0 w-28 h-10 flex items-center justify-center background-dark ${hover ? "top-[0]" : "top-[100%]"}`}
        >
          {text}
        </p>
      </button>
      <div
        id="overlay"
        className="w-[100%] h-[100%] absolute top-0 left-0  z-40"
      ></div>
    </a>
  );
}
