import React from 'react';
import { useUserEntry } from '../../contexts/UserEntryContext'
import { FiUser } from 'react-icons/fi'
import {useIsAuthenticated} from 'react-auth-kit';
import {useAuthUser} from 'react-auth-kit'


const Header: React.FC = () => {
  const buttonStyle = 
    "border-[2px] rounded-[10px] border-[#232A4E] px-[25px] py-[7px]";

  const { showSignIn, showSignUp } = useUserEntry() as { showSignIn: () => void; showSignUp: () => void }; // Assuming useUserEntry returns an object with showSignIn and showSignUp methods
  const isAuthenticated = useIsAuthenticated();

  const auth = useAuthUser() // Assuming useAuthUser returns the user object  

  return (
    <div className="header bg-[#081730] flex items-center justify-between px-[5rem] pt-[2.4rem] text-[0.8rem]">
      
      {/*  */}
      <img 
          src={"header_logo.svg"}
          alt="Logo"
          className="logo w-[42px] h-[42px]"  
      />

      {/* BUTTONS */}
      <div className="buttons flex">
        {auth() ? 
          ( // User is logged in, show user ID
            <div className={`mr-[35px] hover:bg-[#232A4E] text-white ${buttonStyle}`}>
              <FiUser size={20}/>
              <span>{auth().id}</span>
            </div>
          ) : 
          ( // User is not logged in, show sign in and sign up links
            <div className='flex items-center justify-center'>
              <button className={`mr-[35px] hover:bg-[#232A4E] text-white ${buttonStyle}`} onClick={showSignIn}>
                Sign In
              </button>
              <button className={buttonStyle+` bg-[#232A4E] text-white hover:border-stone-400`} onClick={showSignUp}>
                Sign Up
              </button>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Header;