import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import UserEntry from './pages/UserEntry';
import Friends from './pages/Friends'; // Assuming you have a SecureComponent
import { RequireAuth } from 'react-auth-kit'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loginrequired" element={<UserEntry formType={'signin'} closeUserEntry={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route 
          path="/friends" 
          element={
            <RequireAuth loginPath="/loginrequired">
              <Friends />
            </RequireAuth>
          } 
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;