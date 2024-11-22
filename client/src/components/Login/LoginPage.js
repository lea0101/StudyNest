import React, { useState } from "react"
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import Login from "./login.jsx";
import Signup from "./Signup.js";
import Signin from "./Signin.js";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
      e.preventDefault();
  }

  const handleSignup = () => {
    navigate('/signup');
  }

  const handleForgot = () => {
    navigate('/password');
  }

  return (
    <div className="LoginPage">
      <h1>StudyNest Login Page</h1>
      <form className = "login-form" onSubmit={handleLogin}>
        <h3>Login to Your Account</h3>

        <Signin />
        <Login />
        <button className="go-to-signup-button" onClick={handleSignup}>Don't have an account? Sign Up</button>
        <button className="guest-signin-button" onClick={handleForgot}>Forgot Password </button>
      </form>
    </div>
  );
}

export default LoginPage;
