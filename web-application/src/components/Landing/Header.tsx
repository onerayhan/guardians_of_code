import React from 'react';
import { FiUser } from 'react-icons/fi'
import {useIsAuthenticated} from 'react-auth-kit';
import {useAuthUser} from 'react-auth-kit'
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const buttonStyle = 
    "border-[2px] rounded-[10px] border-[#232A4E] px-[25px] py-[7px]";
  const liStyle = "mr-[3rem] hover:cursor-pointer text-[#B3B8CD]"
  const isAuthenticated = useIsAuthenticated();

  const auth = useAuthUser()

  const SignInButtonHandler: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/signin');
    };
  
    return (
      <button className={`mr-[35px] hover:bg-[#232A4E] text-white ${buttonStyle}`} onClick={handleClick}>Sign In</button>
    );
  }

  const SignUpButtonHandler: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/signup');
    };
  
    return (
      <button className={buttonStyle+` bg-[#232A4E] text-white hover:border-stone-400`} onClick={handleClick}>Sign Up</button>
    );
  }


  const AnalysisButton: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/analysis');
    };
  
    return (
      <button onClick={handleClick}>Analysis</button>
    );
  }

  const FriendsButton: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/friends');
    };
  
    return (
      <button onClick={handleClick}>Friends</button>
    );
  }

  const Placeholder1: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/friends');
    };
  
    return (
      <button onClick={handleClick}>Placeholder</button>
    );
  }

  const Placeholder2: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/friends');
    };
  
    return (
      <button onClick={handleClick}>Placeholder</button>
    );
  }

  return (
    <div className="header bg-[#081730] flex items-center justify-between px-[5rem] pt-[2.4rem] text-[0.8rem]">
      
      {/*  */}
      <img 
          src={"header_logo.svg"}
          alt="Logo"
          className="logo w-[42px] h-[42px]"  
      />
      <div className="menu flex">
        <ul className='flex w-[100%] justify-between'>
            <li className={liStyle}>
              <AnalysisButton /></li>
            <li className={liStyle}>
              <FriendsButton /></li>
            <li className={liStyle}>
              <Placeholder1 /></li>
            <li className={liStyle}>
              <Placeholder2 /></li>
        </ul>
      </div>
      {/* BUTTONS */}
      <div className="buttons flex">
        {isAuthenticated() ? 
          ( // User is logged in, show user ID
            <div className={`mr-[35px] hover:bg-[#232A4E] text-white ${buttonStyle}`}>
              <FiUser size={20}/>
              <span>{auth()?.username}</span>
            </div>
          ) : 
          ( // User is not logged in, show sign in and sign up links
            <div className='flex items-center justify-center'>
              <SignInButtonHandler />
              <SignUpButtonHandler />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Header;