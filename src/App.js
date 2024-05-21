import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import "./Style.scss";
// Importing components
import Dashboard from './components/Dashboard';
import Login from "./components/login";
import PrivateRoute from "./components/Privateroute";
import Signup from './components/signup';
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import Home from './components/Home';
import Main from './website/main';
import NavMenu from "./components/nav.js";
import CreateProfile from './components/CreateProfile';
import PatientProfileDisplay from "./components/PatientProfileDisplay.js";
import SensorDashboard from './SensorDashboard.js';
import SearchPatients from "./website/SearchPatients.js";

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Safety check before accessing `currentUser.role`
  const isDoctor = currentUser && currentUser.role === 'doctor';

  return (
    <Router>
      <NavMenu />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/search-patients" element={
          <PrivateRoute>
            {isDoctor ? <SearchPatients /> : <Navigate to="/unauthorized" />}
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
        <Route path="/patient-profile/:patientId" element={<PatientProfileDisplay />} />
        <Route path="/sensor-dashboard/:id" element={<SensorDashboard />} />
        <Route path="/create-profile" element={<PrivateRoute><CreateProfile /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
