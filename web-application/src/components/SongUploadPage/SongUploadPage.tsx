import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import SongUpload from './SongUpload';
import SongUploadForm from './SongUploadForm';







const SongUploadPage: React.FC= () =>{


return(

<div className="flex items-center justify-center min-h-screen bg-[#081730]">
        {/* Left Column */}
        <div className="w-1/2 text-center flex flex-col items-center justify-center mr-30">
          <Button className="mb-5 rounded-full px-5 py-2.5" gradientDuoTone="pinkToOrange">
            Upload from Spotify
          </Button>
          <Button className="mb-5 rounded-full px-5 py-2.5" gradientDuoTone="pinkToOrange">
            Upload from Soundcloud
          </Button>
        </div>

        {/* Right Column */}
        <div className="w-1/2 flex-col items-center border-dashed border-2 rounded-md border-sky-500 border-spacing-2 p-5 mr-20">
          <SongUploadForm/>
          <div className="mt-5">
            <SongUpload />
            {/* Submit Button */}
            <Button className="mt-5" gradientDuoTone="pinkToOrange">
              Submit
            </Button>
          </div>
        </div>
      </div>
  


);

};


export default SongUploadPage;