import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

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
            navigate("/login");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            setError(errorMessage);
        });
    }

    return (
        <form className="sign-up-form" onSubmit={onSubmit}>
            <div>
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
            
            <button className="sign-up-button" type="submit">Create</button>

            <button className="go-to-login-button" onClick={handleGoLogin} type="submit">I have an account</button>

            {error && <p className="error">{error}</p>}
        </form>
    )
}

export default Signup