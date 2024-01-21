import { useState } from "react";
import MusicPlayer from "./MusicPlayer";
import { motion } from "framer-motion";
import VisibilitySensor from "react-visibility-sensor";

const Search = () => {
  const [elementIsVisible, setElementIsVisible] = useState(false);
  const redimg = {
    true: {
      left: "18rem",
    },
    false: {
      left: "16rem",
    },
  };
  return (
    <div className="search relative h-[65rem] px-[5rem] bg-[#081730] pt-[18rem] pb-[10rem] mt-[-15rem] z-[1] flex items-center justify-between rounded-b-[5rem]">
      {/* left side */}
      <div className="left flex-1">
        <motion.img
          src={"../img/d5.png"}
          alt=""
          className="w-[30rem] top-[30rem] absolute"
        />{" "}
        <motion.img
          src={"../img/d2.png"}
          alt=""
          className="w-[8rem] absolute top-[34rem] left-[8.4rem]"
        />{" "}
        <motion.img
          variants={redimg}
          animate={`${elementIsVisible}`}
          transition={{
            duration: 1.2,
            type: "ease-out",
          }}
          src={"../img/d3.png"}
          alt=""
          className="w-[8rem] top-[34rem] left-[17rem] absolute"
        />
      </div>
      {/* right side */}
      <div className="right flex items-start flex-col justify-start flex-1 h-[100%] pt-[9rem]">
        {/* tild icon */}
        <div className="tild flex justify-start mt-7 items-center w-[100%]">
          <img
            src={"../img/Path 318.png"}
            alt=""
            className="w-[5rem]"
          />
        </div>

        {/* paragraph */}
        <div className="detail flex flex-col mt-5 text-4xl text-[#989bac]">
          <span>Seamless</span>
          <span>
            <b>Spotify Integration</b>
          </span>
          <span className="text-sm mt-3 text-[#4D586A]">
            You will see what your friends have been listening <br /> on Spotify without
            having to add everything by your hand.
          </span>
        </div>
        {/* Music Player */}
        <VisibilitySensor
          onChange={(isVisible: boolean | ((prevState: boolean) => boolean)) => setElementIsVisible(isVisible)}
        >
          <MusicPlayer />
        </VisibilitySensor>
      </div>
    </div>
  );
}

export default Search;
