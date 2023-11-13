import React, { useEffect, useState } from 'react';
import TinderCards from './TinderCards';
import SwipeButtons from './SwipeButtons';



function RatingPage() {
  
    return (
      <div className="bg-[#081730] flex flex-col items-center justify-center">
            <TinderCards/>
            <SwipeButtons/>
        </div>
 
    );
  }
  
  export default RatingPage;