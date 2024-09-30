import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
function Login() {
    const [user, loading, error] = useAuthState(auth)
    async function handleLogin() {
        await signInWithPopup(auth, provider).catch(() => console.log("login error"))
    }
    return (
        <>
            <h1> Login Form </h1>
            <button onClick={handleLogin}> Login GOOGLE</button>
            {loading && <p>Loading!</p>}
            {user && <><h2>{user?.displayName}</h2>
                <img src={user?.photoURL} alt="profile_image" /> </>}
        </>
    )
}
export default Login