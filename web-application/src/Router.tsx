import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Friends from './pages/Friends';
import Settings from './pages/Settings';
import Analysis from './pages/Analysis';
import Placeholder1 from './pages/Placeholder1';
import Placeholder2 from './pages/Placeholder2';
import Modal from './components/UserEntry/EntranceModal';
import UserPage from './pages/UserPage';
import { RequireAuth } from 'react-auth-kit'
import { useIsAuthenticated } from 'react-auth-kit'
import { useAuthUser } from 'react-auth-kit'

const AppRouter = () => {

  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  if (isAuthenticated()) {
    var username = auth()?.username;
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/user/:username" 
          element={
            <RequireAuth loginPath="/signin">
              <UserPage user={username}/>
            </RequireAuth>
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <RequireAuth loginPath="/signin">
              <Analysis />
            </RequireAuth>
          } 
        />
        <Route 
          path="/friends" 
          element={
            <RequireAuth loginPath="/signin">
              <Friends />
            </RequireAuth>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <RequireAuth loginPath="/signin">
              <Settings />
            </RequireAuth>
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <RequireAuth loginPath="/signin">
              <Analysis />
            </RequireAuth>
          } 
        />
        <Route 
          path="/placeholder1" 
          element={
            <RequireAuth loginPath="/signin">
              <Placeholder1 />
            </RequireAuth>
          } 
        />
        <Route 
          path="/placeholder2" 
          element={
            <RequireAuth loginPath="/signin">
              <Placeholder2 />
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
      </Routes>
    </Router>
  );
};

export default AppRouter;