import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Friends from './pages/friends';
import ProtectedRoute from './contexts/ProtectedRoute';

const AppRouter = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
        path="/friends" 
        element = {<ProtectedRoute> <Friends /> </ProtectedRoute>}
        />
        
      </Routes>
    </Router>
  );
};

export default AppRouter;