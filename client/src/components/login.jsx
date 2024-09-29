import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
function Login() {
    const [user, loading, error] = useAuthState(auth)
    async function handleLogin() {
        await signInWithPopup(auth, provider)
    }
    return (
        <>
            <h1> Login Form </h1>
            <button onClick={handleLogin}> </button>
            {loading && <p>Loading!</p>}
            {user && <><h2>{user[0]?.displayName}</h2>
                <img src={user[0]?.photoUrl} alt="Error" /> </>}
        </>
    )
}
export default Login