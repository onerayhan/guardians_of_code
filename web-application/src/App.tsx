import React from 'react';
import AppRouter from './Router';
import { useUserEntry } from './contexts/UserEntryContext';
import Modal from './components/UserEntry/EntranceModal';
import "./tailwind.css";

const App: React.FC = () => {
  const { isUserEntryVisible, formType, hideUserEntry } = useUserEntry();

  return (
    <div className="app">
      {isUserEntryVisible && formType && (
        <Modal formType={formType} closeUserEntry={hideUserEntry} />
      )}
      <AppRouter />
    </div>
  );
}

export default App;