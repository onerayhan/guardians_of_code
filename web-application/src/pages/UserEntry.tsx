import { FC, useState } from 'react';
import SignIn from '../components/UserEntry/SignIn';
import SignUp from '../components/UserEntry/SignUp';
import RenewPass from '../components/UserEntry/RenewPass';
import Modal from '../components/Modal';

interface UserEntryProps {
  formType: 'signin' | 'signup' | 'renewpass';
  closeUserEntry: () => void;
}

const UserEntry: FC<UserEntryProps> = ({ formType, closeUserEntry }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    closeUserEntry(); // Ensure that when the modal closes, it also informs the parent context
  };

  const renderForm = () => {
    switch (formType) {
      case 'signin':
        return <SignIn />;
      case 'signup':
        return <SignUp />;
      case 'renewpass':
        return <RenewPass />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Modal onClose={handleClose} isVisible={isVisible}>
        {renderForm()}
      </Modal>
    </div>
  );
}

export default UserEntry;