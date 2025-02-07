/* eslint-disable react/prop-types */
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import Event from './pages/Event';
import ContactPage from './pages/ContactPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/events" element={<Events />} />
      <Route path='/contact' element={<ContactPage/>}/>

      {/* Protected Routes */}
      <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/event/:id" element={<ProtectedRoute><Event /></ProtectedRoute>} />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/events" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <div>
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
