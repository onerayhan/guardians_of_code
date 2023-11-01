import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ProtectedRoute from './contexts/ProtectedRoute';
import Friends from './pages/Friends';

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