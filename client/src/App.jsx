import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import "./App.css";
import "./index.css";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Welcome from "./pages/welcome";
import Chat from "./pages/chat";
import SignUp from "./pages/signup";
import RegistrationForm from "./RegistrationForm";

// // Page before sign-in
// function HomePage() {
//   const navigate = useNavigate();

//   const handleLoginSuccess = (credentialResponse) => {
//     console.log("✅ Login Success:", credentialResponse);
//     navigate("/dashboard");
//   };

//   return (
//     <div className="app">
//       <header className="header">
//         <h1>Welcome to My Landing Page</h1>
//         <p>Your go-to platform for amazing experiences!</p>
//         <GoogleLogin
//           onSuccess={handleLoginSuccess}
//           onError={() => console.log("❌ Login Failed")}
//         />
//       </header>
//     </div>
//   );
// }

// // Page after sign-in
// function DashboardPage() {
//   return (
//     <div className="app">
//       <header className="header">
//         <h1>Welcome to Your Dashboard</h1>
//         <p>You are successfully signed in!</p>
//         <Link to="/">Go back to the homepage</Link>
//       </header>
//     </div>
//   );
// }

// function App() {
//   console.log('🔑 Loaded Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

//   return (
//     <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
//       <Router>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/dashboard" element={<DashboardPage />} />
//         </Routes>
//       </Router>
//     </GoogleOAuthProvider>
//   );
// }

// export default App;

function App() {


  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/registration" element={<RegistrationForm />} />
        </Routes>
      </Router>
    </>


  );
}

export default App;