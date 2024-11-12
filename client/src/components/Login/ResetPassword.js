import React, { useState } from "react"
import { NavLink, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../config/firebase';

function ResetPassword() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');


  const onSubmit = async (e) => {
      e.preventDefault();
      setError('');

      await sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Reset password email sent")
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);

          //if (errorCode === "auth/invalid-password" || errorCode === "auth/weak-password") {
          //    setError("Password must have at least six characters.")
          //} else if (errorCode === "auth/email-already-in-use") {
          //    setError("An account with this email already exists.")
          //} else if (errorCode === "auth/invalid-email") {
          //    setError("Email must be a string email address.")
          //} else {
              setError(errorMessage)
          //}
      });
  }


  const handleGoLogin = () => {
    navigate('/login');
  }

  return (
  <div className="SignupPage">
    <h1> Password Reset </h1>
    <form className="login-form" onSubmit={onSubmit}>
      <div>
          <h3>Forgot Password</h3>
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
      </div>
      <button className="sign-up-button" type="submit">Reset Password</button>
      <button className="go-to-login-button" onClick={handleGoLogin} type="submit">I have an account</button>
      {error && <p className="error">{error}</p>}
    </form>
  </div>
  )
}

export default ResetPassword;
