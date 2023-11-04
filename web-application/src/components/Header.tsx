import React from 'react';
import { FiUser } from 'react-icons/fi'
import { FiSettings } from 'react-icons/fi'
import { BiLogOut } from 'react-icons/bi'
import { LuMail } from 'react-icons/lu'
import { FaRegUserCircle } from 'react-icons/fa'
import {useIsAuthenticated} from 'react-auth-kit';
import {useAuthUser} from 'react-auth-kit'
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { useState } from 'react';

const Header: React.FC = () => {
  const buttonStyle = 
    "border-[2px] rounded-[10px] border-[#232A4E] px-[25px] py-[7px]";
  const liStyle = "mr-[3rem] hover:cursor-pointer text-[#B3B8CD]"
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const scrollDirection = useScrollDirection();
  const [dropdownOpen, setDropdownOpen] = useState(false);

const toggleDropdown = () => {
  setDropdownOpen(!dropdownOpen);
};

  function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = React.useState<"up" | "down" | null>(null);

    React.useEffect(() => {
      let lastScrollY = window.scrollY;
  
      const updateScrollDirection = () => {
        const scrollY = window.scrollY;
        const direction = scrollY > lastScrollY ? "down" : "up";
        if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
      };
      window.addEventListener("scroll", updateScrollDirection); 
      return () => {
        window.removeEventListener("scroll", updateScrollDirection); 
      }
    }, [scrollDirection]);
  
    return scrollDirection;
  };
  
  const navigateToUserPage = () => {
    const username = auth()?.username;
    if (username) {
      navigate(`/user/${username}`);
    }
  };

  const navigateToInbox = () => {
    const username = auth()?.username;
    if (username) {
      navigate(`/user/${username}/inbox`);
    }
  };

  const navigateToSettings = () => {
    const username = auth()?.username;
    if (username) {
      navigate(`/user/${username}/settings`);
    }
  };

  const handleSignOut = () => {
    if (isAuthenticated()) {
      navigate("/");
      signOut();
    }
  };

  const SignInButtonHandler: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/signin');
    };
  
    return (
      <button className={`mr-[35px] bg-blue-700 hover:bg-blue-800 text-white ${buttonStyle}`} onClick={handleClick}>Sign In</button>
    );
  }

  const SignUpButtonHandler: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/signup');
    };
  
    return (
      <button className={buttonStyle+` bg-blue-700 hover:bg-blue-800 text-white hover:border-stone-400`} onClick={handleClick}>Sign Up</button>
    );
  }


  const AnalysisButton: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/analysis');
    };
  
    return (
      <button onClick={handleClick} className='font-lalezar text-lg'>Analysis</button>
    );
  }

  const FriendsButton: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/friends');
    };
  
    return (
      <button onClick={handleClick} className='font-lalezar text-lg'>Friends</button>
    );
  }

  const Placeholder1: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/placeholder1');
    };
  
    return (
      <button onClick={handleClick} className='font-lalezar text-lg' >Placeholder</button>
    );
  }

  const Placeholder2: React.FC = () => {
    const history = useNavigate();
  
    const handleClick = () => {
      history('/placeholder2');
    };
  
    return (
      <button onClick={handleClick} className='font-lalezar text-lg'>Placeholder</button>
    );
  }

  const navigate_button = (path: string) => () => {
    const history = useNavigate();
    history(path);
  };

  return (
    <div className={`sticky ${ scrollDirection === "down" ? "-top-24" : "top-0"} bg-[#081730] flex rounded-b-3xl border-b-[5px] border-[#020917] items-center justify-between px-[5rem] text-[0.8rem] h-24 transition-all duration-500 z-50`}>  
      {/* LOGO */}
      <img 
          src={"header_logo.png"}
          alt="Logo"
          className="logo w-[80px] h-[80px] items-center hover:cursor-pointer"
          onClick={navigate_button("/")}  
      />
      <div className="menu flex">
        <ul className='flex w-[100%] items-center'>
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

        {isAuthenticated() === false ? 
          (
          <div className="flex items-center">
            <button id="dropdownDividerButton" data-dropdown-toggle="dropdownDivider" className="text-white relative flex justify-between bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" onClick={toggleDropdown}><FaRegUserCircle size={15}/><div className='pl-[10px]'>koezgen</div><svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>
            <div id="dropdownDivider" className={`absolute z-10 ${dropdownOpen ? '' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg mt-[220px] shadow dark:bg-gray-700 dark:divide-gray-600`}>
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
                <li>
                  <a onClick={navigateToUserPage} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:cursor-pointer dark:hover:text-white"><FiUser size={15}/>My Profile</a>
                </li>
                <li>
                  <a onClick={navigateToInbox} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:cursor-pointer dark:hover:text-white"><LuMail size={15}/>Inbox<div className='bg-[#d4353f] flex justify-center items-center rounded w-[10px] h-[10px]'><span className="text-xs">1</span></div></a>
                </li>
                <li>
                  <a onClick={navigateToSettings} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:cursor-pointer dark:hover:text-white"><FiSettings size={15}/>Settings</a>
                </li>
              </ul>
              <div className="py-2">
                <a onClick={handleSignOut} className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"><BiLogOut size={15}/>Log Out</a>
              </div>
            </div>
          </div>
          ) : 
          (
            <div className='flex items-center'>
              <SignInButtonHandler />
              <SignUpButtonHandler />
            </div>
          )
        }

    </div>
  );
};

export default Header;