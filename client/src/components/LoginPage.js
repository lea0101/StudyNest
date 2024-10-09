import React, { useState } from "react"
import '../App.css';
import { useNavigate } from 'react-router-dom';
import Login from "./login.jsx";
import Signup from "./Signup.js";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();


    const handleLogin = (e) => {
        e.preventDefault();
    }

    const handleSignup = () => {
      navigate('/signup');
    }

  return (
    <div className="LoginPage">
      <h1>StudyNest Login Page</h1>
      <form className = "login-form" onSubmit={handleLogin}>
        <h3>Login to Your Account</h3>

        <label htmlFor="email">Email</label>
        <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@example.com"
            id="email"
            name="email"
            required
        />
        <label htmlFor="password">Password</label>
        <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
            required
        />

        <button className="login-button" type="submit">Login</button> {/* want to replace with Signin component */}
        <Login />
        {/* <button className="guest-signin-button" type="submit">Sign in as Guest</button> */} {/* guest sign in button, add later */}
        <button className="go-to-signup-button" onClick={handleSignup}>Don't have an account? Sign Up</button>
      </form>
    </div>
  );
}

export default LoginPage;
