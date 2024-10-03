// import logo from './logo.svg';
import Login from "./components/login"
import ChatDead from "./components/chat_is_dead"
import './App.css';

import { auth } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">

      {/* <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <h1>Firebase test</h1>
      {!user ? <Login/> : <ChatDead/>}
    </div>
  );
}

export default App;
