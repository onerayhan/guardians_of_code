import AppRouter from './Router';
import { useUserEntry } from './contexts/UserEntryContext';
import UserEntry from './pages/UserEntry';
import "./tailwind.css"

function App() 
{

  const { isUserEntryVisible, formType, hideUserEntry } = useUserEntry();

  return (
    <>
      <div className="app">
        {isUserEntryVisible && formType && (
          <UserEntry formType={formType} closeUserEntry={hideUserEntry} />
        )}
      <AppRouter />
      </div>
    </>
  );
}

export default App;