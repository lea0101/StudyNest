import React, { useState } from "react"
import '../App.css';
import Login from "./login.jsx";
import Signup from "./Signup.js";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = (e) => {
        e.preventDefault();
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
        {/* <button className="google-signin-button" type="submit">Sign in with Google</button> */} {/* replaced with google sign in Login component */}
        <Login />
        {/* <button className="guest-signin-button" type="submit">Sign in as Guest</button> */} {/* guest sign in button, add later */}
        <button className="sign-up-button" type="submit">Don't have an account? Sign Up</button> {/* want to replace with Signup component */}
        {/* <Signup /> */}
      </form>
    </div>
  );
}

export default LoginPage;
