import { FC, useState } from 'react';
import SignIn from '../components/UserEntry/SignIn';
import SignUp from '../components/UserEntry/SignUp';
import RenewPass from '../components/UserEntry/RenewPass';
import Modal from '../components/Modal';
import { useUser } from '../contexts/UserContext';

interface UserEntryProps {
  formType: 'signin' | 'signup' | 'renewpass';
  closeUserEntry: () => void;
}

const UserEntry: FC<UserEntryProps> = ({ formType, closeUserEntry }) => {
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    closeUserEntry();
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
    <Modal onClose={handleClose} isVisible={isVisible}>
      {renderForm()}
    </Modal>
  );
}

export default UserEntry;