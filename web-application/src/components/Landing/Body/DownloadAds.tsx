import React from 'react'

const DownloadAds: React.FC = () => {
    const downloadImgStyle = 'border-[2px] border-[#232A4E] rounded-[13px] h-[3rem] w-[10rem] hover:cursor-pointer'
  return (
    <div className="download">
        <div className="download_images flex">
        <img
          src={"img/Google Play.png"}
          alt=""
          className={downloadImgStyle}
        /> 
        </div>
    </div>
    )
}

export default DownloadAds