import React, { useState } from "react"
import '../App.css';
import NavBar from './NavBar';
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;


function Home() {
  return (
    <div className="Home">
        <NavBar />
        <h1>StudyNest Home Page</h1>
        {user && <h2>Welcome {user?.displayName}</h2>}
    </div>
  );
}

export default Home;
