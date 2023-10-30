import { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';

function PasswordInput() {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="relative">
        <input
            type={passwordShown ? "text" : "password"}
            className="w-[400px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold"
            placeholder="Password"
        />
    <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-2"
    >
        {passwordShown ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
    </button>
    </div>
  );
}

export default PasswordInput;