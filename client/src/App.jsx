import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Welcome from "./pages/welcome";
import Chat from "./pages/chat";
import SignUp from "./pages/signup";
import Setup from "./pages/setup";
import Profile from "./pages/profile";
import RegistrationForm from "./RegistrationForm";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const isAuthenticated = true;

  return (
    <Router>
      <Navbar  key={location.pathname} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/profile" element={<Profile />} />

        {/* Protected dashboard route */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
