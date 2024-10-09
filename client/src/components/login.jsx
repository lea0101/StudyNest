import { auth, provider } from "../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./login.css";
import logo from '../img/btn_google_signin_dark_pressed_web.png'; // Tell webpack this JS file uses this image
import { useNavigate } from "react-router-dom"; // import navigate for routing -cc


function Login() {
    const [user, loading, error] = useAuthState(auth)
    const navigate = useNavigate(); // initialize navigate -cc

    async function handleLogin() {
        await signInWithPopup(auth, provider).then((result) => {
            // Google Access Token for API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            // IdP data = getAdditionalUserInfo(result)

            // navigate to home page after successful login -cc
            navigate('/');
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode);
        });
    }

    return (
        <>
            <img class="darken" src={logo} onClick={handleLogin} alt="google_button"/>
            {loading && <p>Loading!</p>}
            {user && <><h2>{user?.displayName}</h2>
                <img src={user?.photoURL} alt="profile_image" /> </>}
        </>
    )
}
export default Login

// import { signInWithPopup } from "firebase/auth"
// import { auth, provider } from "../config/firebase"
// import { useAuthState } from 'react-firebase-hooks/auth'
// function Login() {
//     const [user, loading, error] = useAuthState(auth)
//     async function handleLogin() {
//         await signInWithPopup(auth, provider).catch(() => console.log("login error"))
//     }
//     return (
//         <>
//             <h1> Login Form </h1>
//             <button onClick={handleLogin}> Login GOOGLE</button>
//             {loading && <p>Loading!</p>}
//             {user && <><h2>{user?.displayName}</h2>
//                 <img src={user?.photoURL} alt="profile_image" /> </>}
//         </>
//     )
// }
// export default Login