import React, {useState} from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // check if user is deleted
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.data().deleted) {
                setError("This account was deleted. Log in with a different account.");
                await auth.signOut();
                return;
            }

            // sign in
            navigate("/home");
        } catch (error) {
            console.error("Error logging in: ", error);
            const errorCode = error.code;
            if (errorCode === "auth/user-not-found") {
                setError("The email address is not registered")
            } else if (errorCode === "auth/invalid-credential") {
                setError("The password is incorrect or the email does not exist.");
            } else if (errorCode === "auth/too-many-requests") {
                setError("You have logged in too many times. Please try again later.")
            } else {
                setError("Failed to log in. Please try again.");
            }
        }

        // signInWithEmailAndPassword(auth, email, password)
        // .then((userCredential) => {
        //     // signed in
        //     const user = userCredential.user;
        //     navigate("/home")
        //     console.log(user);
        //     setError('signed in')
        // })
        // .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     console.log(errorCode, errorMessage);

        //     setError(errorMessage);
        //     if (errorCode === "auth/invalid-credential") {
        //         setError("The password is incorrect or the email does not exist.");
        //     } else if (errorCode === "auth/too-many-requests") {
        //         setError("You have logged in too many times. Please try again later.")
        //     }
        // });
    }

    return (
        <div className="sign-in">
            <div>
                <label htmlFor="email" className="label-left">Email</label>
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
                <label htmlFor="password" className="label-left">Password</label>
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

            <button className="login-button" onClick={onLogin} type="submit">Login</button> {/* want to replace with Signin component */}

            {error && <p className="error">{error}</p>}
        </div>
    )
}

export default Signin