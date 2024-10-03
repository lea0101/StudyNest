import React, { useState } from "react"
import '../App.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = (e) => {
        e.preventDefault();
    }

  return (
    <div className="Login">
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
        <button className="login-button" type="submit">Login</button>
        <button className="google-signin-button" type="submit">Sign in with Google</button>
        <button className="guest-signin-button" type="submit">Sign in as Guest</button>
      </form>
    </div>
  );
}

export default Login;
