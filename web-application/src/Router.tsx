import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Friends from './pages/Friends';
import Modal from './components/UserEntry/EntranceModal';
import { RequireAuth } from 'react-auth-kit'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/friends" 
          element={
            <RequireAuth loginPath="/signin">
              <Friends />
            </RequireAuth>
          } 
        />
        <Route
          path="/signin"
          element={<Modal formType={'signin'} closeUserEntry={function (): void {
            throw new Error('Function not implemented.');
          } } />}
        />
        <Route
          path="/signup"
          element={<Modal formType={'signup'} closeUserEntry={function (): void {
            throw new Error('Function not implemented.');
          } } />}
        />
        <Route
          path="/signup"
          element={<Modal formType={'signup'} closeUserEntry={function (): void {
            throw new Error('Function not implemented.');
          } } />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;