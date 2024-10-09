import React, {useState} from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { NavLink, useNavigate } from "react-router-dom";

function Signin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // signed in
            const user = userCredential.user;
            navigate("/home")
            console.log(user);
        })
        .catch((error) => {
            
        });
    }

    return (
        <div className="sign-in">
            <button className="login-button" type="submit">Login</button>
        </div>
    )
}

export default Signin