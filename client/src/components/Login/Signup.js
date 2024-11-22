import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleGoLogin = () => {
        navigate('/login');
      }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // signed in
            const user = userCredential.user;
            console.log(user);
            // navigate("/login");
            navigate("/home");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);

            if (errorCode === "auth/invalid-password" || errorCode === "auth/weak-password") {
                setError("Password must have at least six characters.")
            } else if (errorCode === "auth/email-already-in-use") {
                setError("An account with this email already exists.")
            } else if (errorCode === "auth/invalid-email") {
                setError("Email must be a string email address.")
            } else {
                setError(errorMessage)
            }
        });
    }

    return (
        <form className="login-form" onSubmit={onSubmit}>
            <div>
                <h3>Sign Up for an Account</h3>

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
            
            <div>
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
            </div>
            
            <button className="sign-up-button" type="submit">Create Account</button>

            <button className="go-to-login-button" onClick={handleGoLogin} type="submit">I have an account</button>

            {error && <p className="error">{error}</p>}
        </form>
    )
}

export default Signup