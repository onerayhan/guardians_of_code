import React from "react";
import DownloadAds from "./DownloadAds";

const Download: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start px-[5rem] bg-[#020917] h-[48rem] pt-[18rem] mt-[-10rem] relative z-[0]">
      {/* tild icon or path icon */}
      <img src={"img/Path 318.png"} alt="" className="w-[5rem]" />
      {/* heading */}
      <div className="headline mt-7 flex flex-col items-center text-[2rem] text-[#b1aec2]">
        <span>Download The Best Music</span>
        <span>
          <b>App Now!</b>
        </span>
        <span className="text-[1rem] text-gray-400 px-[15rem] text-center mt-[1rem]">
          Or you can just continue with the web version. All you have to do is sign up  
          <br />or log in, if you are not new around here.
        </span>
      </div>
      {/* dowload ads */}
      <div className="mt-14">
        <DownloadAds />
      </div>
    </div>
  );
}

export default Download;
