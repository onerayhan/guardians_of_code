import { FC } from 'react';
import { ImCross } from 'react-icons/im';
import SignIn from './SignIn';
import SignUp from './SignUp';
import RenewPass from './RenewPass';
import {useIsAuthenticated} from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  closeUserEntry: () => void;
  formType: 'signin' | 'signup' | 'renewpass';
}

const Modal: FC<ModalProps> = ({ formType, closeUserEntry }) => {

  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const handleClose = () => {
    navigate('/');
    closeUserEntry();
  };

  if (isAuthenticated()) {
    handleClose();
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-start 
      justify-center transition-opacity duration-300 z-50 overflow-hidden`}>
      <div className="relative p-6 w-full h-full bg-[#081730] overflow-auto">
        <button
          onClick={handleClose}
          className="absolute top-[30px] right-[30px] mt-4 mr-4 text-white text-2xl z-50"
        >
          <ImCross size={35} />
        </button>
        <div className="h-full">
          {formType === "signin" ? (
            <SignIn/>
          ) : null}
          {formType === "signup" ? (
            <SignUp/>
          ) : null}
          {formType === "renewpass" ? (
            <RenewPass/>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Modal;