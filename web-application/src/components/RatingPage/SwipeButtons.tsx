import React, { FC } from "react";
import "./SwipeButtons.css";
import IconButton from '@mui/material/IconButton';
import {FcUndo} from 'react-icons/fc';
import {FcLike} from 'react-icons/fc';
import {ImCross} from 'react-icons/im';

const SwipeButtons: FC = () => {
  return (
    <div className="swipeButtons">
      
      <IconButton className="swipeButtons__repeat">
        <ImCross size={50} />
      </IconButton>
      <IconButton className="swipeButtons__right">
        <FcUndo size={50}  />
      </IconButton>
      <IconButton className="swipeButtons__flash">
        <FcLike size={50} />
      </IconButton>
    </div>
   
  );
}

export default SwipeButtons;