import React, { useEffect, useState } from 'react';
import { Button} from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import SongsDisplay from './SongsDisplay';
import Followers from './Followers';
import Followings from './Followings';
import './Default_pfp.svg.png';


function Profile() {
  
  return (
    <div className="flex flex-col items-center text-center bg-[#081730] ">
      <div className="flex flex-col items-center justify-center w-full bg-[#081730] text-white p-2.5">
        <Avatar img="./Default_pfp.svg.png" size="xl" rounded bordered color="gray" />
        <h2 className='mt-5'>Your Name</h2>
        <Button gradientDuoTone="pinkToOrange" className="mt-5 mb-3" color="blue">Edit Profile</Button>
        <div className="flex justify-center items-center mx-0 my-2.5">
          <Followers/>
          <Followings/>
        </div>
      </div>
      <div className="flex bg-white">
      <div className="w-6/6 p-4">
          <SongsDisplay/>
        </div>
      </div>
    </div>
  );
}

export default Profile;