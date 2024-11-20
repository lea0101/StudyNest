import { auth, provider } from "../../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./login.css";
import logo from '../../img/btn_google_signin_dark_pressed_web.png'; // Tell webpack this JS file uses this image
import { useNavigate } from "react-router-dom"; // import navigate for routing
import { FaUserCircle } from 'react-icons/fa';


function Login() {
    const [user, loading, error] = useAuthState(auth)
    const navigate = useNavigate(); // initialize navigate

    async function handleLogin() {
        await signInWithPopup(auth, provider).then((result) => {
            // Google Access Token for API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            // IdP data = getAdditionalUserInfo(result)

            // navigate to home page after successful login
            navigate('/');
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode);
        });
    }

    console.log("hi: ", user?.displayName);

    return (
        <>
            <img class="darken" src={logo} onClick={handleLogin} alt="google_button"/>
            {loading && <p>Loading!</p>}
            {/* {user && <><h3>Logged in as {user?.displayName}</h3>
            <img style={{width: "100px", height: "100px"}} src={user?.photoURL} alt="profile_image" /> </>} */}
            {user && <h3 style={{"margin-top": "10px" }}>Logged in as {user?.email}</h3>}
            {(user && user?.photoURL !== null) && (
                <img style={{width: "100px", height: "100px"}} src={user?.photoURL} alt="profile_image" />
            )}
            {(user && user?.photoURL !== null) && (
                <div style={{ height: "100px" }}>
                    <FaUserCircle style={{ width: "80%", height: "100%" }} />
                </div>
            )}
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